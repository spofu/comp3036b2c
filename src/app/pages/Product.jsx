import React from 'react'
import { Item } from '.components/Item/Item'
import { Footer } from './components/Footer/Footer';


export const Product = () => {
  // Sample product data

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <Item
        name={product.name}
        imageUrl={product.imageUrl}
        new_price={product.new_price}
        old_price={product.old_price}
      />
      <button className="add-to-cart">Add to Cart</button>
    </div>
  )
}
