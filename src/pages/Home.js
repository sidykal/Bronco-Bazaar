//home page that displays currently active posts
import React from 'react';
import ItemList from '../components/ItemList';

export default function Home({ items, onDelete }) {
  return (
    <div>
      <h2>Active Offers</h2>
      <ItemList items={items} onDelete={onDelete} />
    </div>
  );
}
