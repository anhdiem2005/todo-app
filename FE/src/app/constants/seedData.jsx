import React from "react";
import {
  Circle,
  Clock,
  CheckCircle2,
  LayoutDashboard,
  CheckSquare,
  Tag,
  User,
  Lock,
} from "lucide-react";

export const USER = { name: "Maya Reyes", email: "maya@studio.co" };

export const initialTasks = [
  {
    id: 1,
    title: "Redesign landing page hero section",
    description: "Update the hero section with the new brand guidelines. Include updated copy, new illustration, and CTA button redesign.",
    category: "Design",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-07-12",
    subtasks: [
      { label: "Update color palette", done: true },
      { label: "Create new illustration", done: false },
      { label: "Revise headline copy", done: false },
      { label: "Responsive review", done: false },
    ],
  },
  {
    id: 2,
    title: "Write Q3 product roadmap",
    description: "Compile the quarterly roadmap document based on engineering estimates and stakeholder input.",
    category: "Planning",
    priority: "High",
    status: "To Do",
    dueDate: "2026-07-10",
    subtasks: [
      { label: "Gather team estimates", done: true },
      { label: "Draft roadmap doc", done: false },
    ],
  },
  {
    id: 3,
    title: "Fix checkout flow bug on mobile",
    description: "The payment step crashes on Safari iOS 17. Reproduce and patch.",
    category: "Engineering",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-07-09",
    subtasks: [
      { label: "Reproduce on device", done: true },
      { label: "Identify root cause", done: true },
      { label: "Deploy patch", done: false },
    ],
  },
  {
    id: 4,
    title: "Draft newsletter for July",
    description: "Write and schedule the monthly newsletter. Focus on new feature highlights and upcoming events.",
    category: "Marketing",
    priority: "Medium",
    status: "To Do",
    dueDate: "2026-07-20",
    subtasks: [
      { label: "Outline content", done: false },
      { label: "Write copy", done: false },
      { label: "Design email layout", done: false },
    ],
  },
  {
    id: 5,
    title: "Set up CI/CD pipeline for staging",
    description: "Automate deployment to staging environment using GitHub Actions.",
    category: "Engineering",
    priority: "Medium",
    status: "Done",
    dueDate: "2026-07-05",
    subtasks: [
      { label: "Write workflow YAML", done: true },
      { label: "Configure secrets", done: true },
      { label: "Test pipeline end-to-end", done: true },
    ],
  },
  {
    id: 6,
    title: "Conduct user interviews for onboarding",
    description: "Schedule and run 5 user sessions to gather feedback on the onboarding experience.",
    category: "Research",
    priority: "Low",
    status: "Done",
    dueDate: "2026-07-03",
    subtasks: [
      { label: "Recruit participants", done: true },
      { label: "Run sessions", done: true },
      { label: "Synthesize findings", done: true },
    ],
  },
];

export const initialCategories = [
  { id: 1, name: "Design", color: "#7b6ff0", count: 4 },
  { id: 2, name: "Engineering", color: "#e8634a", count: 7 },
  { id: 3, name: "Marketing", color: "#f5a623", count: 3 },
  { id: 4, name: "Planning", color: "#4caf87", count: 5 },
  { id: 5, name: "Research", color: "#f5c4b8", count: 2 },
];

export const PRIORITY_CONFIG = {
  High:   { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200" },
  Medium: { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200" },
  Low:    { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-200" },
};

export const STATUS_CONFIG = {
  "To Do":      { icon: <Circle size={14} />,       bg: "bg-slate-100",   text: "text-slate-500" },
  "In Progress":{ icon: <Clock size={14} />,         bg: "bg-blue-50",     text: "text-blue-500" },
  "Done":       { icon: <CheckCircle2 size={14} />,  bg: "bg-emerald-50",  text: "text-emerald-600" },
};

export const NAV_ITEMS = [
  { id: "dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { id: "my-task",         label: "My Tasks",        icon: CheckSquare },
  { id: "categories",      label: "Categories",      icon: Tag },
  { id: "account",         label: "Account Info",    icon: User },
  { id: "change-password", label: "Change Password", icon: Lock },
];
