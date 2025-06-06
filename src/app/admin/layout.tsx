"use client"

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user?.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [isLoggedIn, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Admin Dashboard</h2>
          <ul className="space-y-2">
            <li>
              <a href="/admin" className="block p-3 text-white hover:bg-gray-700 rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/products" className="block p-3 text-white hover:bg-gray-700 rounded">
                Products
              </a>
            </li>
            <li>
              <a href="/admin/orders" className="block p-3 text-white hover:bg-gray-700 rounded">
                Orders
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <main className="admin-main">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
