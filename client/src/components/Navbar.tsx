import React from 'react';
import { Bell, Search, Plus, Cpu, Activity, Briefcase } from 'lucide-react';

interface NavbarProps {
  onScheduleClick?: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

export default function Navbar({ onScheduleClick, userEmail = 'uttham188@gmail.com', onLogout }: NavbarProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/10">
          <Briefcase className="h-5.5 w-5.5" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            Interview<span className="text-indigo-600 font-extrabold">OS</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase font-semibold">Enterprise Edition</span>
        </div>
      </div>

      {/* Center Search / Stats bar */}
      <div className="hidden md:flex items-center gap-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-450" />
          <input
            type="text"
            placeholder="Search candidates, interviews, questions..."
            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all font-sans"
          />
        </div>

        {/* Live system state */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-slate-600 flex items-center gap-1">
            Evaluation Engine: <span className="text-emerald-600 font-semibold">Operational</span>
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {onScheduleClick && (
          <button
            onClick={onScheduleClick}
            id="nav-schedule-btn"
            className="hidden sm:flex items-center gap-1.5 h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-3.5 rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Session</span>
          </button>
        )}

        {/* Notifications */}
        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all relative cursor-pointer">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800">System Admin</span>
            <span className="text-[10px] font-mono text-slate-500">{userEmail}</span>
          </div>
          <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-150 flex items-center justify-center text-xs font-bold text-indigo-600">
            {userEmail.substring(0, 2).toUpperCase()}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-xs text-slate-400 hover:text-rose-600 font-bold transition-colors cursor-pointer pl-2 border-l border-slate-200 h-6 flex items-center"
              title="Sign Out"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
