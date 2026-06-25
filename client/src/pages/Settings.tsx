import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Key,
  Bell,
  Cpu,
  Save,
  HelpCircle,
  CheckCircle,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  Slack,
  MessageSquare
} from 'lucide-react';

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Rubric state
  const [codingWeight, setCodingWeight] = useState(40);
  const [commWeight, setCommWeight] = useState(25);
  const [designWeight, setDesignWeight] = useState(20);
  const [probWeight, setProbWeight] = useState(15);

  // Email notifications
  const [emailOnSchedule, setEmailOnSchedule] = useState(true);
  const [emailOnCompleted, setEmailOnCompleted] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);

  // Mock API configuration
  const [webhookUrl, setWebhookUrl] = useState('');


  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  const totalWeight = codingWeight + commWeight + designWeight + probWeight;

  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto h-full max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sliders className="h-6 w-6 text-indigo-650" />
            <span>Workspace Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure candidate rating weightages, customize auto-scheduling triggers, and establish outbound developer notification webhooks.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-150 text-xs font-semibold px-3.5 py-2 rounded-xl">
            <CheckCircle className="h-4 w-4" />
            <span>All changes saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left column: Rubric weightings & Alerts settings - 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Section 1: Evaluation Rubric Weights */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-5 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-600" />
                <span>Interviewer Evaluation Rubric Weights</span>
              </h2>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${totalWeight === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-rose-50 text-rose-700 border border-rose-150'
                }`}>
                Total weight: {totalWeight}% {totalWeight !== 100 && '(Must equal 100%)'}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Define the percentage weightage of each scoring dimension when generating a candidate's average rating scores. These apply across all panel reviews.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">

              {/* Slider 1: Coding Proficiency */}
              <div className="flex flex-col gap-2 bg-slate-50/70 border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Coding & Code Correctness</span>
                  <span className="text-indigo-650 font-bold">{codingWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={codingWeight}
                  onChange={(e) => setCodingWeight(parseInt(e.target.value))}
                  className="accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
                />
              </div>

              {/* Slider 2: System Architecture */}
              <div className="flex flex-col gap-2 bg-slate-50/70 border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>System Design & Architecture</span>
                  <span className="text-indigo-650 font-bold">{designWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={designWeight}
                  onChange={(e) => setDesignWeight(parseInt(e.target.value))}
                  className="accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
                />
              </div>

              {/* Slider 3: Communication */}
              <div className="flex flex-col gap-2 bg-slate-50/70 border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Technical Communication</span>
                  <span className="text-indigo-650 font-bold">{commWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={commWeight}
                  onChange={(e) => setCommWeight(parseInt(e.target.value))}
                  className="accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
                />
              </div>

              {/* Slider 4: Problem Solving */}
              <div className="flex flex-col gap-2 bg-slate-50/70 border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Analytical Problem Solving</span>
                  <span className="text-indigo-650 font-bold">{probWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={probWeight}
                  onChange={(e) => setProbWeight(parseInt(e.target.value))}
                  className="accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Platform Integration & Notifications */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-5 shadow-xs">
            <h2 className="font-display font-bold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-indigo-600" />
              <span>Notification & Integration Channels</span>
            </h2>

            <div className="flex flex-col gap-4">

              <div className="flex items-start gap-4 p-3 bg-slate-50/50 border border-slate-200 rounded-xl shadow-2xs">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-750 shrink-0 border border-indigo-100">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-800">Email Notification Triggers</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-[10.5px] text-slate-650 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailOnSchedule}
                          onChange={(e) => setEmailOnSchedule(e.target.checked)}
                          className="rounded accent-indigo-600 h-3.5 w-3.5 bg-white border-slate-300"
                        />
                        On schedule
                      </label>
                      <label className="flex items-center gap-1.5 text-[10.5px] text-slate-650 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailOnCompleted}
                          onChange={(e) => setEmailOnCompleted(e.target.checked)}
                          className="rounded accent-indigo-600 h-3.5 w-3.5 bg-white border-slate-300"
                        />
                        On grade log
                      </label>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Send automated invitations, calendar calendar links, and evaluation results automatically to panelists and candidates.
                  </p>
                </div>
              </div>

              {/* Slack Webhook Integrations */}
              <div className="flex flex-col gap-3 p-4 bg-slate-50/50 border border-slate-200 rounded-xl shadow-2xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Slack className="h-4.5 w-4.5 text-amber-600" />
                    <span className="text-xs font-bold text-slate-850">Slack Notifications webhook</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-650 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slackAlerts}
                      onChange={(e) => setSlackAlerts(e.target.checked)}
                      className="rounded accent-indigo-600 h-3.5 w-3.5 bg-white border-slate-300"
                    />
                    Enable Slack Alerts
                  </label>
                </div>

                {slackAlerts && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[9px] font-mono text-slate-500">Slack incoming webhook URI:</span>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full h-9 bg-white border border-slate-200 rounded-lg px-3 text-xs text-slate-700 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
                    />
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right column: Form submit & Platform stats - 4 Columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Action Trigger Box */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900">Save Workspace Configuration</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ensure you review the rubric dimensions to equal exactly 100%. Unsaved alterations will be lost upon refreshing this session page.
            </p>

            <button
              disabled={isSaving || totalWeight !== 100}
              type="submit"
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? 'Saving parameters...' : 'Commit Workspace Settings'}</span>
            </button>
          </div>

          {/* Help Info & Badging */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
            <Shield className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">Compliance & Encryption</span>
              <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed">
                Platform conforms strictly to SOC-2 parameters. All database attributes and candidate scorecards are encrypted with standard AES-GCM-256 blocks at rest.
              </p>
            </div>
          </div>

          {/* Support Notes */}
          <div className="bg-indigo-50/30 border border-indigo-100 p-4 rounded-2xl flex flex-col gap-1 text-xs shadow-2xs">
            <span className="font-semibold text-indigo-950">Need Custom rubrics?</span>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
              Contact our product support engineering desk to inject specialized grading algorithms, live cognitive ability pipelines, or AI evaluation assists.
            </p>
          </div>

        </div>

      </form>
    </div>
  );
}
