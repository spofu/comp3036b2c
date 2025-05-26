import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import './ShopNow.css'

export const ShopNow = () => {
  return (
    <div className="new-arrivals-section">
      <div className="new-arrivals-container">
        {/* Left - Text section */}
        <div className="text-section">
          <h2 className="main-heading">New Arrivals</h2>
          
          <div className="description">
            <p className="description-text">
              Discover our latest collection of trendsetting fashion. Stay ahead of the curve with our carefully curated selection of new styles.
            </p>
            <p className="description-text">
              From casual everyday wear to statement pieces, our new arrivals have something for everyone.
            </p>
          </div>

          <Link href="/shop" className="shop-button">
            Shop New Arrivals
          </Link>
        </div>

        {/* Right - Image section */}
        <div className="image-section">
          <div className="image-container">
          </div>
          <div className="new-badge">
            NEW
          </div>
        </div>
      </div>
    </div>
  )
}
