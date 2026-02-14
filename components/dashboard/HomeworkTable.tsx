"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HomeworkTask } from "@/types";
import { formatDate, getDaysUntil } from "@/lib/utils";

interface HomeworkTableProps {
  tasks: HomeworkTask[];
  onToggleTask: (id: string) => void;
}

export function HomeworkTable({ tasks, onToggleTask }: HomeworkTableProps) {
  // Show only pending/upcoming tasks on dashboard (last 7 days or future)
  const filteredTasks = tasks
    .filter((task) => {
      if (task.status === "completed") return false;
      const daysUntil = getDaysUntil(task.dueDate);
      return daysUntil >= -7; // Show tasks due in the last 7 days or upcoming
    })
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5); // Show only top 5 upcoming tasks

  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Tasks</CardTitle>
            <a
              href="/homework"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </CardHeader>
        <CardContent>

          <div className="space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => {
                const daysUntil = getDaysUntil(task.dueDate);
                const isOverdue = daysUntil < 0 && task.status === "pending";

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-md transition-all",
                      task.status === "completed" && "opacity-60",
                      isOverdue && "border-red-300 bg-red-50"
                    )}
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 transition"
                    >
                      <CheckCircle2
                        className={cn(
                          "h-6 w-6",
                          task.status === "completed" && "fill-indigo-600 text-indigo-600"
                        )}
                      />
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4
                          className={cn(
                            "font-semibold text-gray-800 dark:text-gray-100",
                            task.status === "completed" && "line-through text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {task.title}
                        </h4>
                        <span
                          className={cn(
                            "rounded-lg border px-2 py-1 text-xs font-medium",
                            priorityColors[task.priority]
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{task.subject}</span>
                        <span className="text-gray-400">•</span>
                        <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                          {isOverdue ? "Overdue" : formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">No upcoming tasks</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
