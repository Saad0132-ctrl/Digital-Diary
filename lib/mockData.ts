import { KPIData, HomeworkTask, PerformanceData, AttendanceData, TimelineEvent, Notification, Grade, AttendanceRecord, Report, WeakConcept } from "@/types";

export const kpiData: KPIData[] = [
  {
    id: "1",
    title: "Attendance",
    value: 94,
    unit: "%",
    trend: "up",
    trendValue: 3,
    icon: "Calendar",
    sparklineData: [88, 90, 92, 91, 93, 94, 94],
    color: "#10B981",
  },
  {
    id: "2",
    title: "Average Grade",
    value: 87,
    unit: "%",
    trend: "up",
    trendValue: 5,
    icon: "Award",
    sparklineData: [82, 83, 85, 84, 86, 87, 87],
    color: "#4F46E5",
  },
  {
    id: "3",
    title: "Pending Tasks",
    value: 8,
    unit: "tasks",
    trend: "down",
    trendValue: 2,
    icon: "ListTodo",
    sparklineData: [12, 11, 10, 9, 9, 8, 8],
    color: "#F59E0B",
  },
  {
    id: "4",
    title: "AI Readiness Score",
    value: 78,
    unit: "%",
    trend: "up",
    trendValue: 7,
    icon: "Brain",
    sparklineData: [70, 72, 74, 75, 76, 77, 78],
    color: "#3B82F6",
  },
];

// Generate homework tasks with historical data
function generateHomeworkTasks(): HomeworkTask[] {
  const tasks: HomeworkTask[] = [];
  const subjects = ["Mathematics", "English", "Science", "History", "Computer Science", "Biology"];
  const priorities: ("high" | "medium" | "low")[] = ["high", "medium", "low"];
  const statuses: ("pending" | "completed")[] = ["pending", "completed"];
  const taskTemplates = [
    { title: "Complete Chapter {n} Problems", desc: "Solve problems 1-30 from chapter {n}" },
    { title: "Write Essay on {topic}", desc: "2000 words essay about {topic}" },
    { title: "Lab Report - {topic}", desc: "Document {topic} experiment" },
    { title: "Read Chapter {n}", desc: "Study chapter {n} materials" },
    { title: "{subject} Assignment", desc: "Complete assignment on current topic" },
    { title: "Project Presentation", desc: "Prepare and present project findings" },
  ];

  let id = 1;
  // Generate tasks for the last 3 months (past and future)
  for (let monthOffset = -2; monthOffset <= 2; monthOffset++) {
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + monthOffset);
    
    // Generate 15-20 tasks per month
    const tasksPerMonth = 18;
    for (let i = 0; i < tasksPerMonth; i++) {
      const daysOffset = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
      const dueDate = new Date(baseDate);
      dueDate.setDate(dueDate.getDate() + daysOffset);
      
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const status = dueDate < new Date() && Math.random() > 0.3 ? "completed" : statuses[Math.floor(Math.random() * statuses.length)];
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      
      const title = template.title
        .replace("{n}", String(Math.floor(Math.random() * 10) + 1))
        .replace("{topic}", ["Shakespeare", "Photosynthesis", "World War II", "Algebra", "Grammar"][Math.floor(Math.random() * 5)])
        .replace("{subject}", subject);
      
      const description = template.desc
        .replace("{n}", String(Math.floor(Math.random() * 10) + 1))
        .replace("{topic}", ["Shakespeare", "Photosynthesis", "World War II", "Algebra", "Grammar"][Math.floor(Math.random() * 5)])
        .replace("{subject}", subject);

      tasks.push({
        id: id.toString(),
        title,
        subject,
        dueDate,
        priority,
        status,
        description,
      });
      id++;
    }
  }
  
  return tasks;
}

export const homeworkTasks: HomeworkTask[] = generateHomeworkTasks();

export const performanceData: PerformanceData[] = [
  { month: "Jan", math: 75, science: 80, english: 70, history: 78 },
  { month: "Feb", math: 78, science: 82, english: 73, history: 80 },
  { month: "Mar", math: 82, science: 85, english: 78, history: 82 },
  { month: "Apr", math: 85, science: 88, english: 82, history: 85 },
  { month: "May", math: 88, science: 90, english: 85, history: 87 },
];

export const subjectScores = [
  { subject: "Math", score: 87 },
  { subject: "Science", score: 92 },
  { subject: "English", score: 88 },
  { subject: "History", score: 90 },
];

export const attendanceData: AttendanceData[] = [
  { week: "Week 1", percentage: 90 },
  { week: "Week 2", percentage: 92 },
  { week: "Week 3", percentage: 88 },
  { week: "Week 4", percentage: 95 },
];

export const weakConcepts: WeakConcept[] = [
  { id: "1", topic: "English", score: 65 },
  { id: "2", topic: "Mathematics", score: 92 },
];

