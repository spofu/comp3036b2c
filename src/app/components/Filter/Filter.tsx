"use client"

import React from 'react';
import './Filter.css';

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  productCount: number;
  onShowAll?: () => void;
  showShowAllButton?: boolean;
}

export const Filter: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  productCount,
  onShowAll,
  showShowAllButton = false
}) => {
  return (
    <div className="filter-container">
      <div className="products-filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select 
            id="category-filter"
            value={selectedCategory} 
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Sort by:</label>
          <select 
            id="sort-filter"
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {productCount === 0 ? (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
          {showShowAllButton && selectedCategory !== 'all' && onShowAll && (
            <button 
              onClick={onShowAll}
              className="show-all-button"
            >
              Show All Products
            </button>
          )}
        </div>
      ) : (
        <p className="products-count">
          {productCount} product{productCount !== 1 ? 's' : ''} found
        </p>
      )}
    </div>
  );
};