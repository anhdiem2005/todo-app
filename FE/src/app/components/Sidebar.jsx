import React from "react";
import { LogOut } from "lucide-react";
import Avatar from "./Avatar";
import { NAV_ITEMS } from "../constants/seedData";

export default function Sidebar({ screen, onNav, user }) {
  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col h-full flex-shrink-0">
      <div className="px-5 pt-8 pb-6 flex flex-col items-center gap-3 border-b border-sidebar-border">
        <Avatar name={user.name} size="lg" />
        <div className="text-center">
          <p className="text-sidebar-foreground font-bold text-sm leading-tight">{user.name}</p>
          <p className="text-muted-foreground text-xs mt-0.5">{user.email}</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = screen === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-6">
        <button
          onClick={() => onNav("login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary transition-all text-left"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
