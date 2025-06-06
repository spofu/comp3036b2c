// Custom hooks for authentication

"use client"

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LoginFormData, 
  LoginResponse, 
  handleLogin as authHandleLogin,
  handleLogout as authHandleLogout,
  handleForgotPassword as authHandleForgotPassword,
  handleSocialLogin as authHandleSocialLogin,
  isAuthenticated 
} from '../utils/authUtils';

/**
 * Custom hook for managing login state and functionality
 * Provides loading states, error handling, and form management
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  /**
   * Handles the login process
   * @param formData - Login credentials
   * @param redirectPath - Path to redirect to after successful login (default: '/shop')
   */
  const login = useCallback(async (formData: LoginFormData, redirectPath: string = '/shop') => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authHandleLogin(formData);
      
      if (response.success) {
        router.push(redirectPath);
        return response;
      } else {
        setError(response.message || 'Login failed. Please try again.');
        return response;
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Clears any existing error messages
   */
  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    login,
    isLoading,
    error,
    clearError
  };
};

/**
 * Custom hook for managing logout functionality
 */
export const useLogout = () => {
  const router = useRouter();

  /**
   * Handles the logout process
   * @param redirectPath - Path to redirect to after logout (default: '/auth/login')
   */
  const logout = useCallback((redirectPath: string = '/auth/login') => {
    authHandleLogout();
    router.push(redirectPath);
  }, [router]);

  return { logout };
};

/**
 * Custom hook for forgot password functionality
 */
export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Handles forgot password request
   * @param email - User's email address
   */
  const sendResetEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await authHandleForgotPassword(email);
      setMessage(response.message);
      setIsSuccess(response.success);
      return response;
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setMessage(errorMessage);
      setIsSuccess(false);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clears message and success state
   */
  const clearMessage = useCallback(() => {
    setMessage('');
    setIsSuccess(false);
  }, []);

  return {
    sendResetEmail,
    isLoading,
    message,
    isSuccess,
    clearMessage
  };
};

/**
 * Custom hook for social login functionality
 */
export const useSocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  /**
   * Handles social login process
   * @param provider - Social login provider
   * @param redirectPath - Path to redirect to after successful login (default: '/shop')
   */
  const socialLogin = useCallback(async (provider: 'google' | 'facebook', redirectPath: string = '/shop') => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authHandleSocialLogin(provider);
      
      if (response.success) {
        router.push(redirectPath);
        return response;
      } else {
        setError(response.message || `${provider} login failed. Please try again.`);
        return response;
      }
    } catch (err) {
      console.error(`${provider} login error:`, err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Clears any existing error messages
   */
  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    socialLogin,
    isLoading,
    error,
    clearError
  };
};

/**
 * Custom hook for checking authentication status
 */
export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);

  /**
   * Refreshes authentication status
   */
  const refreshAuthStatus = useCallback(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  return {
    authenticated,
    refreshAuthStatus
  };
};
