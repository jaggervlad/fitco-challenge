"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log({ isAuthenticated, isLoading, user, allowedRoles });
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (allowedRoles && !hasRole(allowedRoles)) {
        router.push("/unauthorized");
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    allowedRoles,
    router,
    redirectTo,
    hasRole,
  ]);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Verificando acceso..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return null;
  }

  return <>{children}</>;
};
