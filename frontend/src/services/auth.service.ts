import api from "./api";
import { AuthResponse, LoginCredentials, RegisterData, User } from "@/types";

/**
 * Auth service - Only handles HTTP requests to the backend
 * Storage management is handled by useAuth hook
 */
export const authService = {
  /**
   * Login user - Returns auth response from backend
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  /**
   * Register new user - Returns auth response from backend
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      "/auth/register",
      registerData
    );
    return data;
  },

  /**
   * Get current user profile from backend
   */
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>("/auth/profile");
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(updateData: Partial<User>): Promise<User> {
    const { data } = await api.patch<User>("/auth/profile", updateData);
    return data;
  },
};
