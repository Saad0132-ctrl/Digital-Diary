"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      const isAuth = authStatus === "true";

      // If not on login page and not authenticated, redirect to login
      if (pathname !== "/login" && !isAuth) {
        router.push("/login");
        setIsAuthenticated(false);
      } else if (pathname === "/login" && isAuth) {
        // If on login page but already authenticated, redirect to dashboard
        router.push("/");
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(isAuth);
      }
    };

    checkAuth();

    // Listen for storage changes (for logout)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname, router]);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If on login page, show login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // If authenticated, show protected content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, show nothing (redirecting)
  return null;
}

