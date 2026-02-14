"use client";

import React from "react";
import Link from "next/link";
import { Bell, User, Settings, LogOut, AlertCircle, MessageSquare, AlertTriangle, CheckCircle, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Notification } from "@/types";
import { getRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface NavbarProps {
  studentName?: string;
  notificationCount?: number;
  notifications?: Notification[];
}

export function Navbar({ studentName = "Student", notificationCount = 0, notifications = [] }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const notificationRef = React.useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-blue-100 text-blue-600";
      case "message":
        return "bg-indigo-100 text-indigo-600";
      case "warning":
        return "bg-amber-100 text-amber-600";
      case "success":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };



  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500">
            <span className="text-lg font-bold text-white">SD</span>
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden sm:inline">
            Student Diary
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </motion.button>

          <div className="relative" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-96 max-h-[600px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl z-50 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[500px]">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer",
                              !notification.read && "bg-indigo-50/50 dark:bg-indigo-900/20"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                getNotificationColor(notification.type)
                              )}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{notification.title}</h4>
                                {!notification.read && (
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1" />
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{notification.message}</p>
                              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{getRelativeTime(notification.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                        <Bell className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                      <Link
                        href="/"
                        onClick={() => setShowNotifications(false)}
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-center block transition-colors"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
                {studentName}
              </span>
            </motion.button>

            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-colors"
              >
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 rounded-t-xl px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    localStorage.removeItem("isAuthenticated");
                    localStorage.removeItem("studentEmail");
                    router.push("/login");
                  }}
                  className="flex w-full items-center gap-2 rounded-b-xl px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
