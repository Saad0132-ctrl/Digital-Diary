"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConceptHeatmapProps {
  concepts: any[];
  suggestions: any[];
}

export function ConceptHeatmap({ concepts, suggestions }: ConceptHeatmapProps) {
  const getSeverityColor = (score: number) => {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-indigo-900 dark:text-indigo-100">AI Weak Concept Detection</CardTitle>
              <CardDescription className="text-indigo-700 dark:text-indigo-300">Powered by machine learning</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Subject Performance Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {concepts.map((concept, index) => (
                <motion.div
                  key={concept.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={cn(
                    "rounded-2xl p-6 text-center transition-all cursor-pointer shadow-md hover:shadow-lg",
                    getSeverityColor(concept.score)
                  )}
                >
                  <div className="text-4xl font-bold mb-2">{concept.score}%</div>
                  <div className="text-lg font-semibold mt-2">{concept.topic}</div>
                  <div className="mt-3 text-xs opacity-90">
                    {concept.score >= 80
                      ? "Strong Performance"
                      : concept.score >= 60
                        ? "Needs Improvement"
                        : "Requires Attention"}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">AI Recommendations</h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{suggestion.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion.description}</p>
                  </div>
                  <Button size="sm">Start</Button>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
