"use client"

import React, { useState, useEffect } from 'react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalProducts || 0}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalOrders || 0}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {stats?.recentOrders?.length ? (
          <div className="space-y-3">
            {stats.recentOrders.map((order, index) => (
              <div key={order.id || index} className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Order #{order.id?.slice(-8) || 'N/A'}</span>
                <span className="text-green-600 font-semibold">${order.total || '0.00'}</span>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded">{order.status || 'PENDING'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent orders</p>
        )}
      </div>
    </div>
  );
}
