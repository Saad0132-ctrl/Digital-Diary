"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartsProps {
  performanceData: any[];
  subjectScores: any[];
  attendanceData: any[];
}

export function PerformanceCharts({
  performanceData,
  subjectScores,
  attendanceData,
}: PerformanceChartsProps) {
  const [activeChart, setActiveChart] = useState<"line" | "bar" | "area">("line");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Analytics</CardTitle>
            <div className="flex gap-2">
              {["line", "bar", "area"].map((chart) => (
                <button
                  key={chart}
                  onClick={() => setActiveChart(chart as any)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeChart === chart
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {chart.charAt(0).toUpperCase() + chart.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {activeChart === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "12px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="math" stroke="#4F46E5" strokeWidth={2} />
                  <Line type="monotone" dataKey="science" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="english" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
            {activeChart === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subject" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "12px" }} />
                  <Bar dataKey="score" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeChart === "area" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "12px" }} />
                  <Area type="monotone" dataKey="percentage" stroke="#4F46E5" fillOpacity={1} fill="url(#colorAttendance)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
