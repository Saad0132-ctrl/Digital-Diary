"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, MessageSquare } from "lucide-react";

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="secondary" className="justify-start h-auto py-4" size="lg">
              <FileText className="mr-2 h-5 w-5" />
              View Full Report
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download Progress PDF
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4" size="lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Message Teacher
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
