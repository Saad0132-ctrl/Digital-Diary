"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  BarChart3,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab?: string;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "homework", label: "Homework", icon: BookOpen, href: "/homework" },
  { id: "attendance", label: "Attendance", icon: Calendar, href: "/attendance" },
  { id: "grades", label: "Grades", icon: Award, href: "/grades" },
  { id: "reports", label: "Reports", icon: BarChart3, href: "/reports" },
  { id: "ai-assistant", label: "AI Study", icon: Brain, href: "/ai-assistant" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar({ activeTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const pathname = usePathname();
  
  // Determine active tab from pathname if not provided
  const getActiveTab = () => {
    if (activeTab) return activeTab;
    if (pathname === "/") return "dashboard";
    return pathname.slice(1) || "dashboard";
  };

  const currentActiveTab = getActiveTab();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "sticky top-16 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 z-50",
          "hidden lg:block",
          isCollapsed ? "w-20" : "w-64",
          // Mobile styles
          isMobileOpen && "fixed left-0 top-16 block w-64 shadow-xl"
        )}
      >
      <div className="flex h-full flex-col justify-between p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentActiveTab === item.id;

            return (
              <Link key={item.id} href={item.href} onClick={() => setIsMobileOpen(false)}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all cursor-pointer",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence mode="wait">
                    {(!isCollapsed || isMobileOpen) && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
    </motion.aside>
    </>
  );
}

// Export a hook to control mobile sidebar from Navbar
export function useSidebar() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  return { isMobileOpen, setIsMobileOpen };
}
