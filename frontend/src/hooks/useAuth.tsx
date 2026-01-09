"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { User, UserRole, RegisterData } from "@/types";
import {
  getUser,
  getToken,
  setUser as saveUser,
  setToken as saveToken,
  clearAuthData,
} from "@/utils/storage.utils";
import { authService } from "@/services";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updateData: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted to avoid hydration issues
    setIsMounted(true);

    // Check if user is logged in on mount
    const initAuth = () => {
      try {
        const token = getToken();
        const storedUser = getUser();

        if (token && storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.warn("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      saveToken(response.accessToken);
      saveUser(response.user);
      setUser(response.user);
      return response.user;
    } catch (error) {
      clearAuthData();
      setUser(null);
      throw error;
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const response = await authService.register(registerData);
      // Store token and user in localStorage
      saveToken(response.accessToken);
      saveUser(response.user);
      // Update state
      setUser(response.user);
    } catch (error) {
      // Clear any partial data on error
      clearAuthData();
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    // Clear auth data from localStorage
    clearAuthData();
    // Clear state
    setUser(null);
    // Redirect to login
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }, 0);
  };

  const updateProfile = async (updateData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(updateData);
      // Update user in localStorage
      saveUser(updatedUser);
      // Update state
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      const updatedUser = await authService.getProfile();
      // Update user in localStorage
      saveUser(updatedUser);
      // Update state
      setUser(updatedUser);
    } catch (error) {
      // If profile fetch fails, clear auth (likely invalid token)
      clearAuthData();
      setUser(null);
      throw error;
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  console.log({ user, isAuthenticated: !!user, isLoading });

  // Prevent hydration mismatch by rendering a consistent state during SSR
  if (!isMounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          isLoading: true,
          login,
          register,
          logout,
          updateProfile,
          refreshProfile,
          hasRole: () => false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
