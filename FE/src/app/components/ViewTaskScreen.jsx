import React from "react";
import { ChevronRight, Paperclip, CheckCircle2 } from "lucide-react";
import Header from "./Header";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import { fmt } from "../utils/helpers";

export default function ViewTaskScreen({ task, onBack, onUpdate }) {
  const toggleSub = (i) => {
    const updated = { ...task, subtasks: task.subtasks.map((s, j) => j === i ? { ...s, done: !s.done } : s) };
    onUpdate(updated);
  };

  return (
    <div className="flex flex-col h-full text-left">
      <Header title="Task Detail" />
      <div className="flex-1 overflow-y-auto p-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ChevronRight size={14} className="rotate-180" /> Back to tasks
        </button>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl font-extrabold text-foreground leading-tight">{task.title}</h1>
            <div className="flex gap-2 flex-shrink-0">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">{task.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5">Category</span>
              <span className="font-semibold text-foreground">{task.category}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5">Due Date</span>
              <span className="font-semibold text-foreground">{fmt(task.dueDate)}</span>
            </div>
          </div>
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Sub-tasks</h3>
              <span className="text-xs text-muted-foreground">{task.subtasks.filter(s => s.done).length} of {task.subtasks.length} done</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(task.subtasks.filter(s => s.done).length / task.subtasks.length) * 100}%` }} />
            </div>
            <div className="space-y-2.5">
              {task.subtasks.map((s, i) => (
                <button key={i} onClick={() => toggleSub(i)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${s.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/40"}`}>
                    {s.done && <CheckCircle2 size={12} />}
                  </div>
                  <span className={`text-sm ${s.done ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Paperclip size={14} /> Attachments
          </h3>
          <div className="flex flex-wrap gap-3">
            {["brief-v2.pdf", "mockup-final.fig"].map(f => (
              <div key={f} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl text-xs font-medium text-muted-foreground border border-border">
                <Paperclip size={12} /> {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
