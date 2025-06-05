"use client"

import React from 'react'
import Link from 'next/link'
import './CSS/OrderSummary.css'

export const OrderSummary = () => {
  // Mock order data - in real app this would come from props or context
  const orderData = {
    orderNumber: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    items: [
      {
        id: '1',
        name: 'Premium Cotton T-Shirt',
        size: 'M',
        color: 'Blue',
        quantity: 2,
        price: 29.99,
        image: '/images/products/product-1.jpg'
      },
      {
        id: '2',
        name: 'Classic Denim Jeans',
        size: '32',
        color: 'Dark Blue',
        quantity: 1,
        price: 79.99,
        image: '/images/products/product-2.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    paymentMethod: {
      type: 'Credit Card',
      last4: '1234'
    },
    subtotal: 139.97,
    tax: 13.99,
    shipping: 0,
    total: 153.96
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
          {orderData.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
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
          ))}
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
              <p>{orderData.shippingAddress.name}</p>
              <p>{orderData.shippingAddress.address}</p>
              <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</p>
            </div>
          </div>
          <div className="payment-info">
            <h4>Payment Method</h4>
            <div className="payment-method">
              <p>{orderData.paymentMethod.type} ending in {orderData.paymentMethod.last4}</p>
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
