"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import './CSS/OrderSummary.css'

export const OrderSummary = () => {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    // Try to get order data from session storage first (from successful checkout)
    const storedOrderData = sessionStorage.getItem('orderData')
    if (storedOrderData) {
      try {
        const parsedData = JSON.parse(storedOrderData)
        // Ensure items array exists
        if (parsedData && !parsedData.items) {
          parsedData.items = []
        }
        setOrderData(parsedData)
        setLoading(false)
        // Clear the session storage after loading
        sessionStorage.removeItem('orderData')
        return
      } catch (error) {
        console.error('Error parsing stored order data:', error)
      }
    }

    // If no stored data, try to get the most recent order from API
    fetchLatestOrder()
  }, [isLoggedIn, router, user])

  const fetchLatestOrder = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/checkout/orders?userId=${user.id}`)
      const result = await response.json()

      if (response.ok && result.orders && result.orders.length > 0) {
        // Get the most recent order
        const latestOrder = result.orders[0]
        setOrderData({
          id: latestOrder.id,
          orderNumber: latestOrder.orderNumber,
          orderDate: new Date(latestOrder.createdAt).toLocaleDateString(),
          estimatedDelivery: new Date(latestOrder.estimatedDelivery).toLocaleDateString(),
          status: latestOrder.status,
          items: latestOrder.items || [],
          shippingAddress: {
            name: user.name,
            address: latestOrder.shippingAddress?.street || '',
            apartment: latestOrder.shippingAddress?.apartment || '',
            city: latestOrder.shippingAddress?.city || '',
            state: latestOrder.shippingAddress?.state || '',
            zipCode: latestOrder.shippingAddress?.zipCode || '',
            country: latestOrder.shippingAddress?.country || ''
          },
          paymentMethod: {
            type: 'Credit Card',
            last4: '****' // Don't show real card details
          },
          subtotal: parseFloat(latestOrder.total) - (parseFloat(latestOrder.total) * 0.1), // Subtract tax
          tax: parseFloat(latestOrder.total) * 0.1,
          shipping: 0,
          total: parseFloat(latestOrder.total)
        })
      } else {
        setError('No recent orders found')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return null
  }

  if (loading) {
    return (
      <div className="order-summary-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="order-summary-container">
        <div className="error-state">
          <h1>Order Not Found</h1>
          <p>{error || 'We couldn\'t find your order details.'}</p>
          <Link href="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="order-summary-container">
      <div className="order-success-header">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been received and is being processed.</p>
      </div>

      <div className="order-details-card">
        <div className="order-info">
          <div className="order-number">
            <h2>Order #{orderData.orderNumber}</h2>
            <p className="order-date">Placed on {orderData.orderDate}</p>
          </div>
          <div className="delivery-info">
            <div className="delivery-estimate">
              <span className="delivery-label">Estimated Delivery:</span>
              <span className="delivery-date">{orderData.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        <div className="order-items">
          <h3>Order Items</h3>
          {orderData.items && orderData.items.length > 0 ? (
            orderData.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img src={item.image || '/images/products/default.jpg'} alt={item.name} />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <div className="item-variants">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="item-quantity">Quantity: {item.quantity}</div>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="no-items">
              <p>No items found in this order.</p>
            </div>
          )}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Subtotal:</span>
            <span>${orderData.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Shipping:</span>
            <span>{orderData.shipping === 0 ? 'Free' : `$${orderData.shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-line">
            <span>Tax:</span>
            <span>${orderData.tax.toFixed(2)}</span>
          </div>
          <div className="summary-line summary-total">
            <span>Total:</span>
            <span>${orderData.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="shipping-payment-info">
          <div className="shipping-info">
            <h4>Shipping Address</h4>
            <div className="address">
              {orderData.shippingAddress ? (
                <>
                  <p>{orderData.shippingAddress.name}</p>
                  <p>{orderData.shippingAddress.address}</p>
                  {orderData.shippingAddress.apartment && (
                    <p>{orderData.shippingAddress.apartment}</p>
                  )}
                  <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</p>
                  {orderData.shippingAddress.country && (
                    <p>{orderData.shippingAddress.country}</p>
                  )}
                </>
              ) : (
                <p>No shipping address available</p>
              )}
            </div>
          </div>
          <div className="payment-info">
            <h4>Payment Method</h4>
            <div className="payment-method">
              {orderData.paymentMethod ? (
                <p>{orderData.paymentMethod.type} ending in {orderData.paymentMethod.last4}</p>
              ) : (
                <p>Payment method not available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="order-actions">
        <Link href="/" className="btn-primary">
          Continue Shopping
        </Link>
        <button className="btn-secondary" onClick={() => window.print()}>
          Print Receipt
        </button>
      </div>

      <div className="next-steps">
        <h3>What's Next?</h3>
        <div className="steps-grid">
          <div className="step">
            <div className="step-icon">📦</div>
            <h4>Processing</h4>
            <p>We're preparing your order for shipment</p>
          </div>
          <div className="step">
            <div className="step-icon">🚚</div>
            <h4>Shipping</h4>
            <p>You'll receive tracking information via email</p>
          </div>
          <div className="step">
            <div className="step-icon">🏠</div>
            <h4>Delivery</h4>
            <p>Your order will arrive by {orderData.estimatedDelivery}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
