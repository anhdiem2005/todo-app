import React, { useState, useEffect } from "react";
import { X, ChevronDown, Plus, Trash2 } from "lucide-react";

export default function TaskModal({ open, onClose, onSave, categories, initial }) {
  const [title, setTitle]       = useState("");
  const [desc, setDesc]         = useState("");
  const [cat, setCat]           = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus]     = useState("To Do");
  const [due, setDue]           = useState("2026-07-20");
  const [subtasks, setSubtasks] = useState([]);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDesc(initial?.description ?? "");
      setCat(initial?.category ?? categories[0]?.name ?? "");
      setPriority(initial?.priority ?? "Medium");
      setStatus(initial?.status ?? "To Do");
      setDue(initial?.dueDate ?? new Date().toISOString().split('T')[0]);
      setSubtasks(initial?.subtasks ? initial.subtasks.map(s => ({ label: s.label, done: s.done })) : []);
    }
  }, [open, initial, categories]);

  if (!open) return null;

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { label: "", done: false }]);
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index].label = value;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 border border-border text-left flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-bold text-foreground">{initial?.id ? "Chỉnh sửa công việc" : "Thêm công việc mới"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form Body (Scrollable nếu nhiều subtask) */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Tiêu đề</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Bạn cần làm gì?" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Mô tả</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" placeholder="Chi tiết thêm (không bắt buộc)…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Danh mục</label>
              <div className="relative">
                <select value={cat} onChange={e => setCat(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8">
                  {categories.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Độ ưu tiên</label>
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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Trạng thái</label>
              <div className="relative">
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8">
                  <option>To Do</option><option>In Progress</option><option>Done</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Hạn chót</label>
              <input type="date" value={due} onChange={e => setDue(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>

          {/* Khu vực nhập liệu Nhiệm vụ con (Subtasks) */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Việc con cần làm ({subtasks.length})</label>
              <button type="button" onClick={handleAddSubtask} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                <Plus size={14} /> Thêm việc con
              </button>
            </div>
            <div className="space-y-2">
              {subtasks.map((st, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={st.label}
                    onChange={e => handleSubtaskChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-input-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder={`Việc con #${index + 1}...`}
                    required
                  />
                  <button type="button" onClick={() => handleRemoveSubtask(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-4 pt-3 border-t border-border flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border bg-white text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors text-center">
            Hủy
          </button>
          <button
            onClick={() => {
              if(!title.trim()) return alert("Vui lòng điền tiêu đề công việc!");
              onSave({
                title,
                description: desc,
                category: cat,
                priority: priority.toLowerCase(),
                status: status.toLowerCase(),
                dueDate: due,
                subtasks: subtasks.filter(s => s.label.trim() !== "") // Chỉ lưu subtask có nội dung
              });
            }}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20 text-center"
          >
            Lưu công việc
          </button>
        </div>
      </div>
    </div>
  );
}