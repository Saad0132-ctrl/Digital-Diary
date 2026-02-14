"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, BookOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimelineEvent } from "@/types";
import { formatDate, getRelativeTime } from "@/lib/utils";

interface EventsTimelineProps {
  events: TimelineEvent[];
}

export function EventsTimeline({ events }: EventsTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-red-100 text-red-600 border-red-200";
      case "quiz":
        return "bg-blue-100 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="relative flex gap-4"
              >
                <div className={cn("z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2", getEventColor(event.type))}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-md">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</h4>
                  {event.subject && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.subject}</p>}
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{getRelativeTime(event.date)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
