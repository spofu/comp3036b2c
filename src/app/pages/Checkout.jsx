"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './CSS/Checkout.css'

export const Checkout = () => {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const { items, getTotalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: user?.name || '',
    
    // Billing Address
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: ''
  })

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    if (items.length === 0) {
      router.push('/cart')
      return
    }
  }, [isLoggedIn, items, router])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      setError('Please fill in all required shipping fields')
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    // Payment validation
    if (!formData.nameOnCard || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      setError('Please fill in all payment fields')
      return false
    }

    // Card number validation (basic)
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '')
    if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      setError('Please enter a valid card number')
      return false
    }

    // Expiry date validation
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!expiryRegex.test(formData.expiryDate)) {
      setError('Please enter a valid expiry date (MM/YY)')
      return false
    }

    // CVV validation
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      setError('Please enter a valid CVV')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    if (!user || items.length === 0) {
      setError('Invalid checkout state')
      return
    }

    setIsProcessing(true)

    try {
      // First, check inventory availability
      const inventoryCheckData = {
        items: items.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }))
      }

      const inventoryResponse = await fetch('/api/checkout/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventoryCheckData)
      })

      const inventoryResult = await inventoryResponse.json()

      if (!inventoryResponse.ok) {
        throw new Error(inventoryResult.error || 'Failed to check inventory')
      }

      if (!inventoryResult.allItemsAvailable) {
        const unavailableItems = inventoryResult.unavailableItems
        const errorMessages = unavailableItems.map(item => 
          `${item.productName}: ${item.error}`
        ).join('\n')
        
        setError(`Some items are no longer available:\n${errorMessages}`)
        return
      }

      // Prepare order data
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color
        })),
        shippingAddress: {
          street: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentInfo: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryDate: formData.expiryDate,
          nameOnCard: formData.nameOnCard,
          // Don't send CVV to server for security
        },
        total: getTotalPrice()
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Checkout failed')
      }

      // Clear cart and redirect to order summary
      await clearCart()
      
      // Store order info for order summary page
      sessionStorage.setItem('orderData', JSON.stringify(result.order))
      router.push('/order-summary')

    } catch (error) {
      console.error('Checkout error:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred during checkout')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData(prev => ({ ...prev, cardNumber: formatted }))
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    setFormData(prev => ({ ...prev, expiryDate: formatted }))
  }

  // Calculate totals
  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1 // 10% tax
  const shipping = subtotal > 50 ? 0 : 9.99 // Free shipping over $50
  const total = subtotal + tax + shipping

  if (!isLoggedIn || items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className="step active">
            <span className="step-number">1</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className="step active">
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <span className="step-label">Review</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-sections-container">
            {/* Shipping Information */}
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="apartment">Apartment, suite, etc.</label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter State"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter Country"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="form-section">
              <h2>Payment Information</h2>
              <div className="payment-methods">
                <div className="payment-method active">
                  <input type="radio" id="credit-card" name="paymentMethod" defaultChecked />
                  <label htmlFor="credit-card">Credit Card</label>
                  <div className="card-icons">
                    <span>💳</span>
                  </div>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="nameOnCard">Name on Card *</label>
                  <input
                    type="text"
                    id="nameOnCard"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date *</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="4"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="billing-address">
                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                    />
                    Billing address is the same as shipping address
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => router.back()}
              disabled={isProcessing}
            >
              Back to Cart
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Complete Order ($${total.toFixed(2)})`}
            </button>
          </div>
        </form>

        {/* Order Summary Sidebar */}
        <div className="order-summary-sidebar">
          <h3>Order Summary</h3>
          
          <div className="order-items">
            {items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                </div>
                <div className="item-price">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="total-line">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-line total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-methods-summary">
            <p className="payment-title">We Accept</p>
            <div className="payment-icons">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">💰</span>
              <span className="payment-icon">🏦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
