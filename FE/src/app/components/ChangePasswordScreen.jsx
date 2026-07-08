import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "./Header";

export default function ChangePasswordScreen() {
  const [show, setShow] = useState({ cur: false, new_: false, confirm: false });
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col h-full text-left">
      <Header title="Change Password" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            {saved && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
                <CheckCircle2 size={16} /> Password updated successfully!
              </div>
            )}
            <div className="space-y-4">
              {[
                { label: "Current Password", key: "cur" },
                { label: "New Password", key: "new_" },
                { label: "Confirm New Password", key: "confirm" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  <div className="relative">
                    <input
                      type={show[f.key] ? "text" : "password"}
                      defaultValue="••••••••"
                      className="w-full px-3 py-2.5 pr-10 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button onClick={() => setShow(s => ({ ...s, [f.key]: !s[f.key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {show[f.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <div className="mb-3 flex items-start gap-2 text-xs text-muted-foreground">
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                Password must be at least 8 characters and include an uppercase letter, a number, and a symbol.
              </div>
              <button onClick={() => setSaved(true)} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 shadow-md shadow-primary/20 text-center">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
