import React, { useState } from "react";
import { Plus, CheckCircle2, MoreHorizontal, CalendarDays } from "lucide-react";
import Header from "./Header";
import TaskModal from "./TaskModal";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { fmt } from "../utils/helpers";

export default function MyTaskScreen({
  tasks, onAdd, onView, onEdit,
  categories,
}) {
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tasks.filter(t =>
    (filter === "All" || t.status === filter) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <TaskModal open={modal} onClose={() => setModal(false)} onSave={onAdd} categories={categories} />
      <div className="flex flex-col h-full text-left">
        <Header title="My Tasks" onSearch={setSearch} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-2">
              {["All", "To Do", "In Progress", "Done"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-card text-muted-foreground border border-border hover:bg-muted"}`}>
                  {f}
                </button>
              ))}
            </div>
            <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20">
              <Plus size={16} /> Add Task
            </button>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">No tasks found.</div>
            )}
            {filtered.map(t => (
              <div key={t.id} className="bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onEdit(t.id, { ...t, status: t.status === "Done" ? "To Do" : "Done" })}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${t.status === "Done" ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/40 hover:border-primary"}`}
                  >
                    {t.status === "Done" && <CheckCircle2 size={12} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <button onClick={() => onView(t)} className="text-sm font-semibold text-foreground hover:text-primary transition-colors text-left">
                        {t.title}
                      </button>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <StatusBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays size={11} /> {fmt(t.dueDate)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{t.category}</span>
                    </div>
                    {t.subtasks && t.subtasks.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(t.subtasks.filter(s => s.done).length / t.subtasks.length) * 100}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">{t.subtasks.filter(s => s.done).length}/{t.subtasks.length}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
