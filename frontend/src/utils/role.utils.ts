import { UserRole } from "@/types";

/**
 * Check if user has a specific role
 */
export const hasRole = (
  userRole: UserRole | undefined,
  allowedRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === UserRole.ADMIN;
};

/**
 * Check if user is provider
 */
export const isProvider = (userRole: UserRole | undefined): boolean => {
  return userRole === UserRole.PROVIDER;
};

/**
 * Check if user is client
 */
export const isClient = (userRole: UserRole | undefined): boolean => {
  return userRole === UserRole.CLIENT;
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.ADMIN]: "Administrador",
    [UserRole.PROVIDER]: "Proveedor",
    [UserRole.CLIENT]: "Cliente",
  };
  return roleNames[role] || role;
};
