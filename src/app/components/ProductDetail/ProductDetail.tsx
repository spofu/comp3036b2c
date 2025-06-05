"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  sizes: Array<{ size: string; inStock: boolean }>;
  colors: Array<{ color: string; inStock: boolean }>;
  images: string[];
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  features: string[];
  specifications: {
    material: string;
    care: string;
    origin: string;
    weight: string;
    fit: string;
  };
}

interface ProductDetailProps {
  productId: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specifications'>('description');
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();
        setProduct(data.product);
        
        // Set default selections to first available (in stock) options
        const firstAvailableSize = data.product.sizes.find((s: any) => s.inStock)?.size || data.product.sizes[0]?.size;
        const firstAvailableColor = data.product.colors.find((c: any) => c.inStock)?.color || data.product.colors[0]?.color;
        
        setSelectedSize(firstAvailableSize);
        setSelectedColor(firstAvailableColor);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

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
        quantity
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

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < Math.floor(rating) ? 'filled' : index < rating ? 'half' : ''}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Product Not Found</h2>
        <p>{error || 'The product you are looking for does not exist.'}</p>
        <button onClick={() => window.history.back()} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Image Gallery */}
        <div className="product-images">
          <div className="main-image">
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={500}
              height={500}
              className="main-product-image"
            />
          </div>
          <div className="image-thumbnails">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="thumbnail-image"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <span className="product-category">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.averageRating)}
              </div>
              <span className="rating-text">
                {product.averageRating} ({product.reviewCount} reviews)
              </span>
            </div>
            <div className="product-price">${product.price.toFixed(2)}</div>
          </div>

          <div className="product-options">
            {/* Size Selection */}
            <div className="option-group">
              <label className="option-label">Size:</label>
              <div className="size-options">
                {product.sizes.map(sizeOption => (
                  <button
                    key={sizeOption.size}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    disabled={!sizeOption.inStock}
                    className={`size-option ${selectedSize === sizeOption.size ? 'selected' : ''} ${!sizeOption.inStock ? 'out-of-stock' : ''}`}
                    title={!sizeOption.inStock ? 'Out of stock' : undefined}
                  >
                    {sizeOption.size}
                    {!sizeOption.inStock && <span className="out-of-stock-indicator">✗</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="option-group">
              <label className="option-label">Color: {selectedColor}</label>
              <div className="color-options">
                {product.colors.map(colorOption => (
                  <button
                    key={colorOption.color}
                    onClick={() => setSelectedColor(colorOption.color)}
                    disabled={!colorOption.inStock}
                    className={`color-option ${selectedColor === colorOption.color ? 'selected' : ''} ${!colorOption.inStock ? 'out-of-stock' : ''}`}
                    style={{ backgroundColor: colorOption.color.toLowerCase() }}
                    title={!colorOption.inStock ? `${colorOption.color} - Out of stock` : colorOption.color}
                  >
                    {selectedColor === colorOption.color && <span className="color-check">✓</span>}
                    {!colorOption.inStock && <span className="color-out-of-stock">✗</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="option-group">
              <label className="option-label">Quantity:</label>
              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <span className="stock-info">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="add-to-cart-section">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className={`add-to-cart-button ${isAdding ? 'adding' : ''}`}
            >
              {isAdding ? 'Adding to Cart...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Product Features */}
          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-tabs">
        <div className="tab-headers">
          <button
            onClick={() => setActiveTab('description')}
            className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
          >
            Reviews ({product.reviewCount})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-tab">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-tab">
              <table className="specifications-table">
                <tbody>
                  <tr>
                    <td>Material</td>
                    <td>{product.specifications.material}</td>
                  </tr>
                  <tr>
                    <td>Care Instructions</td>
                    <td>{product.specifications.care}</td>
                  </tr>
                  <tr>
                    <td>Origin</td>
                    <td>{product.specifications.origin}</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>{product.specifications.weight}</td>
                  </tr>
                  <tr>
                    <td>Fit</td>
                    <td>{product.specifications.fit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              {product.reviews.length > 0 ? (
                <div className="reviews-list">
                  {product.reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-name">{review.user.name}</span>
                          <div className="review-stars">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