export const aiSuggestions = [
  { id: "1", title: "Improve Grammar Skills", description: "Complete interactive grammar exercises and quizzes", type: "practice", difficulty: "medium" },
  { id: "2", title: "Essay Writing Practice", description: "Practice structured essay writing with AI feedback", type: "practice", difficulty: "medium" },
  { id: "3", title: "Advanced Problem Solving", description: "Master complex mathematical concepts with AI guidance", type: "topic", difficulty: "hard" },
  { id: "4", title: "Mathematical Reasoning", description: "Enhance logical thinking and problem-solving strategies", type: "topic", difficulty: "medium" },
];

export const timelineEvents: TimelineEvent[] = [
  { id: "1", title: "Math Final Exam", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), type: "exam", subject: "Mathematics", description: "Covers chapters 1-8" },
  { id: "2", title: "Science Quiz", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), type: "quiz", subject: "Science", description: "Physics fundamentals" },
  { id: "3", title: "English Essay Deadline", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), type: "deadline", subject: "English", description: "2000 word essay submission" },
  { id: "4", title: "Parent-Teacher Meeting", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), type: "meeting", description: "Quarterly progress review" },
];

export const notifications: Notification[] = [
  { id: "1", title: "New Assignment Posted", message: "Mr. Smith posted a new Math assignment due next week", type: "message", read: false, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "2", title: "Low Attendance Warning", message: "Your attendance in Science class is below 90%", type: "warning", read: false, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: "3", title: "Grade Updated", message: "Your English essay grade has been posted: A-", type: "success", read: true, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: "4", title: "Homework Reminder", message: "Science Lab Report is due tomorrow", type: "alert", read: false, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
];

// Generate grades with historical data
function generateGrades(): Grade[] {
  const grades: Grade[] = [];
  const subjects = ["Mathematics", "English", "Science", "History", "Computer Science"];
  const assessmentTypes = ["Mid-term Exam", "Final Exam", "Quiz", "Assignment", "Lab Practical", "Project", "Essay", "Presentation"];
  const comments = [
    "Great work! Keep it up.",
    "Excellent performance.",
    "Good understanding of concepts.",
    "Well-researched and presented.",
    "Needs improvement in some areas.",
    "Outstanding effort!",
    "Good progress shown.",
    "Clean work and good logic.",
  ];

  let id = 1;
  // Generate grades for the last 4 months
  for (let monthOffset = -3; monthOffset <= 0; monthOffset++) {
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + monthOffset);
    
    // Generate 8-12 grades per month
    const gradesPerMonth = 10;
    for (let i = 0; i < gradesPerMonth; i++) {
      const daysOffset = Math.floor(Math.random() * 30);
      const date = new Date(baseDate);
      date.setDate(date.getDate() + daysOffset);
      
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const assessment = assessmentTypes[Math.floor(Math.random() * assessmentTypes.length)];
      const totalMarks = [50, 100, 150][Math.floor(Math.random() * 3)];
      const percentage = 70 + Math.floor(Math.random() * 25); // 70-95%
      const marks = Math.round((percentage / 100) * totalMarks);
      const comment = comments[Math.floor(Math.random() * comments.length)];

      grades.push({
        id: id.toString(),
        subject,
        assessment,
        marks,
        totalMarks,
        percentage,
        date,
        comments: comment,
      });
      id++;
    }
  }
  
  return grades.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const grades: Grade[] = generateGrades();

// Helper function to generate attendance records for a date range
function generateAttendanceRecords(startDate: Date, endDate: Date, startId: number): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const subjects = ["Mathematics", "English", "Science"];
  const statuses: ("present" | "absent" | "leave")[] = ["present", "present", "present", "present", "present", "absent", "leave"];
  
  let currentDate = new Date(startDate);
  let id = startId;
  
  while (currentDate <= endDate) {
    // Skip weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Generate 3 records per day (one for each subject)
      subjects.forEach((subject) => {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        records.push({
          id: id.toString(),
          date: new Date(currentDate),
          status: randomStatus,
          subject: subject,
        });
        id++;
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return records;
}

// Generate records for the last 4 months
const now = new Date();
const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 4, 1);
const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

export const attendanceRecords: AttendanceRecord[] = [
  ...generateAttendanceRecords(fourMonthsAgo, currentMonthEnd, 1),
];

export const reports: Report[] = [
  { id: "1", title: "Academic Performance Report", type: "academic", generatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), content: "Overall GPA: 3.8/4.0. Strong performance across all subjects with particular excellence in Science." },
  { id: "2", title: "Attendance Report", type: "attendance", generatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), content: "Current attendance: 94%. No concerning absences. Excellent consistency." },
  { id: "3", title: "Progress Report", type: "progress", generatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), content: "Showing steady improvement in Mathematics. Recommended: Continue extra practice sessions." },
  { id: "4", title: "Behavioral Report", type: "behavioral", generatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), content: "Positive classroom participation. Good peer relationships. Recommended leadership roles." },
];
