"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { usePathname, useRouter } from 'next/navigation'
import { Search } from '../Search/Search'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

import ShoppingCart from '../Assests/shopping-cart.svg'

import './Navbar.css'

export const Navbar = () => {
    const pathname = usePathname();
    const { getTotalItems } = useCart();
    const { user, isLoggedIn, logout, isLoading } = useAuth();
    const cartItemCount = getTotalItems(); 

    const handleLogout = () => {
      logout();
    };
    
  return (
    <nav className='navbar'>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href="/" className="logo-link">
            <p className="logo-text">CLOOOOTHES</p>
          </Link>
        </div>
        <ul className="navbar-links">
          {/* Shop link removed - logo now handles navigation to home */}
        </ul>

        <div className="search-section">
          <Search placeholder="Search products..." />
        </div>       
        
        <div className="cart-icon">
          <Link href="/cart" className="cart-wrapper">
            <Image 
              src={ShoppingCart} 
              alt="Shopping Cart" 
              width={30} 
              height={30}
              className="cart-image" 
            />
            {cartItemCount > 0 && (
              <span className="cart-count">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        <div className="auth-buttons">
          {isLoading ? (
            <div className="auth-loading">Loading...</div>
          ) : isLoggedIn && user ? (
            <>
              <span className="user-greeting">Hello, {user.name}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="login-button">
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}
