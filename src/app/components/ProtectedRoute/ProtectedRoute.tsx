"use client"

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login',
  requireAuth = true 
}) => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isLoggedIn) {
      // Store the intended destination to redirect back after login
      const currentPath = window.location.pathname;
      localStorage.setItem('redirectAfterLogin', currentPath);
      router.push(redirectTo);
    }
  }, [isLoggedIn, isLoading, requireAuth, redirectTo, router]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not logged in, show nothing (redirect is handled in useEffect)
  if (requireAuth && !isLoggedIn) {
    return null;
  }

  // Render children if auth check passes
  return <>{children}</>;
};

export default ProtectedRoute;
