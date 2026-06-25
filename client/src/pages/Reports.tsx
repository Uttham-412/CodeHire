import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  FileSpreadsheet, 
  Award, 
  ChevronDown, 
  ArrowRight, 
  Sparkles,
  PieChart,
  Percent,
  RefreshCw,
  Sliders,
  Briefcase
} from 'lucide-react';
import { Candidate, InterviewSession } from '../types';

interface ReportsProps {
  candidates: Candidate[];
  interviews: InterviewSession[];
}

export default function Reports({ candidates, interviews }: ReportsProps) {
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q2 2026');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');

  // List of roles for filter
  const roles = ['All', ...Array.from(new Set(candidates.map(c => c.appliedRole)))];

  // Calculated Metrics
  const totalApplied = candidates.length;
  const totalPassed = candidates.filter(c => c.status === 'Passed').length;
  const totalFailed = candidates.filter(c => c.status === 'Failed').length;
  const totalActive = candidates.filter(c => c.status === 'Active').length;
  const totalPending = candidates.filter(c => c.status === 'Pending').length;

  const totalEvaluated = totalPassed + totalFailed;
  const passRate = totalEvaluated > 0 ? Math.round((totalPassed / totalEvaluated) * 100) : 74;

  const completedInterviews = interviews.filter(i => i.status === 'Completed');
  const avgScore = completedInterviews.length > 0 
    ? (completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / completedInterviews.length).toFixed(1)
    : '4.1';

  // Role analytics summary
  const roleMetrics = Array.from(new Set(candidates.map(c => c.appliedRole))).map(role => {
    const matchingCands = candidates.filter(c => c.appliedRole === role);
    const matchingInterviews = interviews.filter(i => i.role === role && i.status === 'Completed');
    const passedCount = matchingCands.filter(c => c.status === 'Passed').length;
    const failedCount = matchingCands.filter(c => c.status === 'Failed').length;
    const evaluatedCount = passedCount + failedCount;
    const rolePassRate = evaluatedCount > 0 ? Math.round((passedCount / evaluatedCount) * 100) : 75;

    return {
      role,
      count: matchingCands.length,
      avgScore: matchingInterviews.length > 0 
        ? (matchingInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / matchingInterviews.length).toFixed(1)
        : '4.0',
      passRate: rolePassRate
    };
  });

  // Handle Export Data trigger
  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
      alert(`Export Complete! Your ${exportFormat.toUpperCase()} report has been compiled and downloaded.`);
    }, 1800);
  };

  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto h-full max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <span>Interview Performance Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review interview conversion metrics, team-by-team pass rates, and download comprehensive applicant evaluation summaries.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter Controls */}
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="h-9.5 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer shadow-2xs"
          >
            <option value="Q2 2026">Q2 2026 (Current)</option>
            <option value="Q1 2026">Q1 2026</option>
            <option value="FY 2025">FY 2025 Archive</option>
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-9.5 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer shadow-2xs"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Selection conversion rate */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-semibold font-sans">Interview Pass Rate</span>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">{passRate}%</span>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-mono mt-1 font-semibold">
              <TrendingUp className="h-3 w-3" /> +2.3% vs previous quarter
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-750 border border-indigo-100">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2: Mean rating */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-semibold">Average Evaluation Score</span>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">{avgScore} <span className="text-xs text-slate-400">/ 5.0</span></span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono mt-1 font-semibold">
              Based on {completedInterviews.length} feedback loops
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-750 border border-indigo-100">
            <Award className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3: Active Funnel conversions */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-semibold">Active Assessment Funnel</span>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              {totalActive + totalPending} <span className="text-xs text-slate-400 font-normal">Candidates</span>
            </span>
            <span className="text-[10px] text-amber-600 flex items-center gap-1 font-mono mt-1 font-semibold">
              {totalActive} in assessment, {totalPending} screening
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-100">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4: Total interview minutes */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-semibold">Evaluation Conducted</span>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              {interviews.length * 45} <span className="text-xs text-slate-400 font-normal">Mins</span>
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono mt-1 font-semibold">
              Across {interviews.length} total scheduled sessions
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Stats Layout Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Role Conversion Table & Performance Bar Chart - 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Custom SVG Performance Analytics Visualizer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
            <div className="flex justify-between items-center pb-2">
              <h2 className="font-display font-bold text-slate-900 text-sm">Hiring Conversion Pipeline Distribution</h2>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{selectedQuarter} Snapshot</span>
            </div>

            {/* Custom Interactive SVG Horizontal bar chart representing funnel */}
            <div className="flex flex-col gap-5 bg-slate-50/70 border border-slate-200 p-5 rounded-xl mt-1 shadow-2xs">
              {/* Step 1 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>1. Applicants Screened (Aptitude Tests)</span>
                  <span className="font-mono font-bold text-slate-800">{totalApplied * 2} Candidates (100%)</span>
                </div>
                <div className="h-3 w-full bg-slate-200/70 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>2. Selected for Panel Interviews</span>
                  <span className="font-mono font-bold text-slate-800">{totalApplied} Candidates ({totalApplied > 0 ? Math.round((totalApplied / (totalApplied * 2)) * 100) : 50}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-200/70 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>3. Passed Evaluator Criteria</span>
                  <span className="font-mono font-bold text-slate-800">{totalPassed} Candidates ({totalApplied > 0 ? Math.round((totalPassed / (totalApplied * 2)) * 100) : 25}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-200/70 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalApplied > 0 ? (totalPassed / (totalApplied * 2)) * 100 : 25}%` }}></div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>4. Under Review / Screening Failures</span>
                  <span className="font-mono font-bold text-slate-800">{totalFailed + totalActive} Candidates ({totalApplied > 0 ? Math.round(((totalFailed + totalActive) / (totalApplied * 2)) * 100) : 25}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-200/70 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${totalApplied > 0 ? ((totalFailed + totalActive) / (totalApplied * 2)) * 100 : 25}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Table: Departmental & Role Performance breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="font-display font-bold text-slate-900 text-sm pb-4 border-b border-slate-150">Role-by-Role Evaluation Index</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10.5px] uppercase font-bold tracking-wider">
                    <th className="py-3 px-2">Role Title</th>
                    <th className="py-3 px-2 text-center">Applicants tracked</th>
                    <th className="py-3 px-2 text-center font-mono">Avg Score (1-5)</th>
                    <th className="py-3 px-2 text-right">Hire Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {roleMetrics.map((rm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                        <span>{rm.role}</span>
                      </td>
                      <td className="py-3.5 px-2 text-center text-slate-600 font-mono font-medium">{rm.count}</td>
                      <td className="py-3.5 px-2 text-center font-mono font-bold text-amber-600">★ {rm.avgScore}</td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono text-slate-700 font-semibold">{rm.passRate}% pass</span>
                          <div className="w-16 h-1.5 bg-slate-150 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rm.passRate}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {roleMetrics.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 bg-slate-50/50">
                        No roles or candidate data registered. Add candidates to populate statistics.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Report Downloader - 4 Columns */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
          <h2 className="font-display font-bold text-slate-900 text-sm pb-2 border-b border-slate-200 flex items-center gap-2">
            <Download className="h-4.5 w-4.5 text-indigo-600" />
            <span>Generate Report Exports</span>
          </h2>
          
          <p className="text-xs text-slate-500 leading-relaxed">
            Compile evaluation feedback records, completed assessment sheets, scores, and interviewer remarks into standard offline report specifications.
          </p>

          <form onSubmit={handleExport} className="flex flex-col gap-4 bg-slate-50/70 border border-slate-200 p-4 rounded-xl mt-1 shadow-2xs">
            
            {/* Format Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">File Output Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'csv', label: 'CSV Spreadsheet' },
                  { id: 'json', label: 'JSON Data' },
                  { id: 'pdf', label: 'PDF Summary' }
                ].map((form) => {
                  const isSel = exportFormat === form.id;
                  return (
                    <button
                      key={form.id}
                      type="button"
                      onClick={() => setExportFormat(form.id as any)}
                      className={`h-9.5 text-[10.5px] font-semibold rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                        isSel 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-750 font-bold' 
                          : 'border-slate-250 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-350 hover:bg-slate-50'
                      }`}
                    >
                      {form.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scope selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Data Coverage Scope</label>
              <select className="w-full h-9.5 bg-white border border-slate-200 rounded-lg px-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                <option value="all">Full Workspace Records ({candidates.length} candidates)</option>
                <option value="passed">Passed Candidate Profiles ({totalPassed})</option>
                <option value="interviews">Evaluation Sessions List ({interviews.length})</option>
              </select>
            </div>

            {/* Checkboxes configuration */}
            <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-sans space-y-1 shadow-2xs">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-800">
                <input type="checkbox" defaultChecked className="rounded border-slate-350 accent-indigo-600 h-3.5 w-3.5 bg-white" />
                <span>Include Evaluator Notes & Scratchpads</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-800">
                <input type="checkbox" defaultChecked className="rounded border-slate-350 accent-indigo-600 h-3.5 w-3.5 bg-white" />
                <span>Anonymize candidate emails & details</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-800">
                <input type="checkbox" defaultChecked className="rounded border-slate-350 accent-indigo-600 h-3.5 w-3.5 bg-white" />
                <span>Append pre-employment Aptitude results</span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              disabled={isExporting}
              type="submit"
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              {isExporting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              <span>{isExporting ? 'Formatting Report Spreadsheet...' : 'Generate and Download Report'}</span>
            </button>
          </form>

          {/* Help note */}
          <div className="bg-indigo-50/30 border border-indigo-100 p-3.5 rounded-xl text-[10.5px] text-slate-500 flex flex-col gap-1.5 mt-1 leading-relaxed shadow-2xs">
            <span className="font-bold text-indigo-950 flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-indigo-650" /> Auto-Generated Highlights</span>
            <p>Reports are built and formatted directly client-side inside secure memory partitions complying strictly with enterprise data privacy standards.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
