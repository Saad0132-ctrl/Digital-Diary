"use client";

import { motion } from "framer-motion";
import { getGreeting } from "@/lib/utils";

interface StudentHeaderProps {
  studentName: string;
  todayTasks: number;
  upcomingExams: number;
}

export function StudentHeader({ studentName, todayTasks, upcomingExams }: StudentHeaderProps) {
  const quotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "Education is the most powerful weapon.",
    "The expert in anything was once a beginner.",
    "Learning never exhausts the mind.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-8 text-white shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {studentName}
          </h1>
          <p className="text-indigo-100 mb-4">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm italic text-indigo-100 max-w-2xl">
            &quot;{randomQuote}&quot;
          </p>
        </div>

        <div className="flex gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-2 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur px-4 py-3"
          >
            <div>
              <p className="text-2xl font-bold">{todayTasks}</p>
              <p className="text-xs text-indigo-100">Today&apos;s Tasks</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex items-center gap-2 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur px-4 py-3"
          >
            <div>
              <p className="text-2xl font-bold">{upcomingExams}</p>
              <p className="text-xs text-indigo-100">Upcoming Exams</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
