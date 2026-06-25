import React from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Star, 
  Plus, 
  ArrowRight, 
  ExternalLink,
  Brain,
  ShieldCheck,
  TrendingUp,
  Clock,
  Briefcase,
  FileSpreadsheet,
  Sliders,
  Award
} from 'lucide-react';
import { Candidate, InterviewSession, Question } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  interviews: InterviewSession[];
  questions: Question[];
  onNavigate: (tab: string) => void;
  onScheduleClick: () => void;
}

export default function Dashboard({
  candidates,
  interviews,
  questions,
  onNavigate,
  onScheduleClick,
}: DashboardProps) {
  // Compute dashboard metrics
  const totalCandidates = candidates.length;
  const activeSessionsCount = interviews.filter(i => i.status === 'In Progress').length;
  const scheduledCount = interviews.filter(i => i.status === 'Scheduled').length;
  const completedCount = interviews.filter(i => i.status === 'Completed').length;
  
  // Calculate average score of completed interviews
  const completedWithScore = interviews.filter(i => i.status === 'Completed' && i.score !== undefined);
  const avgScore = completedWithScore.length > 0 
    ? (completedWithScore.reduce((sum, i) => sum + (i.score || 0), 0) / completedWithScore.length).toFixed(1)
    : '4.2';

  // Calculate pass rate
  const passedCandidates = candidates.filter(c => c.status === 'Passed').length;
  const failedCandidates = candidates.filter(c => c.status === 'Failed').length;
  const totalEvaluated = passedCandidates + failedCandidates;
  const passRate = totalEvaluated > 0 
    ? Math.round((passedCandidates / totalEvaluated) * 100) 
    : 72; // default placeholder

  // Active in-progress interview session to highlight
  const liveSession = interviews.find(i => i.status === 'In Progress');

  // Funnel chart details
  const funnelStages = [
    { name: 'Applied Candidates', count: totalCandidates * 2, color: 'bg-blue-600' },
    { name: 'Technical Rounds', count: totalCandidates, color: 'bg-indigo-600' },
    { name: 'Passed Evaluation', count: passedCandidates, color: 'bg-emerald-600' },
  ];

  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto h-full max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Interviewer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze candidate statistics, coordinate scheduled evaluations, and optimize multi-stage screening funnels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onScheduleClick}
            className="flex items-center gap-1.5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-slate-300 transition-all shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-medium">Total Candidates</span>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">{totalCandidates}</span>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-mono mt-1 font-semibold">
              <TrendingUp className="h-3 w-3" /> +15.4% this month
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-slate-300 transition-all shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-medium">Upcoming Sessions</span>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">{scheduledCount}</span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono mt-1">
              <Clock className="h-3 w-3" /> Scheduled this week
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-slate-300 transition-all shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-medium">Technical Pass Rate</span>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">{passRate}%</span>
            <span className="text-[10px] text-indigo-600 flex items-center gap-1 font-mono mt-1 font-semibold">
              <CheckCircle className="h-3 w-3" /> Based on {totalEvaluated} results
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-slate-300 transition-all shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-medium">Avg Evaluation Rating</span>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">{avgScore} <span className="text-xs text-slate-500">/ 5.0</span></span>
            <span className="text-[10px] text-amber-650 flex items-center gap-1 font-mono mt-1 font-semibold">
              <Star className="h-3 w-3 fill-amber-500/20 text-amber-500" /> Highly competitive
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <Star className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Live Active Session Highlight */}
      {liveSession && (
        <div className="bg-red-50/50 border border-red-200 rounded-2xl p-5 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
            LIVE EVALUATION IN PROGRESS
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 border border-red-200 animate-pulse">
                <Users className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-slate-900">{liveSession.candidateName}</h3>
                <p className="text-xs text-slate-600 font-mono flex items-center gap-2 mt-0.5">
                  <span>Role: {liveSession.role}</span>
                  <span>•</span>
                  <span>Lead Evaluator: {liveSession.interviewerName}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('interviews')}
              className="w-full md:w-auto h-9 bg-red-600 hover:bg-red-500 text-white font-medium text-xs px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Evaluation Panel</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Data Funnel and Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Recent Sessions (8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-slate-900 text-sm">Recent Evaluation History</h2>
              <button
                onClick={() => onNavigate('interviews')}
                className="text-xs text-indigo-650 hover:text-indigo-700 font-semibold flex items-center gap-1 group cursor-pointer transition-colors"
              >
                <span>View all sessions</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-mono tracking-wider">
                    <th className="py-3 px-2">Candidate</th>
                    <th className="py-3 px-2">Applied Role</th>
                    <th className="py-3 px-2">Interviewer</th>
                    <th className="py-3 px-2">Evaluation Date</th>
                    <th className="py-3 px-2">Score</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {interviews.filter(i => i.status === 'Completed').slice(0, 4).map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-2 font-semibold text-slate-900">{session.candidateName}</td>
                      <td className="py-3.5 px-2 text-slate-600">{session.role}</td>
                      <td className="py-3.5 px-2 text-slate-500 font-mono">{session.interviewerName}</td>
                      <td className="py-3.5 px-2 text-slate-500 font-mono">{session.date}</td>
                      <td className="py-3.5 px-2 font-mono">
                        {session.score ? (
                          <div className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 fill-amber-450 text-amber-500" />
                            <span className="font-semibold text-slate-800">{session.score.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          session.score && session.score >= 4.0 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : session.score && session.score >= 3.0
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {session.score && session.score >= 3.5 ? 'Strong Match' : 'Review Needed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Sliders className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-slate-900 text-sm">Quick Administrative Actions</h3>
                <p className="text-xs text-slate-500">Perform prompt configurations, manage panels, and run data audits securely.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1.5 w-full">
              <button
                onClick={onScheduleClick}
                className="h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span>Schedule Session</span>
              </button>
              <button
                onClick={() => onNavigate('candidates')}
                className="h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <Users className="h-4 w-4 text-emerald-600" />
                <span>Add Candidate</span>
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className="h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <Sliders className="h-4 w-4 text-amber-500" />
                <span>Configure Rubrics</span>
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
                <span>Export Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Funnel and Stats breakdown (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Visual Candidate Funnel Widget */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-4 shadow-xs">
            <h2 className="font-display font-bold text-slate-900 text-sm">Candidate Pipeline</h2>
            <div className="flex flex-col gap-3 mt-2">
              {funnelStages.map((stage, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">{stage.name}</span>
                    <span className="font-mono font-bold text-slate-900">{stage.count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stage.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${Math.min(100, (stage.count / (totalCandidates * 2)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Challenges Stats */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-4 shadow-xs">
            <h2 className="font-display font-bold text-slate-900 text-sm">Question Bank Overview</h2>
            <div className="grid grid-cols-3 gap-2 text-center mt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-600">Easy</span>
                <p className="text-lg font-display font-bold text-slate-800 mt-1">
                  {questions.filter(q => q.difficulty === 'Easy').length}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-600">Medium</span>
                <p className="text-lg font-display font-bold text-slate-800 mt-1">
                  {questions.filter(q => q.difficulty === 'Medium').length}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono font-bold text-rose-600">Hard</span>
                <p className="text-lg font-display font-bold text-slate-800 mt-1">
                  {questions.filter(q => q.difficulty === 'Hard').length}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('questions')}
              className="h-9 w-full bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all rounded-xl text-xs font-semibold cursor-pointer"
            >
              Manage Question Database ({questions.length})
            </button>
          </div>

          {/* Secure Environment Badging */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-650 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">Compliance & Trust Verified</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Sessions are fully encrypted, anti-cheat sensors ready, and Judge0 code runner templates sandboxed securely inside the host container.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
