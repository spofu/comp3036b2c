import React from 'react';
import { ProductsDisplay } from '../components/ProductsDisplay/ProductsDisplay';
import {Navbar} from '../components/NavBar/Navbar';

export const Shop = () => {
  return (
    <div className="shop-page">
        <Navbar/>     
        <ProductsDisplay />
    </div>
  );
};
