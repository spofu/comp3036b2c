'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import '../../admin.css';

interface Category {
  id: string
  name: string
}

interface ProductVariant {
  id: string
  productId: string
  sku?: string
  size?: string
  color?: string
  material?: string
  price?: number
  stock: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

interface ProductImage {
  id: string
  productId: string
  imageData: string
  fileName: string
  fileSize: number
  mimeType: string
  isPrimary: boolean
  altText?: string
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  categoryId: string
  slug?: string
  category: {
    id: string
    name: string
  }
  variants: ProductVariant[]
  images: ProductImage[]
}

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: ''
  })
  const [newVariant, setNewVariant] = useState({
    size: '',
    color: '',
    material: '',
    price: '',
    stock: 0,
    sku: ''
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

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

  // Image management functions
  const fetchProductImages = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}/images`, {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setProductImages(data.images || [])
      }
    } catch (error) {
      console.error('Error fetching product images:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        showError(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        showError(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles)
      
      // Create preview URLs
      const urls = validFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const base64 = reader.result as string
            resolve(base64)
          }
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsDataURL(file)
        })
      })

      const base64Images = await Promise.all(uploadPromises)

      // Upload each image
      for (let i = 0; i < base64Images.length; i++) {
        const file = selectedFiles[i]
        const base64 = base64Images[i]

        const response = await fetch(`/api/admin/products/${params.id}/images`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            imageData: base64,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            isPrimary: productImages.length === 0 && i === 0 // First image is primary if no images exist
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to upload image')
        }
      }

      // Refresh images and clear selections
      await fetchProductImages()
      setSelectedFiles([])
      setPreviewUrls([])
      showSuccess(`${selectedFiles.length} image(s) uploaded successfully!`)
    } catch (error) {
      console.error('Error uploading images:', error)
      showError(error instanceof Error ? error.message : 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/admin/products/${params.id}/images/${imageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        await fetchProductImages()
        showSuccess('Image deleted successfully!')
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      showError('Error deleting image')
    }
  }

  const setPrimaryImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}/images/${imageId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isPrimary: true })
      })

      if (response.ok) {
        await fetchProductImages()
        showSuccess('Primary image updated!')
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to update primary image')
      }
    } catch (error) {
      console.error('Error setting primary image:', error)
      showError('Error updating primary image')
    }
  }

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Fetch product data and categories
  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchCategories()
    }
  }, [params.id])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

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
        setProduct(data)
        // Initialize edit form
        setEditForm({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          stock: data.stock.toString(),
          imageUrl: data.imageUrl || '',
          categoryId: data.categoryId
        })
        // Load existing images
        fetchProductImages()
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

  const updateProduct = async () => {
    if (!product) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProduct(updatedProduct)
        setEditMode(false)
        showSuccess('Product updated successfully!')
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

  const cancelEdit = () => {
    if (product) {
      setEditForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId
      })
    }
    setEditMode(false)
  }

  const updateVariantStock = async (variantId: string, stock: number) => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}/variants/${variantId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stock }),
      })

      if (response.ok) {
        const updatedVariant = await response.json()
        setProduct(prev => prev ? {
          ...prev,
          variants: prev.variants.map(variant => 
            variant.id === variantId ? { ...variant, stock: updatedVariant.stock } : variant
          )
        } : null)
        showSuccess('Variant stock updated successfully!')
      } else {
        showError('Failed to update variant stock')
      }
    } catch (error) {
      console.error('Error updating variant stock:', error)
      showError('Error updating variant stock')
    }
  }

  const addVariant = async () => {
    if (!product) return

    // Validate required fields
    if (!newVariant.size && !newVariant.color && !newVariant.material) {
      showError('Please provide at least one variant attribute (size, color, or material)')
      return
    }

    setUpdating(true)
    try {
      const variantData = {
        ...newVariant,
        price: newVariant.price ? parseFloat(newVariant.price) : null
      }

      const response = await fetch(`/api/admin/products/${params.id}/variants`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(variantData),
      })

      if (response.ok) {
        const newVariantData = await response.json()
        setProduct(prev => prev ? {
          ...prev,
          variants: [...prev.variants, newVariantData]
        } : null)
        setNewVariant({
          size: '',
          color: '',
          material: '',
          price: '',
          stock: 0,
          sku: ''
        })
        showSuccess('Variant added successfully!')
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to add variant')
      }
    } catch (error) {
      console.error('Error adding variant:', error)
      showError('Error adding variant. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const deleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant? This action cannot be undone.')) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}/variants/${variantId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setProduct(prev => prev ? {
          ...prev,
          variants: prev.variants.filter(variant => variant.id !== variantId)
        } : null)
        showSuccess('Variant deleted successfully!')
      } else {
        const errorData = await response.json()
        showError(errorData.error || 'Failed to delete variant')
      }
    } catch (error) {
      console.error('Error deleting variant:', error)
      showError('Error deleting variant. Please try again.')
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

  // Get primary image or first image
  const primaryImage = productImages.find(img => img.isPrimary) || productImages[0]

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

      {/* Product Edit Form */}
      <div className="product-info-section">
        <h2 className="section-title">Product Information</h2>
        
        {editMode ? (
          <div className="edit-form-grid">
            <div className="edit-form-group">
              <label className="edit-form-label">Product Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="edit-form-input"
                placeholder="Enter product name"
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="edit-form-textarea"
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={editForm.price}
                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                className="edit-form-input"
                placeholder="0.00"
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={editForm.stock}
                onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                className="edit-form-input"
                placeholder="0"
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Legacy Image URL</label>
              <input
                type="url"
                value={editForm.imageUrl}
                onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                className="edit-form-input"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-600 mt-1">Note: Use the image upload section below for better image management</p>
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Category</label>
              <select
                value={editForm.categoryId}
                onChange={(e) => setEditForm({...editForm, categoryId: e.target.value})}
                className="edit-form-select"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-form-actions">
              <button 
                onClick={updateProduct}
                className="save-button"
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={cancelEdit}
                className="cancel-button"
                disabled={updating}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="product-info-grid">
            <div className="product-image-container">
              {primaryImage ? (
                <img 
                  src={primaryImage.imageData} 
                  alt={primaryImage.altText || product.name} 
                  className="product-image" 
                />
              ) : product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="product-image" 
                />
              ) : (
                <div className="product-image-placeholder">No Image</div>
              )}
            </div>
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
              <div className="product-detail-item">
                <span className="product-detail-label">Slug:</span>
                <span className="product-detail-value">{product.slug || 'N/A'}</span>
              </div>
              <button 
                onClick={() => setEditMode(true)}
                className="edit-button"
              >
                Edit Product
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Images Section */}
      <div className="images-section">
        <h2 className="section-title">Product Images</h2>
        
        {/* Image Upload */}
        <div className="image-upload-section">
          <h3 className="subsection-title">Upload New Images</h3>
          <div className="image-upload-form">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="file-input-label">
              Choose Images (Max 5MB each)
            </label>
            
            {selectedFiles.length > 0 && (
              <div className="selected-files-info">
                <p>{selectedFiles.length} file(s) selected</p>
                <button
                  onClick={uploadImages}
                  disabled={uploading}
                  className="upload-button"
                >
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </button>
              </div>
            )}
          </div>

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="image-previews">
              <h4>Preview:</h4>
              <div className="preview-grid">
                {previewUrls.map((url, index) => (
                  <div key={index} className="preview-item">
                    <img src={url} alt={`Preview ${index + 1}`} className="preview-image" />
                    <p className="preview-filename">{selectedFiles[index]?.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Images */}
        <div className="current-images-section">
          <h3 className="subsection-title">Current Images ({productImages.length})</h3>
          {productImages.length > 0 ? (
            <div className="images-grid">
              {productImages.map((image) => (
                <div key={image.id} className="image-item">
                  <div className="image-container">
                    <img
                      src={image.imageData}
                      alt={image.altText || image.fileName}
                      className="product-image-thumb"
                    />
                    {image.isPrimary && (
                      <div className="primary-badge">Primary</div>
                    )}
                  </div>
                  <div className="image-info">
                    <p className="image-filename">{image.fileName}</p>
                    <p className="image-size">{(image.fileSize / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="image-actions">
                    {!image.isPrimary && (
                      <button
                        onClick={() => setPrimaryImage(image.id)}
                        className="small-button primary-button"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="small-button delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-images-message">
              No images uploaded yet. Upload some images to get started!
            </div>
          )}
        </div>
      </div>

      {/* Product Variants Section */}
      <div className="variants-section">
        <h2 className="section-title">Product Variants</h2>
        
        <div className="add-variant-form">
          <h3 className="add-variant-title">Add New Variant</h3>
          <div className="variant-form-grid">
            <div className="variant-form-group">
              <label className="variant-form-label">SKU (Optional)</label>
              <input
                type="text"
                placeholder="e.g., SHIRT-RED-XL"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                className="variant-form-input"
              />
            </div>

            <div className="variant-form-group">
              <label className="variant-form-label">Size (Optional)</label>
              <input
                type="text"
                placeholder="e.g., S, M, L, XL"
                value={newVariant.size}
                onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                className="variant-form-input"
              />
            </div>

            <div className="variant-form-group">
              <label className="variant-form-label">Color (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Red, Blue, Black"
                value={newVariant.color}
                onChange={(e) => setNewVariant({...newVariant, color: e.target.value})}
                className="variant-form-input"
              />
            </div>

            <div className="variant-form-group">
              <label className="variant-form-label">Material (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Cotton, Polyester"
                value={newVariant.material}
                onChange={(e) => setNewVariant({...newVariant, material: e.target.value})}
                className="variant-form-input"
              />
            </div>

            <div className="variant-form-group">
              <label className="variant-form-label">Price (Optional)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Leave blank to use product price"
                value={newVariant.price}
                onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                className="variant-form-input"
              />
            </div>

            <div className="variant-form-group">
              <label className="variant-form-label">Stock</label>
              <input
                type="number"
                min="0"
                value={newVariant.stock}
                onChange={(e) => setNewVariant({...newVariant, stock: parseInt(e.target.value) || 0})}
                className="variant-form-input"
              />
            </div>
          </div>

          <button 
            onClick={addVariant} 
            className="add-button"
            disabled={updating}
          >
            {updating ? 'Adding...' : 'Add Variant'}
          </button>
        </div>

        <div className="variant-list">
          {product.variants.map(variant => (
            <div key={variant.id} className="variant-item">
              <div className="variant-header">
                <div className="variant-info">
                  {variant.sku && <span className="variant-sku">SKU: {variant.sku}</span>}
                  {variant.size && <span className="variant-size">Size: {variant.size}</span>}
                  {variant.color && <span className="variant-color">Color: {variant.color}</span>}
                  {variant.material && <span className="variant-material">Material: {variant.material}</span>}
                  {variant.price && <span className="variant-price">Price: ${variant.price}</span>}
                </div>
                <span className={`variant-stock ${variant.stock > 0 ? 'in-stock' : ''}`}>
                  Stock: {variant.stock}
                </span>
              </div>
              <div className="variant-actions">
                <div className="variant-stock-form">
                  <label className="stock-label">Stock:</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariantStock(variant.id, parseInt(e.target.value) || 0)}
                    className="variant-stock-input"
                  />
                </div>
                <button
                  onClick={() => deleteVariant(variant.id)}
                  className="small-button delete-button"
                  disabled={updating}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {product.variants.length === 0 && (
            <div className="text-gray-500 text-center py-4">No variants added yet</div>
          )}
        </div>
      </div>

      {/* Bottom Save Button - Only show when in edit mode */}
      {editMode && (
        <div className="bottom-save-section">
          <div className="bottom-save-actions">
            <button 
              onClick={updateProduct}
              className="save-button primary"
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save All Changes'}
            </button>
            <button 
              onClick={cancelEdit}
              className="cancel-button"
              disabled={updating}
            >
              Cancel Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
