"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductDetail } from '../../components/ProductDetail/ProductDetail';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  return (
    <div className="product-page">
      <ProductDetail productId={id} />
    </div>
  );
}
