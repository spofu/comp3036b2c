"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './Cart.css';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartProps {
  items?: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onClearCart?: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(items);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    onUpdateQuantity?.(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    onRemoveItem?.(id);
  };

  const handleClearCart = () => {
    setCartItems([]);
    onClearCart?.();
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.1; // 10% tax
  };

  const calculateShipping = (subtotal: number) => {
    return subtotal > 100 ? 0 : 10; // Free shipping over $100
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    return subtotal + tax + shipping;
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 18" />
            </svg>
          </div>
          <h2 className="cart-empty-title">Your cart is empty</h2>
          <p className="cart-empty-description">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button className="cart-empty-button">
            <Link href="/">Continue Shopping</Link>
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <button 
          className="cart-clear-button"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="item-image"
                />
              </div>
              
              <div className="cart-item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-variants">
                  {item.size && <span className="item-size">Size: {item.size}</span>}
                  {item.color && <span className="item-color">Color: {item.color}</span>}
                </div>
                <p className="item-price">${Number(item.price).toFixed(2)}</p>
              </div>

              <div className="cart-item-quantity">
                <button 
                  className="quantity-button"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  className="quantity-button"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              <div className="cart-item-total">
                <p className="item-total">${(Number(item.price) * item.quantity).toFixed(2)}</p>
              </div>

              <button 
                className="cart-item-remove"
                onClick={() => handleRemoveItem(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-card">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-line">
              <span className="summary-label">Subtotal ({cartItems.length} items)</span>
              <span className="summary-value">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-line">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            
            <div className="summary-line">
              <span className="summary-label">Tax</span>
              <span className="summary-value">${tax.toFixed(2)}</span>
            </div>

            {shipping === 0 && (
              <div className="free-shipping-note">
                🎉 You qualify for free shipping!
              </div>
            )}

            {shipping > 0 && (
              <div className="shipping-note">
                Add ${(100 - subtotal).toFixed(2)} more for free shipping
              </div>
            )}
            
            <div className="summary-line summary-total">
              <span className="summary-label">Total</span>
              <span className="summary-value">${total.toFixed(2)}</span>
            </div>

            {isLoggedIn ? (
              <Link href="/checkout">
                <button className="checkout-button">
                  Proceed to Checkout
                </button>
              </Link>
            ) : (
              <div className="auth-prompt">
                <p className="auth-message">Please sign in to continue with checkout</p>
                <Link href="/login">
                  <button className="login-to-checkout-button">
                    Sign In to Checkout
                  </button>
                </Link>
                <p className="guest-note">
                  New customer? You'll be able to create an account during checkout.
                </p>
              </div>
            )}

            <div className="payment-methods">
              <p className="payment-title">We Accept</p>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">💰</span>
                <span className="payment-icon">🏦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};