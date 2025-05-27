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
    
    // Debounce API call
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=${maxResults}`)
        
        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        setResults(data.products || [])
        setIsOpen(true)
      } catch (error) {
        console.error('Error searching products:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
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
                      <p className="result-price">${Number(result.price).toFixed(2)}</p>
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
