"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  productId?: string;
  productVariantId?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncCartWithDatabase: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, isLoggedIn } = useAuth();

  // Load cart from localStorage or database on mount
  useEffect(() => {
    const loadCart = async () => {
      console.log('🛒 CartContext: Loading cart, isLoggedIn:', isLoggedIn, 'user:', user?.id);
      
      if (isLoggedIn && user) {
        // For logged-in users: transfer localStorage cart to database first, then sync
        const savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
          try {
            const localCartItems = JSON.parse(savedCart);
            console.log('🛒 CartContext: Found local cart to transfer:', localCartItems);
            
            // Transfer each item to database
            for (const item of localCartItems) {
              await addItemToDatabase(item);
            }
            
            // Clear localStorage after successful transfer
            localStorage.removeItem('shopping-cart');
            console.log('🛒 CartContext: Transferred local cart to database and cleared localStorage');
          } catch (error) {
            console.error('Error transferring cart to database:', error);
          }
        }
        
        // Load from database for logged-in users
        console.log('🛒 CartContext: Loading from database for user:', user.id);
        await syncCartWithDatabase();
      } else {
        // Load from localStorage for guest users
        const savedCart = localStorage.getItem('shopping-cart');
        console.log('🛒 CartContext: Checking localStorage, found:', savedCart);
        
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            console.log('🛒 CartContext: Parsed cart from localStorage:', parsedCart);
            setItems(parsedCart);
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
          }
        } else {
          console.log('🛒 CartContext: No cart found in localStorage');
        }
      }
    };

    loadCart();
  }, [isLoggedIn, user]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('shopping-cart', JSON.stringify(items));
    }
  }, [items, isLoggedIn]);

  // Sync cart with database when user logs in
  useEffect(() => {
    if (isLoggedIn && user) {
      syncCartWithDatabase();
    } else {
      // When user logs out, clear cart items but keep localStorage for guest usage
      setItems([]);
    }
  }, [isLoggedIn, user]);

  const syncCartWithDatabase = async () => {
    if (!isLoggedIn || !user) return;

    try {
      console.log('🛒 CartContext: Syncing with database for user:', user.id);
      const response = await fetch(`/api/cart?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('🛒 CartContext: Database response:', data);
        setItems(data.cartItems || []);
      }
    } catch (error) {
      console.error('Error syncing cart with database:', error);
    }
  };

  // Helper function to add items from localStorage to database
  const addItemToDatabase = async (item: CartItem) => {
    if (!isLoggedIn || !user) return;

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId: item.productId || item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })
      });
    } catch (error) {
      console.error('Error adding item to database:', error);
    }
  };

  const addItem = async (newItem: CartItem) => {
    const updatedItems = await new Promise<CartItem[]>((resolve) => {
      setItems(currentItems => {
        const existingItem = currentItems.find(item => 
          item.id === newItem.id && 
          item.size === newItem.size && 
          item.color === newItem.color
        );

        let updated;
        if (existingItem) {
          updated = currentItems.map(item =>
            item.id === existingItem.id && 
            item.size === existingItem.size && 
            item.color === existingItem.color
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          updated = [...currentItems, newItem];
        }
        
        resolve(updated);
        return updated;
      });
    });

    // Sync with database if user is logged in
    if (isLoggedIn && user) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            productId: newItem.productId || newItem.id,
            quantity: newItem.quantity,
            size: newItem.size,
            color: newItem.color
          })
        });
      } catch (error) {
        console.error('Error syncing add item with database:', error);
      }
    }
  };

  const removeItem = async (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));

    // Sync with database if user is logged in
    if (isLoggedIn && user) {
      try {
        await fetch(`/api/cart?userId=${user.id}&itemId=${id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error syncing remove item with database:', error);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    // Sync with database if user is logged in
    if (isLoggedIn && user) {
      try {
        await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            itemId: id,
            quantity
          })
        });
      } catch (error) {
        console.error('Error syncing update quantity with database:', error);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);

    // Clear localStorage
    localStorage.removeItem('shopping-cart');

    // Clear database if user is logged in
    if (isLoggedIn && user) {
      try {
        await fetch(`/api/cart/clear?userId=${user.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error clearing cart in database:', error);
      }
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const contextValue: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    syncCartWithDatabase
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
