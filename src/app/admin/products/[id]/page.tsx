'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import '../../admin.css';

interface ProductSize {
  id: string
  size: string
  stock: number
}

interface ProductColor {
  id: string
  color: string
  stock: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
  category: {
    name: string
  }
  sizes: ProductSize[]
  colors: ProductColor[]
}

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newSize, setNewSize] = useState('')
  const [newColor, setNewColor] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Utility functions for showing messages
  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setErrorMessage('')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setSuccessMessage('')
    setTimeout(() => setErrorMessage(''), 5000)
  }

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Fetch product data
  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const authToken = localStorage.getItem('authToken')
      const response = await fetch(`/api/admin/products/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded product data:', data)
        console.log('Sizes:', data.sizes)
        console.log('Colors:', data.colors)
        setProduct(data)
      } else {
        console.error('Failed to fetch product:', response.status, response.statusText)
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/admin/products')
    } finally {
      setLoadingProduct(false)
    }
  }

  const updateProductStock = async (field: string, value: number) => {
    if (!product) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ [field]: value }),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProduct(updatedProduct)
        showSuccess('Product stock updated successfully!')
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showError('Error updating product. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const updateSizeStock = async (sizeId: string, stock: number) => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}/sizes/${sizeId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stock }),
      })

      if (response.ok) {
        const updatedSize = await response.json()
        setProduct(prev => prev ? {
          ...prev,
          sizes: prev.sizes.map(size => 
            size.id === sizeId ? { ...size, stock: updatedSize.stock } : size
          )
        } : null)
      } else {
        alert('Failed to update size stock')
      }
    } catch (error) {
      console.error('Error updating size stock:', error)
      alert('Error updating size stock')
    }
  }

  const updateColorStock = async (colorId: string, stock: number) => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}/colors/${colorId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stock }),
      })

      if (response.ok) {
        const updatedColor = await response.json()
        setProduct(prev => prev ? {
          ...prev,
          colors: prev.colors.map(color => 
            color.id === colorId ? { ...color, stock: updatedColor.stock } : color
          )
        } : null)
      } else {
        alert('Failed to update color stock')
      }
    } catch (error) {
      console.error('Error updating color stock:', error)
      alert('Error updating color stock')
    }
  }

  const addSize = async () => {
    if (!newSize.trim() || !product) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}/sizes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ size: newSize.trim(), stock: 0 }),
      })

      if (response.ok) {
        const newSizeData = await response.json()
        setProduct(prev => prev ? {
          ...prev,
          sizes: [...prev.sizes, newSizeData]
        } : null)
        setNewSize('')
        showSuccess(`Size "${newSize.trim()}" added successfully!`)
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to add size')
      }
    } catch (error) {
      console.error('Error adding size:', error)
      showError('Error adding size. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const addColor = async () => {
    if (!newColor.trim() || !product) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}/colors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ color: newColor.trim(), stock: 0 }),
      })

      if (response.ok) {
        const newColorData = await response.json()
        setProduct(prev => prev ? {
          ...prev,
          colors: [...prev.colors, newColorData]
        } : null)
        setNewColor('')
        showSuccess(`Color "${newColor.trim()}" added successfully!`)
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to add color')
      }
    } catch (error) {
      console.error('Error adding color:', error)
      showError('Error adding color. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const deleteSize = async (sizeId: string) => {
    if (!confirm('Are you sure you want to delete this size? This action cannot be undone.')) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}/sizes/${sizeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const deletedSize = product?.sizes.find(size => size.id === sizeId)
        setProduct(prev => prev ? {
          ...prev,
          sizes: prev.sizes.filter(size => size.id !== sizeId)
        } : null)
        showSuccess(`Size "${deletedSize?.size}" deleted successfully!`)
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to delete size')
      }
    } catch (error) {
      console.error('Error deleting size:', error)
      showError('Error deleting size. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const deleteColor = async (colorId: string) => {
    if (!confirm('Are you sure you want to delete this color? This action cannot be undone.')) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}/colors/${colorId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const deletedColor = product?.colors.find(color => color.id === colorId)
        setProduct(prev => prev ? {
          ...prev,
          colors: prev.colors.filter(color => color.id !== colorId)
        } : null)
        showSuccess(`Color "${deletedColor?.color}" deleted successfully!`)
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to delete color')
      }
    } catch (error) {
      console.error('Error deleting color:', error)
      showError('Error deleting color. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  if (isLoading || loadingProduct) {
    return (
      <div className="admin-edit-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner"></div>
          <span className="ml-2">Loading product...</span>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  if (!product) {
    return (
      <div className="admin-edit-container">
        <div className="error-message">
          Product not found. <button onClick={() => router.push('/admin/products')} className="underline">Back to Products</button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-edit-container">
      <div className="admin-edit-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="admin-edit-title">Edit Product</h1>
            <p className="admin-edit-subtitle">Manage product details, stock levels, and variants</p>
          </div>
          <button 
            onClick={() => router.push('/admin/products')}
            className="update-button"
          >
            Back to Products
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="product-info-section">
        <h2 className="section-title">Product Information</h2>
        <div className="product-info-grid">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
          <div className="product-details">
            <div className="product-detail-item">
              <span className="product-detail-label">Name:</span>
              <span className="product-detail-value">{product.name}</span>
            </div>
            <div className="product-detail-item">
              <span className="product-detail-label">Description:</span>
              <span className="product-detail-value">{product.description}</span>
            </div>
            <div className="product-detail-item">
              <span className="product-detail-label">Category:</span>
              <span className="product-detail-value">{product.category.name}</span>
            </div>
            <div className="product-detail-item">
              <span className="product-detail-label">Price:</span>
              <span className="product-detail-value price-value">${product.price}</span>
            </div>
            <div className="product-detail-item">
              <span className="product-detail-label">Main Stock:</span>
              <span className={`product-detail-value stock-value ${product.stock > 0 ? 'in-stock' : ''}`}>
                {product.stock} units
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="stock-section">
        <h2 className="section-title">Main Stock Management</h2>
        <div className="stock-form">
          <label className="stock-label">Stock Quantity:</label>
          <input
            type="number"
            min="0"
            value={product.stock}
            onChange={(e) => updateProductStock('stock', parseInt(e.target.value) || 0)}
            className="stock-input"
          />
          <button 
            onClick={() => updateProductStock('stock', product.stock)}
            className="update-button"
            disabled={updating}
          >
            {updating ? <><div className="loading-spinner"></div>Updating...</> : 'Update Stock'}
          </button>
        </div>
      </div>

      <div className="variants-section">
        <h2 className="section-title">Size Variants</h2>
        
        <div className="add-variant-form">
          <h3 className="add-variant-title">Add New Size</h3>
          <div className="variant-form-row">
            <input
              type="text"
              placeholder="Size (e.g., S, M, L, XL)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="variant-input"
            />
            <button 
              onClick={addSize} 
              className="add-button"
              disabled={!newSize.trim() || updating}
            >
              {updating ? <><div className="loading-spinner"></div>Adding...</> : 'Add Size'}
            </button>
          </div>
        </div>

        <div className="variant-list">
          {product.sizes.map(size => (
            <div key={size.id} className="variant-item">
              <div className="variant-header">
                <span className="variant-name">Size: {size.size}</span>
                <span className={`variant-stock ${size.stock > 0 ? 'in-stock' : ''}`}>
                  Stock: {size.stock}
                </span>
              </div>
              <div className="variant-actions">
                <div className="variant-stock-form">
                  <label className="stock-label">Stock:</label>
                  <input
                    type="number"
                    min="0"
                    value={size.stock}
                    onChange={(e) => updateSizeStock(size.id, parseInt(e.target.value) || 0)}
                    className="variant-stock-input"
                  />
                  <button
                    onClick={() => updateSizeStock(size.id, size.stock)}
                    className="small-button small-update-button"
                    disabled={updating}
                  >
                    Update
                  </button>
                </div>
                <button
                  onClick={() => deleteSize(size.id)}
                  className="small-button delete-button"
                  disabled={updating}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {product.sizes.length === 0 && (
            <div className="text-gray-500 text-center py-4">No size variants added yet</div>
          )}
        </div>
      </div>

      <div className="variants-section">
        <h2 className="section-title">Color Variants</h2>
        
        <div className="add-variant-form">
          <h3 className="add-variant-title">Add New Color</h3>
          <div className="variant-form-row">
            <input
              type="text"
              placeholder="Color (e.g., Red, Blue, Black)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="variant-input"
            />
            <button 
              onClick={addColor} 
              className="add-button"
              disabled={!newColor.trim() || updating}
            >
              {updating ? <><div className="loading-spinner"></div>Adding...</> : 'Add Color'}
            </button>
          </div>
        </div>

        <div className="variant-list">
          {product.colors.map(color => (
            <div key={color.id} className="variant-item">
              <div className="variant-header">
                <span className="variant-name">Color: {color.color}</span>
                <span className={`variant-stock ${color.stock > 0 ? 'in-stock' : ''}`}>
                  Stock: {color.stock}
                </span>
              </div>
              <div className="variant-actions">
                <div className="variant-stock-form">
                  <label className="stock-label">Stock:</label>
                  <input
                    type="number"
                    min="0"
                    value={color.stock}
                    onChange={(e) => updateColorStock(color.id, parseInt(e.target.value) || 0)}
                    className="variant-stock-input"
                  />
                  <button
                    onClick={() => updateColorStock(color.id, color.stock)}
                    className="small-button small-update-button"
                    disabled={updating}
                  >
                    Update
                  </button>
                </div>
                <button
                  onClick={() => deleteColor(color.id)}
                  className="small-button delete-button"
                  disabled={updating}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {product.colors.length === 0 && (
            <div className="text-gray-500 text-center py-4">No color variants added yet</div>
          )}
        </div>
      </div>

      {/* Debug section - remove this in production */}
      <div className="variants-section" style={{backgroundColor: '#f0f0f0', border: '2px dashed #ccc'}}>
        <h2 className="section-title">Debug Information</h2>
        <div style={{fontSize: '0.875rem', fontFamily: 'monospace'}}>
          <p><strong>Product Stock:</strong> {product.stock}</p>
          <p><strong>Sizes count:</strong> {product.sizes?.length || 0}</p>
          <p><strong>Colors count:</strong> {product.colors?.length || 0}</p>
          {product.sizes?.length > 0 && (
            <div>
              <p><strong>Sizes data:</strong></p>
              <pre style={{background: 'white', padding: '0.5rem', borderRadius: '4px'}}>
                {JSON.stringify(product.sizes, null, 2)}
              </pre>
            </div>
          )}
          {product.colors?.length > 0 && (
            <div>
              <p><strong>Colors data:</strong></p>
              <pre style={{background: 'white', padding: '0.5rem', borderRadius: '4px'}}>
                {JSON.stringify(product.colors, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="variants-section">
        <h2 className="section-title">Size Variants</h2>
        
        <div className="add-variant-form">
          <h3 className="add-variant-title">Add New Size</h3>
          <div className="variant-form-row">
            <input
              type="text"
              placeholder="Size (e.g., S, M, L, XL)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="variant-input"
            />
            <button 
              onClick={addSize} 
              className="add-button"
              disabled={!newSize.trim() || updating}
            >
              {updating ? <><div className="loading-spinner"></div>Adding...</> : 'Add Size'}
            </button>
          </div>
        </div>

        <div className="variant-list">
          {product.sizes.map(size => (
            <div key={size.id} className="variant-item">
              <div className="variant-header">
                <span className="variant-name">Size: {size.size}</span>
                <span className={`variant-stock ${size.stock > 0 ? 'in-stock' : ''}`}>
                  Stock: {size.stock}
                </span>
              </div>
              <div className="variant-actions">
                <div className="variant-stock-form">
                  <label className="stock-label">Stock:</label>
                  <input
                    type="number"
                    min="0"
                    value={size.stock}
                    onChange={(e) => updateSizeStock(size.id, parseInt(e.target.value) || 0)}
                    className="variant-stock-input"
                  />
                  <button
                    onClick={() => updateSizeStock(size.id, size.stock)}
                    className="small-button small-update-button"
                    disabled={updating}
                  >
                    Update
                  </button>
                </div>
                <button
                  onClick={() => deleteSize(size.id)}
                  className="small-button delete-button"
                  disabled={updating}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {product.sizes.length === 0 && (
            <div className="text-gray-500 text-center py-4">No size variants added yet</div>
          )}
        </div>
      </div>

      <div className="variants-section">
        <h2 className="section-title">Color Variants</h2>
        
        <div className="add-variant-form">
          <h3 className="add-variant-title">Add New Color</h3>
          <div className="variant-form-row">
            <input
              type="text"
              placeholder="Color (e.g., Red, Blue, Black)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="variant-input"
            />
            <button 
              onClick={addColor} 
              className="add-button"
              disabled={!newColor.trim() || updating}
            >
              {updating ? <><div className="loading-spinner"></div>Adding...</> : 'Add Color'}
            </button>
          </div>
        </div>

        <div className="variant-list">
          {product.colors.map(color => (
            <div key={color.id} className="variant-item">
              <div className="variant-header">
                <span className="variant-name">Color: {color.color}</span>
                <span className={`variant-stock ${color.stock > 0 ? 'in-stock' : ''}`}>
                  Stock: {color.stock}
                </span>
              </div>
              <div className="variant-actions">
                <div className="variant-stock-form">
                  <label className="stock-label">Stock:</label>
                  <input
                    type="number"
                    min="0"
                    value={color.stock}
                    onChange={(e) => updateColorStock(color.id, parseInt(e.target.value) || 0)}
                    className="variant-stock-input"
                  />
                  <button
                    onClick={() => updateColorStock(color.id, color.stock)}
                    className="small-button small-update-button"
                    disabled={updating}
                  >
                    Update
                  </button>
                </div>
                <button
                  onClick={() => deleteColor(color.id)}
                  className="small-button delete-button"
                  disabled={updating}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {product.colors.length === 0 && (
            <div className="text-gray-500 text-center py-4">No color variants added yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
