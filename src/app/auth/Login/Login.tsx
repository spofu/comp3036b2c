// Authentication logic for login functionality
// This file contains only the business logic and utilities for login
// UI components should import and use these functions

import { 
  validateLoginForm, 
  loginUser, 
  storeAuthToken, 
  getAuthToken, 
  removeAuthToken, 
  isAuthenticated,
  handleLogin,
  handleLogout,
  handleForgotPassword,
  handleSocialLogin,
  type LoginFormData,
  type LoginResponse
} from '../utils/authUtils';

import { 
  useLogin, 
  useLogout, 
  useForgotPassword, 
  useSocialLogin, 
  useAuth 
} from '../hooks/useAuth';

// Re-export all authentication functionality for easy importing
export {
  // Core authentication functions
  validateLoginForm,
  loginUser,
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
  handleLogin,
  handleLogout,
  handleForgotPassword,
  handleSocialLogin,
  
  // Custom hooks for React components
  useLogin,
  useLogout,
  useForgotPassword,
  useSocialLogin,
  useAuth,
  
  // TypeScript types
  type LoginFormData,
  type LoginResponse
};

// Example usage for UI components:
/*
import { useLogin, LoginFormData } from './Login';

const LoginComponent = () => {
  const { login, isLoading, error, clearError } = useLogin();
  
  const handleSubmit = async (formData: LoginFormData) => {
    const result = await login(formData);
    if (result.success) {
      console.log('Login successful');
    }
  };
  
  // ... rest of component
};
*/
