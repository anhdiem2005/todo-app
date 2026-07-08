import React, { useState } from "react";
import Header from "./Header";

export default function AccountScreen() {
  const [editing, setEditing] = useState(false);
  return (
    <div className="flex flex-col h-full text-left">
      <Header title="Account Info" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-extrabold">MR</div>
              <div>
                <p className="font-bold text-foreground">Maya Reyes</p>
                <p className="text-sm text-muted-foreground">maya@studio.co</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "First Name", value: "Maya" },
                { label: "Last Name", value: "Reyes" },
                { label: "Email", value: "maya@studio.co" },
                { label: "Phone", value: "+1 (415) 555-0142" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  <input
                    readOnly={!editing}
                    defaultValue={f.value}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm text-foreground focus:outline-none transition-all ${editing ? "bg-input-background border border-primary/50 focus:ring-2 focus:ring-primary/40" : "bg-muted border border-transparent"}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted text-center">Cancel</button>
                  <button onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 shadow-md shadow-primary/20 text-center">Update</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 shadow-md shadow-primary/20 text-center">Edit Profile</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
