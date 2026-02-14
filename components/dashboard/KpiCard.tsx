"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import * as LucideIcons from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "neutral";
  trendValue: number;
  icon: string;
  sparklineData: number[];
  color: string;
  index: number;
}

export function KpiCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  sparklineData,
  color,
  index,
}: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Activity;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const chartData = sparklineData.map((val) => ({ value: val }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{displayValue}</span>
                <span className="text-lg text-gray-500 dark:text-gray-400">{unit}</span>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {trend === "up" && (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-500">+{trendValue}%</span>
                  </>
                )}
                {trend === "down" && (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-500">-{trendValue}%</span>
                  </>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
              </div>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}20` }}
            >
              <IconComponent className="h-6 w-6" style={{ color }} />
            </div>
          </div>
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
