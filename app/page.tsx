"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StudentHeader } from "@/components/dashboard/StudentHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { HomeworkTable } from "@/components/dashboard/HomeworkTable";
import { PerformanceCharts } from "@/components/dashboard/PerformanceCharts";
import { ConceptHeatmap } from "@/components/dashboard/ConceptHeatmap";
import { EventsTimeline } from "@/components/dashboard/EventsTimeline";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  kpiData,
  homeworkTasks,
  performanceData,
  subjectScores,
  attendanceData,
  weakConcepts,
  aiSuggestions,
  timelineEvents,
  notifications,
} from "@/lib/mockData";

export default function DashboardPage() {
  const [tasks, setTasks] = useState(homeworkTasks);

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task
      )
    );
  };

  const pendingTasksCount = tasks.filter((t) => t.status === "pending").length;
  const upcomingExamsCount = timelineEvents.filter((e) => e.type === "exam").length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar studentName="Saad" notificationCount={unreadNotifications} notifications={notifications} />

      <div className="flex">
        <Sidebar activeTab="dashboard" />

        <main className="flex-1 p-6">
          <StudentHeader studentName="Saad" todayTasks={pendingTasksCount} upcomingExams={upcomingExamsCount} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {kpiData.map((kpi, index) => (
              <KpiCard key={kpi.id} {...kpi} index={index} />
            ))}
          </div>

          <div className="mb-6">
            <HomeworkTable tasks={tasks} onToggleTask={handleToggleTask} />
          </div>

          <div className="mb-6">
            <PerformanceCharts performanceData={performanceData} subjectScores={subjectScores} attendanceData={attendanceData} />
          </div>

          <div className="mb-6">
            <ConceptHeatmap concepts={weakConcepts} suggestions={aiSuggestions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <EventsTimeline events={timelineEvents} />
            <NotificationsPanel notifications={notifications} />
          </div>

          <QuickActions />
        </main>
      </div>
    </div>
  );
}
