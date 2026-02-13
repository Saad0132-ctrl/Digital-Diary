"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Search, Filter, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { homeworkTasks, notifications } from "@/lib/mockData";
import { formatDate, getDaysUntil } from "@/lib/utils";

export default function HomeworkPage() {
  const [tasks, setTasks] = useState(homeworkTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task
      )
    );
  };

  // Get unique subjects and available months/years
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set(tasks.map((t) => t.subject).filter(Boolean));
    return Array.from(subjects).sort();
  }, [tasks]);

  const availableMonths = useMemo(() => {
    const months = new Set<number>();
    const years = new Set<number>();
    tasks.forEach((task) => {
      const date = new Date(task.dueDate);
      months.add(date.getMonth());
      years.add(date.getFullYear());
    });
    return { months: Array.from(months).sort(), years: Array.from(years).sort((a, b) => b - a) };
  }, [tasks]);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const taskDate = new Date(task.dueDate);
        const taskMonth = taskDate.getMonth();
        const taskYear = taskDate.getFullYear();

        // Date filter
        if (taskMonth !== selectedMonth || taskYear !== selectedYear) return false;

        // Status filter
        if (statusFilter !== "all" && task.status !== statusFilter) return false;

        // Subject filter
        if (subjectFilter !== "all" && task.subject !== subjectFilter) return false;

        // Priority filter
        if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const titleStr = task.title.toLowerCase();
          const subjectStr = (task.subject || "").toLowerCase();
          const descStr = (task.description || "").toLowerCase();
          const dateStr = formatDate(task.dueDate).toLowerCase();

          if (!titleStr.includes(query) && !subjectStr.includes(query) && !descStr.includes(query) && !dateStr.includes(query)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by due date (earliest first)
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
  }, [tasks, searchQuery, statusFilter, subjectFilter, priorityFilter, selectedMonth, selectedYear]);

  // Calculate stats for current month
  const monthStats = useMemo(() => {
    const monthTasks = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getMonth() === selectedMonth && taskDate.getFullYear() === selectedYear;
    });
    const completed = monthTasks.filter((t) => t.status === "completed").length;
    const pending = monthTasks.filter((t) => t.status === "pending").length;
    const overdue = monthTasks.filter((t) => getDaysUntil(t.dueDate) < 0 && t.status === "pending").length;
    const highPriority = monthTasks.filter((t) => t.priority === "high" && t.status === "pending").length;
    return { completed, pending, overdue, highPriority, total: monthTasks.length };
  }, [tasks, selectedMonth, selectedYear]);

  // Navigation functions
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  const hasActiveFilters = statusFilter !== "all" || subjectFilter !== "all" || priorityFilter !== "all" || searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSubjectFilter("all");
    setPriorityFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar studentName="Saad" notificationCount={notifications.filter((n) => !n.read).length} notifications={notifications} />

      <div className="flex">
        <Sidebar activeTab="homework" />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Homework & Tasks</h1>
              <p className="text-gray-600">
                {monthStats.completed} of {monthStats.total} tasks completed for {monthNames[selectedMonth]} {selectedYear}
              </p>
            </div>

            {/* Date Navigation */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium bg-white"
                      >
                        {monthNames.map((month, index) => (
                          <option key={month} value={index}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium bg-white"
                      >
                        {availableMonths.years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={goToNextMonth}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={goToCurrentMonth}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Current Month
                  </button>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">{monthStats.completed}</div>
                    <p className="text-gray-600 text-sm mt-2">Completed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-600">{monthStats.highPriority}</div>
                    <p className="text-gray-600 text-sm mt-2">High Priority</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600">{monthStats.overdue}</div>
                    <p className="text-gray-600 text-sm mt-2">Overdue</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">{monthStats.pending}</div>
                    <p className="text-gray-600 text-sm mt-2">Pending</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div>
                  <CardTitle>All Tasks</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {filteredTasks.length} of {monthStats.total} tasks for {monthNames[selectedMonth]} {selectedYear}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter Bar */}
                <div className="mb-6 space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title, subject, description, or date..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  {/* Filter Row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Filters:</span>
                    </div>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>

                    {/* Subject Filter */}
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                    >
                      <option value="all">All Subjects</option>
                      {uniqueSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>

                    {/* Priority Filter */}
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Table Container with Fixed Height */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto" style={{ maxHeight: "600px", overflowY: "auto" }}>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Title
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Subject
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Priority
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map((task) => {
                            const daysUntil = getDaysUntil(task.dueDate);
                            const isOverdue = daysUntil < 0 && task.status === "pending";

                            return (
                              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button
                                    onClick={() => handleToggleTask(task.id)}
                                    className="text-gray-400 hover:text-indigo-600 transition"
                                  >
                                    <CheckCircle2
                                      className={cn(
                                        "h-5 w-5",
                                        task.status === "completed" && "fill-indigo-600 text-indigo-600"
                                      )}
                                    />
                                  </button>
                                </td>
                                <td className="px-6 py-4">
                                  <div
                                    className={cn(
                                      "text-sm font-medium",
                                      task.status === "completed" && "line-through text-gray-500",
                                      isOverdue && "text-red-600"
                                    )}
                                  >
                                    {task.title}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {task.subject}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-700">{formatDate(task.dueDate)}</div>
                                  {isOverdue && (
                                    <div className="text-xs text-red-600 font-semibold mt-1">Overdue</div>
                                  )}
                                  {!isOverdue && daysUntil >= 0 && daysUntil <= 3 && (
                                    <div className="text-xs text-amber-600 font-semibold mt-1">
                                      {daysUntil === 0 ? "Due Today" : `${daysUntil} days left`}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span
                                    className={cn(
                                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                                      priorityColors[task.priority]
                                    )}
                                  >
                                    {task.priority}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-600 max-w-xs truncate">
                                    {task.description || "No description"}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <p className="text-base font-medium">No tasks found</p>
                                <p className="text-sm">Try adjusting your search or filters</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
