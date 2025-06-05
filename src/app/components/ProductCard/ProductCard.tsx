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
  sizes?: Array<{ size: string; inStock: boolean }>;
  colors?: Array<{ color: string; inStock: boolean }>;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.find(s => s.inStock)?.size || product.sizes?.[0]?.size || ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.find(c => c.inStock)?.color || product.colors?.[0]?.color || ''
  );
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    
    setIsAdding(true);
    
    try {
      // Add to cart using context (handles both localStorage and database)
      await addItem({
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      });

      // Show success feedback
      console.log('Item added to cart successfully');
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
              {product.sizes.map(sizeOption => (
                <option 
                  key={sizeOption.size} 
                  value={sizeOption.size}
                  disabled={!sizeOption.inStock}
                >
                  {sizeOption.size}{!sizeOption.inStock ? ' (Out of Stock)' : ''}
                </option>
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
              {product.colors.map(colorOption => (
                <option 
                  key={colorOption.color} 
                  value={colorOption.color}
                  disabled={!colorOption.inStock}
                >
                  {colorOption.color}{!colorOption.inStock ? ' (Out of Stock)' : ''}
                </option>
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
