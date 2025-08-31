import React, { createContext, useEffect, useState } from 'react';
import { setAuthToken, authAPI, getAuthToken } from './api';

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const storedToken = getAuthToken();
    return storedToken;
  });
  const [isAuth, setIsAuth] = useState(() => {
    const hasToken = !!getAuthToken();
    return hasToken;
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('frontend_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      setIsAuth(true);
      // Fetch user profile
      fetchUserProfile();
    } else {
      setAuthToken(null);
      setIsAuth(false);
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      // Update localStorage with the fetched user data
      localStorage.setItem('frontend_user', JSON.stringify(response));
    } catch (error) {
      console.error('AuthContext: Error fetching user profile:', error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      console.log(response)
      if (!response) {
        console.error('AuthContext: Invalid response structure', response);
        return {
          success: false,
          error: 'Invalid response from server'
        };
      }

      const { token: newToken, user: userData } = response;

      if (!newToken || !userData) {
        console.error('AuthContext: Missing token or user data', { newToken, userData });
        return {
          success: false,
          error: 'Missing authentication data'
        };
      }

      setAuthToken(newToken);
      localStorage.setItem('frontend_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      setIsAuth(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      console.error('AuthContext: Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });

      // Extract specific error message from server response
      let errorMessage = 'فشل في تسجيل الدخول';

      if (error.response?.data?.error) {
        // Server returned specific error message
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        // Server returned message field
        errorMessage = error.response.data.message;
      } else if (error.message && error.message !== 'Network Error') {
        // API function returned specific error
        errorMessage = error.message;
      } else if (error.response?.status === 401) {
        // Unauthorized - invalid credentials
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      } else if (error.response?.status === 404) {
        // User not found
        errorMessage = 'البريد الإلكتروني غير مسجل في النظام';
      } else if (error.response?.status === 400) {
        // Bad request - validation error
        errorMessage = 'بيانات غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور';
      } else if (error.response?.status >= 500) {
        // Server error
        errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً';
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        // Network error
        errorMessage = 'خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      console.log(response)
      // Don't automatically log in the user after registration
      // Just return success to show the toaster and redirect to login
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'استخدم ايمل او رقم هاتف فريد'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
      localStorage.removeItem('frontend_user');

      // Clean up all session-related data on logout
      localStorage.removeItem('reservationData');
      localStorage.removeItem('selectedPackage');
      localStorage.removeItem('finalOrderData');
      localStorage.removeItem('qrCodeData');
      localStorage.removeItem('selectedBranch');
      localStorage.removeItem('tipData');
      localStorage.removeItem('branchRating');
      localStorage.removeItem('branchRatings');
      localStorage.removeItem('motivationData');
      localStorage.removeItem('vipCheckoutData');
      localStorage.removeItem('vipPackageDetails');
      localStorage.removeItem('vipOrderDetails');
      localStorage.removeItem('selectedHotel');
      localStorage.removeItem('scannedQRData');

      // Clean up old authentication data
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rememberMe');

      setToken(null);
      setUser(null);
      setIsAuth(false);

    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('frontend_user', JSON.stringify(updatedUserData));
    console.log('AuthContext: User data updated in context and localStorage');
  };

  return (
    <AuthContext.Provider value={{
      isAuth,
      token,
      user,
      loading,
      login,
      logout,
      signup,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
} 