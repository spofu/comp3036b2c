"use client"

import React, { useState, useEffect } from 'react'
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
    const [menu, setMenu] = useState("shop"); 
    const { getTotalItems } = useCart();
    const { user, isLoggedIn, logout, isLoading } = useAuth();
    const cartItemCount = getTotalItems(); 
    
    // Update menu state based on current pathname when component mounts
    useEffect(() => {
      if (pathname === '/' || pathname === '/shop') setMenu('shop');
      else if (pathname === '/categories') setMenu('categories');
    }, [pathname]);

    const handleLogout = () => {
      logout();
    };
    
  return (
    <nav className='navbar'>
      <div className="navbar-container">
        <div className="navbar-logo">
          <p className="logo-text">CLOOOOTHES</p>
        </div>
        <ul className="navbar-links">
          <li className={`navbar-link ${menu==="shop" ? "active" : ""}`}>
            <Link href="/" className="nav-link">Shop</Link>
            {menu==="shop" && <span className="active-indicator"></span>}
          </li>
          <li className={`navbar-link ${menu==="categories" ? "active" : ""}`}>
            <Link href="/categories" className="nav-link">Categories</Link>
            {menu==="categories" && <span className="active-indicator"></span>}
          </li>
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
