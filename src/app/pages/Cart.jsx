"use client"

import React from 'react';
import { Cart as CartComponent } from '../components/Cart/Cart';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem,
    getTotalItems,
    getTotalPrice 
  } = useCart();

  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    // In a real app, this would navigate to checkout page
    console.log('Proceeding to checkout with items:', cartItems);
    alert('Proceeding to checkout...');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        
        <CartComponent
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};
