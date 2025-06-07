"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './login.css';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  itemCount: number;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const LoginPageContent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentView, setCurrentView] = useState<'auth' | 'orders'>('auth');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const { login, register, logout, isLoading, isLoggedIn, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  // Check URL parameter to determine initial view
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders' && isLoggedIn) {
      setCurrentView('orders');
    }
  }, [searchParams, isLoggedIn]);

  // Fetch user's order history
  const fetchOrders = async () => {
    if (!user?.id) return;
    
    setLoadingOrders(true);
    setOrdersError('');
    
    try {
      const response = await fetch(`/api/checkout/orders?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setOrdersError(data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError('Failed to load order history');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load orders when user logs in or view changes to orders
  useEffect(() => {
    if (isLoggedIn && currentView === 'orders' && user?.id) {
      fetchOrders();
    }
  }, [isLoggedIn, currentView, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let result;
    if (isSignUp) {
      result = await register(email, password, name);
    } else {
      result = await login(email, password);
    }
    
    if (result.success) {
      // AuthContext handles the redirect, but if no redirect is stored, go to shop
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (!redirectPath) {
        router.push('/');
      }
    } else {
      setError(result.message || `${isSignUp ? 'Registration' : 'Login'} failed. Please try again.`);
    }
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Show order history when logged in */}
        {isLoggedIn && user ? (
          <div className="user-dashboard">
            <div className="dashboard-header">
              <h1 className="login-title">Welcome back, {user.name}!</h1>
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${currentView === 'auth' ? 'active' : ''}`}
                  onClick={() => setCurrentView('auth')}
                >
                  Account
                </button>
                <button
                  className={`toggle-btn ${currentView === 'orders' ? 'active' : ''}`}
                  onClick={() => setCurrentView('orders')}
                >
                  Order History
                </button>
              </div>
            </div>

            {currentView === 'auth' ? (
              <div className="account-info">
                <div className="user-details">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Account Type:</strong> {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}</p>
                </div>
                <div className="account-actions">
                  <Link href="/" className="btn-primary">
                    Continue Shopping
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="btn-secondary">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="btn-logout">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="orders-section">
                <h2>Your Order History</h2>
                
                {loadingOrders ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your orders...</p>
                  </div>
                ) : ordersError ? (
                  <div className="error-message">
                    <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {ordersError}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-orders">
                    <div className="empty-icon">🛍️</div>
                    <h3>No orders yet</h3>
                    <p>When you place your first order, it will appear here.</p>
                    <Link href="/" className="btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h3>Order {order.orderNumber}</h3>
                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="order-total">
                            ${Number(order.total).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="order-details">
                          <div className="order-meta">
                            <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Expected Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            <p><strong>Items:</strong> {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                          </div>
                          
                          <div className="order-address">
                            <p><strong>Shipping to:</strong></p>
                            <p>{order.shippingAddress.street}</p>
                            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>

                        <div className="order-items">
                          <h4>Items:</h4>
                          <div className="items-grid">
                            {order.items.map((item) => (
                              <div key={item.id} className="order-item">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="item-image"
                                />
                                <div className="item-details">
                                  <p className="item-name">{item.name}</p>
                                  <p className="item-price">${Number(item.price).toFixed(2)} × {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Show login/signup form when not logged in
          <>
            <div className="login-header">
              <h1 className="login-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
              <p className="login-subtitle">
                {isSignUp 
                  ? 'Sign up to start shopping with us' 
                  : 'Sign in to your account to continue shopping'
                }
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleInputChange(setName)}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing in...'}
                  </>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button onClick={toggleMode} className="signup-link">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
                {" | "}
                <Link href="/" className="signup-link">Return to Shop</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
};

export default LoginPage;
