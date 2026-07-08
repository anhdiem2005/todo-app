import React from "react";
import { TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import PriorityBadge from "./PriorityBadge";
import { fmt } from "../utils/helpers";

export default function DashboardScreen({ tasks, user }) {
  const done = tasks.filter(t => t.status === "Done").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const todo = tasks.filter(t => t.status === "To Do").length;
  const total = tasks.length;

  const pieData = [
    { name: "Done", value: done, color: "#3b82f6" },
    { name: "In Progress", value: inProgress, color: "#38bdf8" },
    { name: "To Do", value: todo, color: "#e2e8f0" },
  ];

  const recent = [...tasks].slice(0, 4);

  return (
    <div className="p-6 overflow-y-auto h-full text-left">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Welcome back, {user.name.split(" ")[0]}! 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's on your plate today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Tasks", value: total, sub: "All time", color: "bg-violet-50 text-violet-600", dot: "bg-violet-500" },
          { label: "In Progress", value: inProgress, sub: "Active now", color: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
          { label: "Completed", value: done, sub: "This month", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
        ].map(c => (
          <div key={c.label} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{c.label}</p>
                <p className="text-4xl font-extrabold text-foreground mt-1">{c.value}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{c.sub}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.color}`}>
                {total > 0 ? Math.round((c.value / total) * 100) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm col-span-1">
          <h3 className="text-sm font-bold text-foreground mb-4">Task Overview</h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} tasks`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground">Recent Tasks</h3>
            <TrendingUp size={15} className="text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {recent.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-8 rounded-full flex-shrink-0 ${t.status === "Done" ? "bg-emerald-400" : t.status === "In Progress" ? "bg-primary" : "bg-slate-200"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${t.status === "Done" ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.category} · Due {fmt(t.dueDate)}</p>
                </div>
                <PriorityBadge priority={t.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
