import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  X, 
  ArrowUpRight, 
  CheckCircle, 
  CheckSquare, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  FileText,
  Video,
  Award,
  Sliders,
  Check,
  Copy,
  BrainCircuit,
  Code
} from 'lucide-react';
import { InterviewSession, Candidate, InterviewStatus, CandidateStatus, Question } from '../types';

interface InterviewsProps {
  interviews: InterviewSession[];
  candidates: Candidate[];
  questions: Question[];
  onAddInterview: (session: Omit<InterviewSession, 'id'>) => void;
  onDeleteInterview: (id: string) => void;
  onUpdateInterviewStatus: (id: string, status: InterviewStatus) => void;
  onCompleteSession: (sessionId: string, score: number, feedback: string, candidateStatus: CandidateStatus) => void;
  onLaunchSandbox: (session: InterviewSession) => void;
  selectedCandidateForSchedule?: Candidate | null;
  clearSelectedCandidateForSchedule?: () => void;
}

export default function Interviews({
  interviews,
  candidates,
  questions,
  onAddInterview,
  onDeleteInterview,
  onUpdateInterviewStatus,
  onCompleteSession,
  onLaunchSandbox,
  selectedCandidateForSchedule,
  clearSelectedCandidateForSchedule,
}: InterviewsProps) {
  
  // Evaluation Scorecard state
  const [evalSession, setEvalSession] = useState<InterviewSession | null>(null);
  const [finalScore, setFinalScore] = useState<number>(4.0);
  const [finalFeedback, setFinalFeedback] = useState<string>('');
  const [recommendedStatus, setRecommendedStatus] = useState<CandidateStatus>('Passed');

  // Schedule Form State
  const [isScheduleOpen, setIsScheduleOpen] = useState(!!selectedCandidateForSchedule);
  const [targetCandidateId, setTargetCandidateId] = useState(selectedCandidateForSchedule?.id || '');
  const [interviewerName, setInterviewerName] = useState('');
  const [sessionDate, setSessionDate] = useState('2026-06-25');
  const [sessionTime, setSessionTime] = useState('14:00');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionLanguage, setSessionLanguage] = useState('javascript');
  const [sessionQuestionId, setSessionQuestionId] = useState(questions[0]?.id || 'q1');
  const [sessionAptitudeId, setSessionAptitudeId] = useState('');

  // Toast / Clipboard copy status helper state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (joiningId: string) => {
    const link = `${window.location.origin}/#/room/${joiningId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(joiningId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Handle schedule trigger from candidate database
  React.useEffect(() => {
    if (selectedCandidateForSchedule) {
      setTargetCandidateId(selectedCandidateForSchedule.id);
      setIsScheduleOpen(true);
    }
  }, [selectedCandidateForSchedule]);

  // Handle Submit Schedule Form
  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCandidateId || !interviewerName || !sessionDate || !sessionTime) return;

    const candidate = candidates.find(c => c.id === targetCandidateId);
    if (!candidate) return;

    const jId = `INT-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;

    onAddInterview({
      candidateId: candidate.id,
      candidateName: candidate.name,
      interviewerName: interviewerName,
      role: candidate.appliedRole,
      date: sessionDate,
      time: sessionTime,
      status: 'Scheduled',
      notes: sessionNotes || 'Standard coding + system rounds.',
      duration: sessionDuration,
      codingQuestions: [sessionQuestionId],
      aptitudeTestId: sessionAptitudeId || undefined,
      joiningId: jId,
      interviewLink: `#/room/${jId}`
    });

    // Reset fields
    setInterviewerName('');
    setSessionNotes('');
    setSessionAptitudeId('');
    setIsScheduleOpen(false);
    if (clearSelectedCandidateForSchedule) {
      clearSelectedCandidateForSchedule();
    }
  };

  const handleCloseSchedule = () => {
    setIsScheduleOpen(false);
    if (clearSelectedCandidateForSchedule) {
      clearSelectedCandidateForSchedule();
    }
  };

  // Divide interviews by groups
  const activeInterviews = interviews.filter(i => i.status === 'In Progress');
  const upcomingInterviews = interviews.filter(i => i.status === 'Scheduled');
  const completedInterviews = interviews.filter(i => i.status === 'Completed');

  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto h-full max-w-7xl mx-auto w-full relative">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Interview Schedule</h1>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate upcoming evaluation panels, trigger live coding assessments, and log completed session reviews.
          </p>
        </div>
        <button
          onClick={() => setIsScheduleOpen(true)}
          className="flex items-center gap-1.5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Calendar className="h-4 w-4" />
          <span>Schedule Assessment</span>
        </button>
      </div>

      {/* Grid: Active & Upcoming assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Live & Upcoming (8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Active assessment */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase px-1">Live Evaluation Panels</h2>
            
            {activeInterviews.length > 0 ? (
              activeInterviews.map((session) => (
                <div 
                  key={session.id}
                  className="bg-white border-2 border-rose-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden shadow-xs"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 animate-pulse"></div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center animate-pulse">
                      <Video className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{session.candidateName}</span>
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">Live In Progress</span>
                      </div>
                      <p className="text-xs text-slate-700 font-semibold mt-1">{session.role}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Interviewer: {session.interviewerName} • Started: {session.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => onLaunchSandbox(session)}
                      className="flex-1 sm:flex-initial h-9 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all animate-pulse"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Join Room</span>
                    </button>
                    <button
                      onClick={() => {
                        setEvalSession(session);
                        setFinalScore(4.0);
                        setFinalFeedback('');
                        setRecommendedStatus('Passed');
                      }}
                      className="flex-1 sm:flex-initial h-9 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 hover:text-rose-800 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors bg-white shadow-2xs"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>Grade Session</span>
                    </button>
                    <button
                      onClick={() => {
                        handleCopyLink(session.joiningId || session.id);
                      }}
                      className="h-9 w-9 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center rounded-xl cursor-pointer transition-all bg-white shadow-2xs"
                      title="Copy Interview Link"
                    >
                      {copiedId === (session.joiningId || session.id) ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                <AlertCircle className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 font-semibold text-xs">No interviews are currently live.</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Click "Evaluate Session" on any scheduled session to begin evaluation.</p>
              </div>
            )}
          </div>

          {/* Upcoming assessments */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase px-1">Upcoming Assessment Sessions</h2>
            
            {upcomingInterviews.length > 0 ? (
              <div className="flex flex-col gap-3">
                {upcomingInterviews.map((session) => (
                  <div 
                    key={session.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{session.candidateName}</span>
                        <p className="text-xs text-slate-700 font-semibold mt-1">{session.role}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5 text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> {session.date} @ {session.time} ({session.duration || 60} mins)</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-slate-400" /> Panelist: {session.interviewerName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1"><Code className="h-3.5 w-3.5 text-slate-400" /> {session.selectedLanguage || 'javascript'}</span>
                          {session.joiningId && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-bold text-[9px] flex items-center gap-1">
                                ID: {session.joiningId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => onLaunchSandbox(session)}
                        className="flex-1 sm:flex-initial h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                      >
                        <Sliders className="h-3.5 w-3.5" />
                        <span>Launch Session</span>
                      </button>
                      <button
                        onClick={() => {
                          handleCopyLink(session.joiningId || session.id);
                        }}
                        className="h-9 w-9 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center rounded-xl cursor-pointer transition-all bg-white shadow-2xs"
                        title="Copy Interview Link"
                      >
                        {copiedId === (session.joiningId || session.id) ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteInterview(session.id)}
                        className="h-9 w-9 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center rounded-xl cursor-pointer transition-all bg-white shadow-2xs"
                        title="Delete scheduling"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
                <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold text-xs">No upcoming sessions scheduled.</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Register candidates first, then schedule interview slots.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Completed Archive (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h2 className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase px-1">Completed Session Log</h2>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto shadow-xs">
            {completedInterviews.length > 0 ? (
              completedInterviews.map((session) => (
                <div 
                  key={session.id}
                  className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl flex flex-col gap-2.5 text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{session.candidateName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{session.role}</span>
                    </div>
                    {session.score && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 font-mono font-bold px-1.5 py-0.5 rounded text-[10px]">
                        ★ {session.score.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  <div className="h-[1px] bg-slate-200"></div>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Evaluated by {session.interviewerName}</span>
                  </div>

                  {session.notes && (
                    <p className="text-[10px] text-slate-600 italic bg-white p-2 rounded border border-slate-200/80 shadow-2xs">
                      "{session.notes}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <CheckSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-semibold text-xs">No evaluation history logged yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Schedule Interview Modal Dialog Overlay */}
      {isScheduleOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-650" />
                <h2 className="font-display font-bold text-slate-900 text-sm">Schedule Evaluation Panel</h2>
              </div>
              <button 
                onClick={handleCloseSchedule}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} className="p-5 flex flex-col gap-4">
              
              {/* Select Candidate */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Target Candidate *</label>
                <select
                  required
                  value={targetCandidateId}
                  onChange={(e) => setTargetCandidateId(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                >
                  <option value="">-- Select an applicant --</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.appliedRole}) - {c.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interviewer Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Lead Interviewer *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Katherine Johnson"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Round Date *</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Slot Time *</label>
                  <input
                    type="time"
                    required
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                  />
                </div>
              </div>

              {/* Duration & Language Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Duration *</label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all cursor-pointer"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Target Language *</label>
                  <select
                    value={sessionLanguage}
                    onChange={(e) => setSessionLanguage(e.target.value)}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all cursor-pointer"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="go">GoLang</option>
                    <option value="java">Java</option>
                  </select>
                </div>
              </div>

              {/* Coding Question & Aptitude Test */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Coding Challenge *</label>
                  <select
                    value={sessionQuestionId}
                    onChange={(e) => setSessionQuestionId(e.target.value)}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all cursor-pointer"
                  >
                    {questions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title} ({q.difficulty})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Aptitude Test (Optional)</label>
                  <select
                    value={sessionAptitudeId}
                    onChange={(e) => setSessionAptitudeId(e.target.value)}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all cursor-pointer"
                  >
                    <option value="">-- No Aptitude screening --</option>
                    <option value="apt-1">Full Stack Engineering Aptitude</option>
                    <option value="apt-2">Algorithmic Logic & Complexities</option>
                    <option value="apt-3">System Design Architecture Fundamentals</option>
                    <option value="apt-4">General Quantitative Reasoning</option>
                    <option value="apt-5">Frontend React & UI Aptitude</option>
                  </select>
                </div>
              </div>

              {/* Recruiter Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Assessment Agenda / Focus</label>
                <textarea
                  placeholder="e.g. In-depth system design of high-throughput API gateway and database indexes."
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all resize-none"
                />
              </div>

              {/* Dialog Actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={handleCloseSchedule}
                  className="h-10 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-650 hover:text-slate-800 text-xs font-semibold px-4 rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 rounded-xl cursor-pointer transition-all shadow-xs"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade scorecard modal */}
      {evalSession && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                <h2 className="font-display font-bold text-slate-900 text-sm">Submit Candidate Grade & Feedback</h2>
              </div>
              <button 
                onClick={() => setEvalSession(null)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scorecard Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              onCompleteSession(evalSession.id, finalScore, finalFeedback || 'Session assessed cleanly.', recommendedStatus);
              setEvalSession(null);
            }} className="p-5 flex flex-col gap-4 text-left">
              
              {/* Candidate Info card */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">{evalSession.candidateName}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{evalSession.role}</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono bg-white border border-slate-200 px-2.5 py-1 rounded">
                  Panelist: {evalSession.interviewerName}
                </div>
              </div>

              {/* Technical Rating Slider / Number Selector */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  <span>Lead Evaluation Score</span>
                  <span className="text-amber-600 text-xs font-bold">{finalScore.toFixed(1)} / 5.0</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={finalScore}
                    onChange={(e) => setFinalScore(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="h-8 w-11 bg-slate-100 border border-slate-200 rounded font-mono text-xs text-slate-900 flex items-center justify-center font-bold">
                    {finalScore.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Status Recommendation */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Recommend Assessment Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Passed', label: 'Match (Hire)', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
                    { id: 'Failed', label: 'No Match (Reject)', color: 'border-rose-500 bg-rose-50 text-rose-700' }
                  ].map((rec) => {
                    const isSel = recommendedStatus === rec.id;
                    return (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => setRecommendedStatus(rec.id as any)}
                        className={`h-9 text-xs font-bold rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                          isSel 
                            ? rec.color + ' border-2' 
                            : 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {rec.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grading Feedback Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Evaluation Comments & Summary *</label>
                <textarea
                  required
                  placeholder="Summarize candidate communication, technical logic correctness, memory/time complexities, and overall rating detail..."
                  rows={4}
                  value={finalFeedback}
                  onChange={(e) => setFinalFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={() => setEvalSession(null)}
                  className="h-10 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-650 hover:text-slate-800 text-xs font-semibold px-4 rounded-xl cursor-pointer transition-all"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 rounded-xl cursor-pointer transition-all shadow-xs"
                >
                  Submit Scorecard
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
