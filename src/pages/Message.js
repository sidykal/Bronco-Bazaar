// src/pages/Message.js

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  orderBy,
  serverTimestamp,
  setDoc,
  getDocs,
  where,
  arrayContains,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Message() {
  // --- 1) Make currentUser reactive by subscribing to Auth changes ---
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [users, setUsers] = useState([]);               // All other users for "New Chat"
  const [conversations, setConversations] = useState([]); // Chat history list
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);         // Current convo messages
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // --- 2) Load all other users (for starting new chats) ---
  useEffect(() => {
    if (!currentUser) return;
    const usersRef = collection(db, "users");
    getDocs(query(usersRef))
      .then((snap) => {
        const fetched = snap.docs
          .map((d) => ({ uid: d.id, ...d.data() }))
          .filter((u) => u.uid !== currentUser.uid);
        setUsers(fetched);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [currentUser]);

  // --- 3) FIXED: Load chat history using array-contains query ---
  useEffect(() => {
    if (!currentUser) return;
    
    const convRef = collection(db, "conversations");
    // Use array-contains to find conversations where participants contains currentUser.uid
    const q = query(convRef, where("participants", "array-contains", currentUser.uid));
    
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        console.log(`📋 Got ${snapshot.docs.length} conversation documents`);
        const fetched = [];
        
        // Use Promise.all to handle async operations properly
        const conversationPromises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          
          // Double-check that this is a valid 2-person conversation
          if (!Array.isArray(data.participants) || 
              data.participants.length !== 2 || 
              !data.participants.includes(currentUser.uid)) {
            return null;
          }

          // Find the "other" user's UID, then fetch that user's profile
          const otherUid = data.participants.find((uid) => uid !== currentUser.uid);
          if (!otherUid) return null;

          try {
            const userDocRef = doc(db, "users", otherUid);
            const userSnap = await getDoc(userDocRef);
            const otherUserData = userSnap.exists()
              ? { uid: otherUid, ...userSnap.data() }
              : { uid: otherUid, displayName: "Unknown User" };

            return { convoId: docSnap.id, user: otherUserData };
          } catch (error) {
            console.error("Error fetching user data:", error);
            return { convoId: docSnap.id, user: { uid: otherUid, displayName: "Unknown User" } };
          }
        });

        const results = await Promise.all(conversationPromises);
        const validConversations = results.filter(conv => conv !== null);
        console.log(`📋 Found ${validConversations.length} valid conversations`);
        setConversations(validConversations);
      },
      (error) => {
        console.error("Error listening to conversations:", error);
      }
    );
    return () => unsubscribe();
  }, [currentUser]);

  // --- 4) If navigated via "Make Offer", pre‐select that user ---
  useEffect(() => {
    if (!currentUser) return;
    const passedUid = location.state?.selectedUid;
    if (passedUid) {
      (async () => {
        try {
          const userDocRef = doc(db, "users", passedUid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setSelectedUser({ uid: passedUid, ...snap.data() });
          }
        } catch (err) {
          console.error("Error fetching passed user:", err);
        }
      })();
    }
  }, [location.state, currentUser]);

  // --- 5) When selectedUser changes, create+listen to that conversation's messages ---
  useEffect(() => {
    if (!selectedUser || !currentUser) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Build deterministic convoId
    const convoId =
      currentUser.uid < selectedUser.uid
        ? `${currentUser.uid}_${selectedUser.uid}`
        : `${selectedUser.uid}_${currentUser.uid}`;

    const convoDocRef = doc(db, "conversations", convoId);

    const createAndListen = async () => {
      // 5a) Create the conversation doc if missing
      try {
        console.log("🔄 Checking conversation document:", convoId);
        const convoSnap = await getDoc(convoDocRef);
        if (!convoSnap.exists()) {
          console.log("🔄 Creating conversation document");
          await setDoc(convoDocRef, {
            participants: [currentUser.uid, selectedUser.uid],
            createdAt: serverTimestamp(),
          });
          console.log(`🔄 Conversation ${convoId} created.`);
        } else {
          console.log(`🔄 Conversation ${convoId} already exists.`);
          console.log("🔄 Participants:", convoSnap.data().participants);
        }
      } catch (err) {
        console.error("Error ensuring conversation doc exists:", err);
        console.error("Error details:", {
          code: err.code,
          message: err.message,
          convoId,
          currentUserUid: currentUser.uid,
          selectedUserUid: selectedUser.uid
        });
        setLoading(false);
        return;
      }

      // 5b) Now listen to /conversations/{convoId}/messages
      const messagesRef = collection(db, "conversations", convoId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(`📨 Got ${snapshot.docs.length} messages for conversation ${convoId}`);
          const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setMessages(fetched);
          setLoading(false);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        },
        (error) => {
          console.error("Error listening to messages:", error);
          setLoading(false);
        }
      );

      return unsubscribe;
    };

    let unsubscribeFn;
    createAndListen().then((unsub) => {
      unsubscribeFn = unsub;
    });

    return () => {
      if (typeof unsubscribeFn === "function") unsubscribeFn();
    };
  }, [selectedUser, currentUser]);

  // --- 6) Handle sending a new message ---
  const handleSend = async (e) => {
    e.preventDefault();
    console.log("🔔 handleSend called. currentUser:", currentUser, "selectedUser:", selectedUser);
    console.log("🔔 newMessage (raw):", JSON.stringify(newMessage));

    // 6a) Abort if no text or no selected user
    if (!newMessage.trim() || !selectedUser || !currentUser) {
      console.log("🔔 Aborting send—either no message text, no selectedUser, or no currentUser.");
      return;
    }

    // 6b) Build the same convoId
    const convoId =
      currentUser.uid < selectedUser.uid
        ? `${currentUser.uid}_${selectedUser.uid}`
        : `${selectedUser.uid}_${currentUser.uid}`;
    console.log("🔔 handleSend convoId:", convoId);

    try {
      // Ensure conversation document exists before adding message
      const convoDocRef = doc(db, "conversations", convoId);
      console.log("🔔 Checking if conversation exists:", convoId);
      
      const convoSnap = await getDoc(convoDocRef);
      
      if (!convoSnap.exists()) {
        console.log("🔔 Creating new conversation document");
        await setDoc(convoDocRef, {
          participants: [currentUser.uid, selectedUser.uid],
          createdAt: serverTimestamp(),
        });
        console.log(`🔔 Conversation ${convoId} created during send.`);
        
        // Wait a bit to ensure the document is fully created
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.log("🔔 Conversation already exists");
      }

      console.log("🔔 Adding message to conversation");
      const messagesRef = collection(db, "conversations", convoId, "messages");
      const messageData = {
        text: newMessage.trim(),
        senderUid: currentUser.uid,
        receiverUid: selectedUser.uid,
        createdAt: serverTimestamp(),
      };
      console.log("🔔 Message data:", messageData);
      
      await addDoc(messagesRef, messageData);
      console.log("🔔 Message added successfully.");
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      console.error("Error details:", {
        code: err.code,
        message: err.message,
        convoId,
        currentUserUid: currentUser.uid,
        selectedUserUid: selectedUser.uid
      });
    }
  };

  // --- 7) When a user in the sidebar is clicked ---
  const handleUserSelect = (user) => {
    setLoading(true);
    setMessages([]);
    setSelectedUser(user);
  };

  // --- 8) Render ---
  // Don't show chat UI unless both selectedUser AND currentUser are defined
  if (!currentUser) {
    return <div style={{ color: "white", textAlign: "center", padding: "2rem" }}>Loading user…</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Sidebar: Chat History → New Chat */}
      <div style={sidebarStyle}>
        <h2 style={{ color: "white", textAlign: "center" }}>Conversations</h2>
        <ul style={userListStyle}>
          {conversations.map(({ convoId, user }) => (
            <li
              key={convoId}
              style={
                selectedUser?.uid === user.uid
                  ? { ...userItemStyle, backgroundColor: "#444" }
                  : userItemStyle
              }
              onClick={() => handleUserSelect(user)}
            >
              {user.displayName || user.email || "Unknown User"}
            </li>
          ))}
        </ul>

        <h2
          style={{
            color: "white",
            textAlign: "center",
            marginTop: "2rem",
            borderTop: "1px solid #444",
            paddingTop: "1rem",
          }}
        >
          New Chat
        </h2>
        <ul style={userListStyle}>
          {users.map((u) => (
            <li
              key={u.uid}
              style={
                selectedUser?.uid === u.uid
                  ? { ...userItemStyle, backgroundColor: "#444" }
                  : userItemStyle
              }
              onClick={() => handleUserSelect(u)}
            >
              {u.displayName || u.email || "Unknown User"}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div style={chatAreaStyle}>
        {selectedUser ? (
          <>
            <div style={chatHeaderStyle}>
              <h3 style={{ margin: 0 }}>{selectedUser.displayName || selectedUser.email || "Unknown User"}</h3>
            </div>

            <div style={messagesContainerStyle}>
              {loading ? (
                <p style={{ color: "white", textAlign: "center" }}>
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <p style={{ color: "white", textAlign: "center" }}>
                  No messages yet. Say hello!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={
                      msg.senderUid === currentUser.uid
                        ? sentMessageStyle
                        : receivedMessageStyle
                    }
                  >
                    <p style={{ margin: 0, color: "#fff" }}>{msg.text}</p>
                    <span style={timeStampStyle}>
                      {msg.createdAt?.toDate ? 
                        msg.createdAt.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : 
                        "Sending..."
                      }
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ONLY render the form when BOTH currentUser & selectedUser are defined */}
            <form style={inputContainerStyle} onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={inputStyle}
              />
              <button type="submit" style={sendButtonStyle}>
                Send
              </button>
            </form>
          </>
        ) : (
          <p style={{ color: "white", textAlign: "center", padding: "2rem" }}>
            Select a conversation or user to start chatting.
          </p>
        )}
      </div>
    </div>
  );
}

// — Styles (unchanged) —
const containerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#1f1f1f",
};
const sidebarStyle = {
  width: "300px",
  borderRight: "1px solid #333",
  backgroundColor: "#2c2c2c",
  overflowY: "auto",
  padding: "1rem 0",
};
const userListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};
const userItemStyle = {
  padding: "1rem 1.5rem",
  color: "white",
  cursor: "pointer",
  borderBottom: "1px solid #444",
};
const chatAreaStyle = {
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
};
const chatHeaderStyle = {
  padding: "1rem",
  borderBottom: "1px solid #333",
  backgroundColor: "#2c2c2c",
  color: "white",
};
const messagesContainerStyle = {
  flexGrow: 1,
  padding: "1rem",
  overflowY: "auto",
};
const sentMessageStyle = {
  alignSelf: "flex-end",
  backgroundColor: "#4a76a8",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "12px 12px 0 12px",
  margin: "0.5rem 0",
  maxWidth: "70%",
  position: "relative",
};
const receivedMessageStyle = {
  alignSelf: "flex-start",
  backgroundColor: "#333",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "12px 12px 12px 0",
  margin: "0.5rem 0",
  maxWidth: "70%",
  position: "relative",
};
const timeStampStyle = {
  fontSize: "0.7rem",
  position: "absolute",
  bottom: "-1.2rem",
  right: "0.5rem",
  color: "#aaa",
};
const inputContainerStyle = {
  display: "flex",
  padding: "0.5rem",
  borderTop: "1px solid #333",
  backgroundColor: "#2c2c2c",
};
const inputStyle = {
  flexGrow: 1,
  padding: "0.75rem",
  borderRadius: "20px",
  border: "none",
  outline: "none",
  marginRight: "0.5rem",
};
const sendButtonStyle = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "20px",
  backgroundColor: "#4a76a8",
  color: "white",
  cursor: "pointer",
};