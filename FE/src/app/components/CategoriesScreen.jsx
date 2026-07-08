import React, { useState } from "react";
import { Tag, Plus, X } from "lucide-react";
import Header from "./Header";

export default function CategoriesScreen({ categories, tasks }) {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-border text-left">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">Add Category</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Category Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4" placeholder="e.g. Design" />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted text-center">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 text-center">Save</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col h-full text-left">
        <Header title="Categories" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-end mb-5">
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 shadow-md shadow-primary/20">
              <Plus size={16} /> Add Category
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(c => {
              const catTasks = tasks.filter(t => t.category === c.name);
              const done = catTasks.filter(t => t.status === "Done").length;
              return (
                <div key={c.id} className="bg-card rounded-2xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.color + "22" }}>
                      <Tag size={18} style={{ color: c.color }} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{catTasks.length} tasks</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: catTasks.length ? `${(done / catTasks.length) * 100}%` : "0%", background: c.color }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{done} of {catTasks.length} completed</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
