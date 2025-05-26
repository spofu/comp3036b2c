// Authentication utility functions

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message?: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

/**
 * Validates login form data
 * @param formData - The form data to validate
 * @returns Object with isValid boolean and error message if validation fails
 */
export const validateLoginForm = (formData: LoginFormData): { isValid: boolean; error?: string } => {
  if (!formData.email || !formData.password) {
    return {
      isValid: false,
      error: 'Please fill in all fields'
    };
  }

  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  if (formData.password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long'
    };
  }

  return { isValid: true };
};

/**
 * Handles user login by making API call
 * @param formData - Login credentials
 * @returns Promise resolving to login response
 */
export const loginUser = async (formData: LoginFormData): Promise<LoginResponse> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login failed. Please try again.'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.'
    };
  }
};

/**
 * Stores authentication token in localStorage
 * @param token - JWT token to store
 */
export const storeAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

/**
 * Retrieves authentication token from localStorage
 * @returns The stored token or null if not found
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Removes authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

/**
 * Checks if user is authenticated by verifying token existence
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Handles the complete login process
 * @param formData - Login credentials
 * @returns Promise resolving to login response with token storage
 */
export const handleLogin = async (formData: LoginFormData): Promise<LoginResponse> => {
  // Validate form data
  const validation = validateLoginForm(formData);
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.error
    };
  }

  // Attempt login
  const loginResponse = await loginUser(formData);
  
  // Store token if login successful
  if (loginResponse.success && loginResponse.token) {
    storeAuthToken(loginResponse.token);
  }

  return loginResponse;
};

/**
 * Handles user logout
 */
export const handleLogout = (): void => {
  removeAuthToken();
  // Additional cleanup can be added here (clear user data, etc.)
};

/**
 * Handles forgot password functionality
 * @param email - User's email address
 * @returns Promise resolving to response
 */
export const handleForgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // TODO: Implement actual forgot password API call
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || (response.ok ? 'Password reset email sent' : 'Failed to send reset email')
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
};

/**
 * Handles social login (Google, Facebook, etc.)
 * @param provider - Social login provider
 * @returns Promise resolving to login response
 */
export const handleSocialLogin = async (provider: 'google' | 'facebook'): Promise<LoginResponse> => {
  try {
    // TODO: Implement actual social login
    // This would typically involve OAuth flow
    console.log(`Initiating ${provider} login...`);
    
    return {
      success: false,
      message: `${provider} login coming soon!`
    };
  } catch (error) {
    console.error(`${provider} login error:`, error);
    return {
      success: false,
      message: `${provider} login failed. Please try again.`
    };
  }
};
