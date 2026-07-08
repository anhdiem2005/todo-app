import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export default function TaskModal({
  open, onClose, onSave, categories,
  initial,
}) {
  const [title, setTitle]       = useState(initial?.title ?? "");
  const [desc, setDesc]         = useState(initial?.description ?? "");
  const [cat, setCat]           = useState(initial?.category ?? categories[0]?.name ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? "Medium");
  const [status, setStatus]     = useState(initial?.status ?? "To Do");
  const [due, setDue]           = useState(initial?.dueDate ?? "2026-07-20");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 border border-border text-left">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-foreground">{initial?.id ? "Edit Task" : "Add New Task"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="What needs to be done?" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" placeholder="Optional details…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Category</label>
              <div className="relative">
                <select value={cat} onChange={e => setCat(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8">
                  {categories.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Priority</label>
              <div className="relative">
                <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8">
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Status</label>
              <div className="relative">
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8">
                  <option>To Do</option><option>In Progress</option><option>Done</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Due Date</label>
              <input type="date" value={due} onChange={e => setDue(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border bg-white text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors text-center">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                title,
                description: desc,
                category: cat,
                priority: priority.toLowerCase(),
                status: status.toLowerCase(),
                dueDate: due,
              });
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20 text-center"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}
