"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '../components/ProductCard/ProductCard';
import './search.css';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<{ products: any[]; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) fetchResults();
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setResults(data);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return (
      <div className="search-page">
        <div className="search-empty">
          <h1>Search Products</h1>
          <p>Type something to begin your search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Results for "{query}"</h1>
        {results && <p>{results.total || results.products?.length || 0} item(s) found</p>}
      </div>

      <div className="search-content">
        {loading ? (
          <div className="search-loading">
            <div className="loading-spinner" />
            <p>Searching...</p>
          </div>
        ) : error ? (
          <div className="search-error">
            <h2>{error}</h2>
            <button className="retry-button" onClick={fetchResults}>Try Again</button>
          </div>
        ) : results?.products?.length ? (
          <div className="products-grid">
            {results.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h2>No results</h2>
            <p>Try different or more general terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="search-loading">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
