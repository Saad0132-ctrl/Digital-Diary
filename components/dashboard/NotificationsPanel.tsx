"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/types";
import { getRelativeTime } from "@/lib/utils";

interface NotificationsPanelProps {
  notifications: Notification[];
}

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5" />;
      case "message":
        return <MessageSquare className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                className={cn(
                  "flex gap-3 rounded-xl border p-4 hover:shadow-md cursor-pointer",
                  notification.read ? "border-gray-200 bg-white opacity-70" : "border-indigo-200 bg-indigo-50"
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", getNotificationColor(notification.type))}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                    {!notification.read && <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-gray-500">{getRelativeTime(notification.timestamp)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
