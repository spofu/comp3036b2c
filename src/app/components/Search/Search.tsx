"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './Search.css'

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description?: string;
}

interface SearchProps {
  placeholder?: string;
  maxResults?: number;
}

export const Search = ({ placeholder = "Search for products...", maxResults = 5 }: SearchProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock data - replace with actual API call
  const mockProducts: SearchResult[] = [
    {
      id: '1',
      name: 'Classic White T-Shirt',
      category: 'Mens',
      price: 29.99,
      imageUrl: '/placeholder-tshirt.jpg',
      description: 'Comfortable cotton t-shirt'
    },
    {
      id: '2',
      name: 'Blue Denim Jeans',
      category: 'Mens',
      price: 79.99,
      imageUrl: '/placeholder-jeans.jpg',
      description: 'Premium denim jeans'
    },
    {
      id: '3',
      name: 'Summer Dress',
      category: 'Womens',
      price: 89.99,
      imageUrl: '/placeholder-dress.jpg',
      description: 'Elegant summer dress'
    },
    {
      id: '4',
      name: 'Kids Sneakers',
      category: 'Kids',
      price: 49.99,
      imageUrl: '/placeholder-sneakers.jpg',
      description: 'Comfortable kids sneakers'
    },
    {
      id: '5',
      name: 'Leather Jacket',
      category: 'Mens',
      price: 199.99,
      imageUrl: '/placeholder-jacket.jpg',
      description: 'Premium leather jacket'
    }
  ]

  // Debounced search function
  useEffect(() => {
    if (query.length === 0) {
      setResults([])
      setIsOpen(false)
      return
    }

    if (query.length < 2) {
      return
    }

    setIsLoading(true)
    
    // Simulate API delay
    const timeoutId = setTimeout(() => {
      const filteredResults = mockProducts
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, maxResults)
      
      setResults(filteredResults)
      setIsLoading(false)
      setIsOpen(true)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, maxResults])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              className="clear-button"
              onClick={() => {
                setQuery('')
                setResults([])
                setIsOpen(false)
              }}
            >
              <svg className="clear-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="search-dropdown">
          {isLoading ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <span>Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="search-results">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/product/${result.id}`}
                    className="search-result-item"
                    onClick={handleResultClick}
                  >
                    <div className="result-image">
                      <Image
                        src={result.imageUrl}
                        alt={result.name}
                        width={40}
                        height={40}
                        className="product-thumbnail"
                      />
                    </div>
                    <div className="result-content">
                      <h4 className="result-title">{result.name}</h4>
                      <p className="result-category">{result.category}</p>
                      <p className="result-price">${result.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {query && (
                <div className="search-footer">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="view-all-link"
                    onClick={handleResultClick}
                  >
                    View all results for "{query}"
                  </Link>
                </div>
              )}
            </>
          ) : query.length >= 2 ? (
            <div className="no-results">
              <p>No products found for "{query}"</p>
              <p className="no-results-suggestion">Try searching for something else</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
