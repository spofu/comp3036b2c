"use client"

import React, { useState, useEffect } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import { Filter } from '../Filter/Filter';
import './ProductsDisplay.css';

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

interface ProductsDisplayProps {
  category?: string;
  limit?: number;
  title?: string;
  showFilters?: boolean;
}

export const ProductsDisplay: React.FC<ProductsDisplayProps> = ({ 
  category, 
  limit, 
  title = "Our Products",
  showFilters = true 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (category && category !== 'all') {
          params.append('category', category);
        }
        if (limit) {
          params.append('limit', limit.toString());
        }
        
        const response = await fetch(`/api/products?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]];

  if (loading) {
    return (
      <div className="products-display">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-display">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-display">
      <div className="products-header">
        <h2 className="products-title">{title}</h2>
      </div>

      {showFilters && (
        <Filter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          productCount={filteredProducts.length}
          onShowAll={() => setSelectedCategory('all')}
          showShowAllButton={true}
        />
      )}

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      ) : null}

      {!showFilters && products.length > filteredProducts.length && (
        <div className="view-more">
          <button 
            onClick={() => {/* Navigate to full products page */}}
            className="view-more-button"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};
