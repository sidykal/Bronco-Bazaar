//script for page to create new post
import React from 'react';
import ItemForm from '../components/ItemForm';

export default function Create({ onAdd }) {
  return (
    <div>
      
      {/*<h2>Create New Offer</h2>*/}
      <ItemForm onAdd={onAdd} />
    </div>
  );
}


