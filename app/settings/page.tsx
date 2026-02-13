"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bell, Lock, User, Eye, EyeOff, Save } from "lucide-react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    email: "saad@school.edu",
    fullName: "Saad Ahmed",
    grade: "10",
    notifications: {
      assignments: true,
      attendance: true,
      grades: true,
      announcements: true,
    },
    emailDigest: "weekly",
    theme: "light",
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleNotificationChange = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications],
      },
    }));
    setHasChanges(true);
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar studentName="Saad" notificationCount={0} notifications={[]} />

      <div className="flex">
        <Sidebar activeTab="settings" />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>

            <div className="max-w-2xl space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-indigo-600" />
                      <CardTitle>Profile Information</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={settings.fullName}
                        onChange={(e) => handleSettingChange("fullName", e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleSettingChange("email", e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Grade</label>
                      <select
                        value={settings.grade}
                        onChange={(e) => handleSettingChange("grade", e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                          <option key={grade} value={grade.toString()}>
                            Grade {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-indigo-600" />
                      <div>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Choose what notifications you receive</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, enabled]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => handleNotificationChange(key)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                      </label>
                    ))}
                    <div className="pt-2">
                      <label className="text-sm font-medium text-gray-700">Email Digest</label>
                      <select
                        value={settings.emailDigest}
                        onChange={(e) => handleSettingChange("emailDigest", e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-indigo-600" />
                      <CardTitle>Security</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <div className="mt-1 relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="flex gap-2">
                <Button disabled={!hasChanges} onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSettings({
                      email: "saad@school.edu",
                      fullName: "Saad Ahmed",
                      grade: "10",
                      notifications: {
                        assignments: true,
                        attendance: true,
                        grades: true,
                        announcements: true,
                      },
                      emailDigest: "weekly",
                      theme: "light",
                    });
                    setHasChanges(false);
                  }}
                >
                  Reset
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
