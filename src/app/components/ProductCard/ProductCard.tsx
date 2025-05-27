"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    
    setIsAdding(true);
    
    try {
      // Add to cart using context
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      });

      // Also sync with backend
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '1', // In a real app, get this from auth context
          productId: product.id,
          quantity: 1,
          size: selectedSize,
          color: selectedColor
        })
      });

      if (!response.ok) {
        console.error('Failed to sync with backend cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }

    // Show feedback animation
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="product-card">
      <Link href={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="product-image"
          />
          {product.category && (
            <span className="product-category">{product.category}</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${Number(product.price).toFixed(2)}</p>
          
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
        </div>
      </Link>

      <div className="product-actions">
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-options">
            <label className="option-label">Size:</label>
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
              className="option-select"
            >
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="product-options">
            <label className="option-label">Color:</label>
            <select 
              value={selectedColor} 
              onChange={(e) => setSelectedColor(e.target.value)}
              className="option-select"
            >
              {product.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        )}

        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
