import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_AUTH'; payload: { user: User; token: string } };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'RESTORE_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('wellness_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          // Token is still valid
          const user = { id: decoded.id, email: decoded.email };
          dispatch({ type: 'RESTORE_AUTH', payload: { user, token } });
        } else {
          // Token expired
          localStorage.removeItem('wellness_token');
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('wellness_token');
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { token } = response.data;
        const decoded: any = jwtDecode(token);
        const user = { id: decoded.id, email: decoded.email };
        
        localStorage.setItem('wellness_token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        toast.success('Login successful!');
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.register(email, password);
      
      if (response.success) {
        toast.success('Registration successful! Please log in.');
        dispatch({ type: 'LOGIN_FAILURE' });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        toast.error(response.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('wellness_token');
    dispatch({ type: 'LOGOUT' });
    toast.info('Logged out successfully');
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


