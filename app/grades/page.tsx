"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { grades, notifications } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";
import { Search, Filter, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export default function GradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
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

  // Get unique subjects and available months/years
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set(grades.map((g) => g.subject).filter(Boolean));
    return Array.from(subjects).sort();
  }, []);

  const availableMonths = useMemo(() => {
    const months = new Set<number>();
    const years = new Set<number>();
    grades.forEach((grade) => {
      const date = new Date(grade.date);
      months.add(date.getMonth());
      years.add(date.getFullYear());
    });
    return { months: Array.from(months).sort(), years: Array.from(years).sort((a, b) => b - a) };
  }, []);

  // Filter and search grades
  const filteredGrades = useMemo(() => {
    return grades
      .filter((grade) => {
        const gradeDate = new Date(grade.date);
        const gradeMonth = gradeDate.getMonth();
        const gradeYear = gradeDate.getFullYear();

        // Date filter
        if (gradeMonth !== selectedMonth || gradeYear !== selectedYear) return false;

        // Subject filter
        if (subjectFilter !== "all" && grade.subject !== subjectFilter) return false;

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const subjectStr = (grade.subject || "").toLowerCase();
          const assessmentStr = (grade.assessment || "").toLowerCase();
          const dateStr = formatDate(grade.date).toLowerCase();
          const commentStr = (grade.comments || "").toLowerCase();

          if (
            !subjectStr.includes(query) &&
            !assessmentStr.includes(query) &&
            !dateStr.includes(query) &&
            !commentStr.includes(query)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [searchQuery, subjectFilter, selectedMonth, selectedYear]);

  // Calculate stats for current month
  const monthStats = useMemo(() => {
    const monthGrades = grades.filter((grade) => {
      const gradeDate = new Date(grade.date);
      return gradeDate.getMonth() === selectedMonth && gradeDate.getFullYear() === selectedYear;
    });
    const averagePercentage =
      monthGrades.length > 0
        ? Math.round(monthGrades.reduce((sum, g) => sum + g.percentage, 0) / monthGrades.length)
        : 0;
    const totalMarks = monthGrades.reduce((sum, g) => sum + g.marks, 0);
    const maxMarks = monthGrades.reduce((sum, g) => sum + g.totalMarks, 0);
    return { averagePercentage, totalMarks, maxMarks, count: monthGrades.length };
  }, [selectedMonth, selectedYear]);

  // Subject averages for current month
  const subjectAverages = useMemo(() => {
    const monthGrades = grades.filter((grade) => {
      const gradeDate = new Date(grade.date);
      return gradeDate.getMonth() === selectedMonth && gradeDate.getFullYear() === selectedYear;
    });
    return uniqueSubjects.map((subject) => {
      const subjectGrades = monthGrades.filter((g) => g.subject === subject);
      const avg = subjectGrades.length > 0
        ? Math.round(subjectGrades.reduce((sum, g) => sum + g.percentage, 0) / subjectGrades.length)
        : 0;
      return { subject: subject.substring(0, 3), average: avg, fullName: subject };
    });
  }, [selectedMonth, selectedYear, uniqueSubjects]);

  // Performance trend for current month
  const performanceTrend = useMemo(() => {
    const monthGrades = grades
      .filter((grade) => {
        const gradeDate = new Date(grade.date);
        return gradeDate.getMonth() === selectedMonth && gradeDate.getFullYear() === selectedYear;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return monthGrades.map((g, i) => ({ month: `G${i + 1}`, percentage: g.percentage }));
  }, [selectedMonth, selectedYear]);

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

  const hasActiveFilters = subjectFilter !== "all" || searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setSubjectFilter("all");
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar studentName="Saad" notificationCount={notifications.filter((n) => !n.read).length} notifications={notifications} />

      <div className="flex">
        <Sidebar activeTab="grades" />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Grades & Assessment</h1>
              <p className="text-gray-600 dark:text-gray-400">Your academic performance across all subjects</p>
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

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{monthStats.averagePercentage}%</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Average</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{monthStats.totalMarks}/{monthStats.maxMarks}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Total Marks</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">{monthStats.count}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Assessments</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      {performanceTrend.length > 0 ? (
                        <LineChart data={performanceTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="month" stroke={axisColor} />
                          <YAxis stroke={axisColor} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line type="monotone" dataKey="percentage" stroke="#4F46E5" strokeWidth={2} dot={{ fill: "#4F46E5" }} />
                        </LineChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No data for this month
                        </div>
                      )}
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Subject-wise Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      {subjectAverages.some((s) => s.average > 0) ? (
                        <BarChart data={subjectAverages}>
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="subject" stroke={axisColor} />
                          <YAxis stroke={axisColor} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Bar dataKey="average" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No data for this month
                        </div>
                      )}
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
                      <CardTitle>All Grades</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Showing {filteredGrades.length} of {monthStats.count} grades for {monthNames[selectedMonth]} {selectedYear}
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
                        placeholder="Search by subject, assessment, date, or comments..."
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
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Subject
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Assessment
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Marks
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Percentage
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Comments
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredGrades.length > 0 ? (
                            filteredGrades.map((grade) => (
                              <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {formatDate(grade.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                  {grade.subject}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                  {grade.assessment}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                                  {grade.marks}/{grade.totalMarks}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className={cn("text-2xl font-bold", getGradeColor(grade.percentage))}>
                                    {grade.percentage}%
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                    {grade.comments || "No comments"}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                  <p className="text-base font-medium">No grades found</p>
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
