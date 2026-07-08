import React from "react";
import { Search, CalendarDays, Bell } from "lucide-react";

export default function Header({ title, onSearch }) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
      <h2 className="text-foreground font-bold text-lg flex-1">{title}</h2>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          onChange={e => onSearch?.(e.target.value)}
          placeholder="Search tasks…"
          className="pl-9 pr-4 py-2 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 w-52 transition-all"
        />
      </div>
      <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
        <CalendarDays size={17} />
      </button>
      <button className="relative w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
      </button>
    </header>
  );
}
