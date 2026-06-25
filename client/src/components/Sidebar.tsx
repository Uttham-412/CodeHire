import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  BrainCircuit,
  BarChart3,
  Sliders,
  HelpCircle, 
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & metrics' },
    { id: 'interviews', label: 'Interviews', icon: Calendar, desc: 'Schedule & evaluate' },
    { id: 'candidates', label: 'Candidates', icon: Users, desc: 'Applicant tracking' },
    { id: 'questions', label: 'Question Bank', icon: BookOpen, desc: 'Coding challenges' },
    { id: 'aptitude', label: 'Aptitude Tests', icon: BrainCircuit, desc: 'Screening assessments' },
    { id: 'reports', label: 'Reports', icon: BarChart3, desc: 'Hiring metrics & charts' },
    { id: 'settings', label: 'Settings', icon: Sliders, desc: 'Workspace & rubrics' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between h-[calc(100vh-64px)] sticky top-16 z-30">
      {/* Top Navigation Options */}
      <div className="p-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase px-3 mb-2">Workspace Panel</p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              id={`sidebar-tab-${item.id}`}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-50 border-l-2 border-indigo-600 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 transition-transform duration-200 shrink-0 ${
                isActive ? 'text-indigo-600 scale-105' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">{item.label}</span>
                <span className={`text-[9px] font-normal ${isActive ? 'text-indigo-500/80' : 'text-slate-450'}`}>{item.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Information Panel */}
      <div className="p-4 flex flex-col gap-3 border-t border-slate-200">
        {/* Environment Alert */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="flex gap-2 text-emerald-600">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider font-mono">SOC-2 Enterprise Mode</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
            Applicant tracking, rubrics, and screening tests are locked behind secure multi-party verification.
          </p>
        </div>

        {/* Quick Utilities */}
        <div className="flex items-center justify-between text-slate-500 text-xs px-2">
          <button 
            onClick={() => setCurrentTab('settings')}
            className="hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-400" />
            <span>Settings</span>
          </button>
          <span className="text-slate-200">|</span>
          <button 
            onClick={() => alert('Support ticket system ready. Please reach out to uttham188@gmail.com if you have questions!')}
            className="hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
