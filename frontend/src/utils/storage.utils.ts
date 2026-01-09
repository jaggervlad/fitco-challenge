const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Helper to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn(`Error accessing localStorage for key "${key}":`, error);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Error setting localStorage for key "${key}":`, error);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage for key "${key}":`, error);
    }
  },
};

/**
 * Store token in localStorage
 */
export const setToken = (token: string): void => {
  safeLocalStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  return safeLocalStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  safeLocalStorage.removeItem(TOKEN_KEY);
};

/**
 * Store user data in localStorage
 */
export const setUser = (user: any): void => {
  try {
    safeLocalStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn("Error storing user data:", error);
  }
};

/**
 * Get user data from localStorage
 */
export const getUser = (): any | null => {
  try {
    const user = safeLocalStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.warn("Error parsing user data:", error);
    return null;
  }
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): void => {
  safeLocalStorage.removeItem(USER_KEY);
};

/**
 * Clear all auth data
 */
export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};
