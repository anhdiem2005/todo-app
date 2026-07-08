import React from "react";
import { Flame } from "lucide-react";
import { PRIORITY_CONFIG } from "../constants/seedData";

export default function PriorityBadge({ priority }) {
  const c = PRIORITY_CONFIG[priority] || { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {priority === "High" && <Flame size={10} />}
      {priority}
    </span>
  );
}
