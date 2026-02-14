"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { reports, notifications } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";
import { Download, Eye, Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getReportIcon = (type: string) => {
    switch (type) {
      case "academic":
        return "📚";
      case "attendance":
        return "📅";
      case "progress":
        return "📈";
      case "behavioral":
        return "👥";
      default:
        return "📄";
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case "academic":
        return "bg-blue-50 border-blue-200";
      case "attendance":
        return "bg-green-50 border-green-200";
      case "progress":
        return "bg-purple-50 border-purple-200";
      case "behavioral":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  // Filter and search reports
  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        // Type filter
        if (typeFilter !== "all" && report.type !== typeFilter) return false;

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const titleStr = report.title.toLowerCase();
          const contentStr = report.content.toLowerCase();
          const typeStr = report.type.toLowerCase();
          const dateStr = formatDate(report.generatedDate).toLowerCase();

          if (
            !titleStr.includes(query) &&
            !contentStr.includes(query) &&
            !typeStr.includes(query) &&
            !dateStr.includes(query)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime());
  }, [searchQuery, typeFilter]);

  const hasActiveFilters = typeFilter !== "all" || searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar studentName="Saad" notificationCount={notifications.filter((n) => !n.read).length} notifications={notifications} />

      <div className="flex">
        <Sidebar activeTab="reports" />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive performance reports and analytics</p>
            </div>

            {/* Search and Filter Bar */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by title, content, type, or date..."
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

                    {/* Type Filter */}
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="all">All Types</option>
                      <option value="academic">Academic</option>
                      <option value="attendance">Attendance</option>
                      <option value="progress">Progress</option>
                      <option value="behavioral">Behavioral</option>
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
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredReports.length} of {reports.length} reports
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className={cn("h-full border-2", getReportColor(report.type))}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{getReportIcon(report.type)}</span>
                            <div>
                              <CardTitle className="text-lg">{report.title}</CardTitle>
                              <p className="text-xs text-gray-500 mt-1">
                                Generated {formatDate(report.generatedDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">{report.content}</p>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedReport(report.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-base font-medium">No reports found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </div>
              )}
            </div>

            {selectedReport && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                onClick={() => setSelectedReport(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="mb-6">
                    {reports.find((r) => r.id === selectedReport) && (
                      <>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                          {reports.find((r) => r.id === selectedReport)?.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Generated on {formatDate(reports.find((r) => r.id === selectedReport)?.generatedDate || new Date())}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {reports.find((r) => r.id === selectedReport)?.content}
                    </p>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedReport(null)}>
                      Close
                    </Button>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
