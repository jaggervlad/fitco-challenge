"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks";
import { Navbar, Footer } from "@/components/layout";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Configure NProgress
    NProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    // Start progress bar on route change
    NProgress.start();

    // Finish progress bar when route change completes
    const handleRouteChange = () => {
      NProgress.done();
    };

    // Simulate route change completion
    const timeout = setTimeout(handleRouteChange, 100);

    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [pathname]);

  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">{children}</main>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4caf50",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#f44336",
              secondary: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  );
}
