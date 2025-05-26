"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ShoppingCart from '../Assets/shopping-cart.svg'
import { useAuth, useLogout } from '../../auth/hooks/useAuth'
import { isAuthenticated, getAuthToken } from '../../auth/utils/authUtils'
import './Navbar.css'

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [menu, setMenu] = useState("shop"); 
    const { logout } = useLogout();
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    
    // Update menu state based on current pathname when component mounts
    useEffect(() => {
      if (pathname === '/shop') setMenu('shop');
      else if (pathname === '/mens') setMenu('mens');
      else if (pathname === '/womens') setMenu('womens');
      else if (pathname === '/kids') setMenu('kids');
    }, [pathname]);

    // Check authentication status
    useEffect(() => {
      const checkAuthStatus = async () => {
        const authStatus = isAuthenticated();
        setIsUserAuthenticated(authStatus);
        
        if (authStatus) {
          // Try to get user data from the verify endpoint
          try {
            const token = getAuthToken();
            const response = await fetch('/api/auth/verify', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setUserName(data.user.name || 'User');
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }
      };
      
      checkAuthStatus();
    }, []);

    const handleLogin = () => {
      router.push('/pages/LoginSignUp');
    };

    const handleLogout = () => {
      logout();
      setIsUserAuthenticated(false);
      setUserName('');
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
          {isUserAuthenticated ? (
            <div className="user-section">
              <span className="user-greeting">Hello, {userName}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-section">
              <button className="login-button" onClick={handleLogin}>
                Login
              </button>
              <button className="signup-button" onClick={handleLogin}>
                Sign Up
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}
