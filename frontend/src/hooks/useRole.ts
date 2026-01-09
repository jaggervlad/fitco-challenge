"use client";

import { useAuth } from "./useAuth";
import { UserRole } from "@/types";

export const useRole = () => {
  const { user, hasRole } = useAuth();

  return {
    role: user?.role,
    isAdmin: hasRole([UserRole.ADMIN]),
    isProvider: hasRole([UserRole.PROVIDER]),
    isClient: hasRole([UserRole.CLIENT]),
    hasRole,
  };
};
