"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ShoppingCart from '../Assests/shopping-cart.svg'
import { Search } from '../Search/Search'
import { useAuth, useLogout } from '../../auth/Login/Login'
import './Navbar.css'

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [menu, setMenu] = useState("shop"); 
    
    // Authentication hooks
    const { authenticated, refreshAuthStatus } = useAuth();
    const { logout } = useLogout();
    
    // Update menu state based on current pathname when component mounts
    useEffect(() => {
      if (pathname === '/shop') setMenu('shop');
      else if (pathname === '/mens') setMenu('mens');
      else if (pathname === '/womens') setMenu('womens');
      else if (pathname === '/kids') setMenu('kids');
      
      // Refresh auth status when component mounts
      refreshAuthStatus();
    }, [pathname, refreshAuthStatus]);

    const handleLogin = () => {
      router.push('/pages/LoginSignUp');
    };

    const handleLogout = () => {
      logout();
      refreshAuthStatus();
    };
    
  return (
    <nav className='navbar'>
      <div className="navbar-container">
        <div className="navbar-logo">
          <p className="logo-text">CLOOOOTHES</p>
        </div>
        <ul className="navbar-links">
          <li className={`navbar-link ${menu==="shop" ? "active" : ""}`}>
            <Link href="/shop" className="nav-link">Shop</Link>
            {menu==="shop" && <span className="active-indicator"></span>}
          </li>
          <li className={`navbar-link ${menu==="mens" ? "active" : ""}`}>
            <Link href="/mens" className="nav-link">Mens</Link>
            {menu==="mens" && <span className="active-indicator"></span>}
          </li>
          <li className={`navbar-link ${menu==="womens" ? "active" : ""}`}>
            <Link href="/womens" className="nav-link">Womens</Link>
            {menu==="womens" && <span className="active-indicator"></span>}
          </li>
          <li className={`navbar-link ${menu==="kids" ? "active" : ""}`}>
            <Link href="/kids" className="nav-link">Kids</Link>
            {menu==="kids" && <span className="active-indicator"></span>}
          </li>
        </ul>

        <div className="search-section">
          <Search placeholder="Search products..." />
        </div>       
        
        <div className="cart-icon">
          <div className="cart-wrapper">
            <Image 
              src={ShoppingCart} 
              alt="Shopping Cart" 
              width={30} 
              height={30}
              className="cart-image" 
            />
            {/* Add cart counter here. */}
          </div>
        </div>

        <div className="auth-buttons">
          {authenticated ? (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="login-button" onClick={handleLogin}>
                Login
              </button>
              <Link href="/pages/LoginSignUp" className="signup-button">
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
