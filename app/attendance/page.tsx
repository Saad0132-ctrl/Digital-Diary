"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { attendanceRecords, notifications } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, Search, Filter, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Simple theme detection
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const tooltipStyle = {
    backgroundColor: isDark ? "#1f2937" : "white",
    borderColor: isDark ? "#374151" : "#e5e7eb",
    color: isDark ? "#f3f4f6" : "#1f2937",
    borderRadius: "12px"
  };

  // These will be updated to use monthStats

  // Get unique subjects for filter
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set(attendanceRecords.map((r) => r.subject).filter(Boolean));
    return Array.from(subjects).sort();
  }, []);

  // Get available months and years from records
  const availableMonths = useMemo(() => {
    const months = new Set<number>();
    const years = new Set<number>();
    attendanceRecords.forEach((record) => {
      const date = new Date(record.date);
      months.add(date.getMonth());
      years.add(date.getFullYear());
    });
    return { months: Array.from(months).sort(), years: Array.from(years).sort((a, b) => b - a) };
  }, []);

  // Calculate stats for current filtered month
  const monthStats = useMemo(() => {
    const monthRecords = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
    });
    const present = monthRecords.filter((r) => r.status === "present").length;
    const absent = monthRecords.filter((r) => r.status === "absent").length;
    const leave = monthRecords.filter((r) => r.status === "leave").length;
    const total = monthRecords.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, leave, total, percentage };
  }, [selectedMonth, selectedYear]);

  const attendanceBySubject = [
    { subject: "Mathematics", percentage: 95 },
    { subject: "English", percentage: 92 },
    { subject: "Science", percentage: 94 },
    { subject: "History", percentage: 90 },
    { subject: "Computer Science", percentage: 96 },
  ];

  const pieData = [
    { name: "Present", value: monthStats.present, color: "#10B981" },
    { name: "Absent", value: monthStats.absent, color: "#EF4444" },
    { name: "Leave", value: monthStats.leave, color: "#F59E0B" },
  ];

  // Filter and search records
  const filteredRecords = useMemo(() => {
    return attendanceRecords
      .filter((record) => {
        const recordDate = new Date(record.date);
        const recordMonth = recordDate.getMonth();
        const recordYear = recordDate.getFullYear();

        // Date filter - filter by selected month and year
        if (recordMonth !== selectedMonth || recordYear !== selectedYear) return false;

        // Status filter
        if (statusFilter !== "all" && record.status !== statusFilter) return false;

        // Subject filter
        if (subjectFilter !== "all" && record.subject !== subjectFilter) return false;

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const dateStr = formatDate(record.date).toLowerCase();
          const subjectStr = (record.subject || "").toLowerCase();
          const dayStr = new Date(record.date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
          const statusStr = record.status.toLowerCase();

          if (
            !dateStr.includes(query) &&
            !subjectStr.includes(query) &&
            !dayStr.includes(query) &&
            !statusStr.includes(query)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, statusFilter, subjectFilter, selectedMonth, selectedYear]);

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

  const hasActiveFilters = statusFilter !== "all" || subjectFilter !== "all" || searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSubjectFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar studentName="Saad" notificationCount={notifications.filter((n) => !n.read).length} notifications={notifications} />

      <div className="flex">
        <Sidebar activeTab="attendance" />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Attendance</h1>
              <p className="text-gray-600 dark:text-gray-400">Your attendance history and statistics</p>
            </div>

            {/* Date Navigation */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
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
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Viewing: <span className="font-semibold text-gray-800 dark:text-gray-200">{monthNames[selectedMonth]} {selectedYear}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">{monthStats.percentage}%</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Overall</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-500 dark:text-green-400">{monthStats.present}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Present</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-500 dark:text-red-400">{monthStats.absent}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Absent</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-500 dark:text-amber-400">{monthStats.leave}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Leave</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Subject-wise Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={attendanceBySubject}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="subject" stroke={axisColor} angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke={axisColor} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="percentage" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Attendance Records</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Showing {filteredRecords.length} of {monthStats.total} records for {monthNames[selectedMonth]} {selectedYear}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter Bar */}
                  <div className="mb-6 space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search by date, subject, day, or status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                      </div>

                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="all">All Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                      </select>

                      {/* Subject Filter */}
                      <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="all">All Subjects</option>
                        {uniqueSubjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>

                      {/* Clear Filters Button */}
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table Container with Fixed Height */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto" style={{ maxHeight: "600px", overflowY: "auto" }}>
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Day
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Subject
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Icon
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredRecords.length > 0 ? (
                            filteredRecords.map((record, index) => (
                              <tr
                                key={record.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {formatDate(record.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                  {new Date(record.date).toLocaleDateString("en-US", { weekday: "short" })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                  {record.subject || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span
                                    className={cn(
                                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                                      record.status === "present" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                                      record.status === "absent" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                                      record.status === "leave" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                    )}
                                  >
                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {record.status === "present" && (
                                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                  )}
                                  {record.status === "absent" && (
                                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                                  )}
                                  {record.status === "leave" && (
                                    <Clock className="h-5 w-5 text-amber-500 mx-auto" />
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                  <p className="text-base font-medium">No records found</p>
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
          </motion.div>
        </main>
      </div>
    </div>
  );
}
