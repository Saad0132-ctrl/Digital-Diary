"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { aiSuggestions, weakConcepts, notifications } from "@/lib/mockData";
import { Sparkles, Play, Book, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AiAssistantPage() {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "practice":
        return <Zap className="h-4 w-4" />;
      case "topic":
        return <Book className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (score: number) => {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar studentName="Saad" notificationCount={notifications.filter((n) => !n.read).length} notifications={notifications} />

      <div className="flex">
        <Sidebar activeTab="ai-assistant" />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Study Assistant</h1>
              <p className="text-gray-600">Personalized learning recommendations powered by AI</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-indigo-900">AI Analysis Summary</CardTitle>
                      <p className="text-sm text-indigo-700 mt-1">
                        Based on your performance, here are personalized recommendations
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-white/80 p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {weakConcepts.filter((c) => c.score < 60).length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Topics Need Improvement</p>
                    </div>
                    <div className="rounded-lg bg-white/80 p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {aiSuggestions.length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Active Recommendations</p>
                    </div>
                    <div className="rounded-lg bg-white/80 p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">78%</div>
                      <p className="text-sm text-gray-600 mt-1">Learning Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Topic Strength Assessment</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weakConcepts.map((concept, index) => (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className={cn("rounded-xl p-4 text-center cursor-pointer transition-all", getSeverityColor(concept.score))}
                  >
                    <div className="text-2xl font-bold">{concept.score}%</div>
                    <div className="text-xs font-medium mt-2">{concept.topic}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Learning Path</h2>
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-all"
                      onClick={() =>
                        setExpandedSuggestion(
                          expandedSuggestion === suggestion.id ? null : suggestion.id
                        )
                      }
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                {getTypeIcon(suggestion.type)}
                              </div>
                              <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                              <span
                                className={cn(
                                  "ml-auto rounded-full px-3 py-1 text-xs font-semibold",
                                  getDifficultyBadge(suggestion.difficulty)
                                )}
                              >
                                {suggestion.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{suggestion.description}</p>

                            {expandedSuggestion === suggestion.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 border-t border-gray-200 pt-4"
                              >
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800 mb-2">
                                      Learning Objectives
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                      <li>Understand fundamental concepts</li>
                                      <li>Practice with real-world examples</li>
                                      <li>Master advanced techniques</li>
                                    </ul>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button className="flex-1">
                                      <Play className="h-4 w-4 mr-2" />
                                      Start Learning
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                      Bookmark
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
