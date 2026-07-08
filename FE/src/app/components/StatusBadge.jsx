import React from "react";
import { STATUS_CONFIG } from "../constants/seedData";

export default function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || { icon: null, bg: "bg-slate-100", text: "text-slate-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.icon}
      {status}
    </span>
  );
}
