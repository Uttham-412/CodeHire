import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Interviews from './pages/Interviews';
import QuestionBank from './pages/QuestionBank';
import AptitudeTests from './pages/AptitudeTests';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import CodingSandbox from './pages/CodingSandbox';
import Login from './pages/Login';
import { Candidate, InterviewSession, Question, CandidateStatus, InterviewStatus } from './types';
import { 
  initializeDatabase, 
  getCandidates, 
  saveCandidates, 
  getInterviews, 
  saveInterviews, 
  getQuestions, 
  saveQuestions 
} from './data';

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load States from local storage
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Cross-workspace pre-selection helpers
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [candidateToSchedule, setCandidateToSchedule] = useState<Candidate | null>(null);

  // Role authentication state (defaults to Interviewer for initial sandbox ease)
  const [currentUser, setCurrentUser] = useState<{ role: 'Interviewer' | 'Candidate'; email?: string; joiningId?: string } | null>(() => {
    const stored = localStorage.getItem('interviewos_current_user');
    return stored ? JSON.parse(stored) : { role: 'Interviewer', email: 'uttham188@gmail.com' };
  });

  // Determine current active sidebar tab based on pathname
  const currentTab = location.pathname.substring(1) || 'dashboard';

  useEffect(() => {
    // Bootstrap db
    initializeDatabase();
    setCandidates(getCandidates());
    setInterviews(getInterviews());
    setQuestions(getQuestions());
  }, []);

  // Sync joining ID from direct link accesses
  useEffect(() => {
    if (location.pathname.startsWith('/room/') && interviews.length > 0) {
      const parts = location.pathname.split('/');
      const jId = parts[parts.length - 1];
      if (jId && (!currentUser || currentUser.joiningId !== jId)) {
        const session = interviews.find(i => i.joiningId?.toUpperCase() === jId.toUpperCase() || i.id === jId);
        if (session) {
          const user = { role: 'Candidate' as const, joiningId: session.joiningId || session.id };
          setCurrentUser(user);
          localStorage.setItem('interviewos_current_user', JSON.stringify(user));
        }
      }
    }
  }, [location.pathname, interviews, currentUser]);

  // Update URL pathname on tab click
  const handleSetCurrentTab = (tab: string) => {
    navigate(`/${tab}`);
  };

  // State Handler: Add Candidate
  const handleAddCandidate = (newCandData: Omit<Candidate, 'id' | 'averageScore' | 'lastInterviewDate'>) => {
    const newCand: Candidate = {
      ...newCandData,
      id: `c-${Date.now()}`,
      averageScore: 0,
      lastInterviewDate: 'Pending',
    };
    const updated = [newCand, ...candidates];
    setCandidates(updated);
    saveCandidates(updated);
  };

  // State Handler: Delete Candidate
  const handleDeleteCandidate = (id: string) => {
    const updated = candidates.filter(c => c.id !== id);
    setCandidates(updated);
    saveCandidates(updated);

    // Also remove any interviews scheduled with this candidate
    const updatedInterviews = interviews.filter(i => i.candidateId !== id);
    setInterviews(updatedInterviews);
    saveInterviews(updatedInterviews);
  };

  // State Handler: Update Candidate Status
  const handleUpdateCandidateStatus = (id: string, status: CandidateStatus) => {
    const updated = candidates.map(c => {
      if (c.id === id) {
        return { ...c, status };
      }
      return c;
    });
    setCandidates(updated);
    saveCandidates(updated);
  };

  // State Handler: Add Interview Session (Scheduler)
  const handleAddInterview = (newSessionData: Omit<InterviewSession, 'id'>) => {
    const newSession: InterviewSession = {
      ...newSessionData,
      id: `i-${Date.now()}`
    };
    const updated = [newSession, ...interviews];
    setInterviews(updated);
    saveInterviews(updated);

    // Update candidate state to Active status
    const updatedCandidates = candidates.map(c => {
      if (c.id === newSessionData.candidateId) {
        return { ...c, status: 'Active' as CandidateStatus };
      }
      return c;
    });
    setCandidates(updatedCandidates);
    saveCandidates(updatedCandidates);
  };

  // State Handler: Delete Scheduled Interview
  const handleDeleteInterview = (id: string) => {
    const updated = interviews.filter(i => i.id !== id);
    setInterviews(updated);
    saveInterviews(updated);
  };

  // State Handler: Update Interview Status
  const handleUpdateInterviewStatus = (id: string, status: InterviewStatus) => {
    const updated = interviews.map(i => {
      if (i.id === id) {
        return { ...i, status };
      }
      return i;
    });
    setInterviews(updated);
    saveInterviews(updated);
  };

  // Trigger from candidate row -> opens Schedule modal inside Interviews page
  const handleRequestScheduleInterview = (candidate: Candidate) => {
    setCandidateToSchedule(candidate);
    navigate('/interviews');
  };

  // Trigger: Start Sandbox Session
  const handleLaunchSandbox = (session: InterviewSession) => {
    // Set this session to "In Progress" status
    const updatedInterviews = interviews.map(i => {
      if (i.id === session.id) {
        return { ...i, status: 'In Progress' as InterviewStatus };
      }
      return i;
    });
    setInterviews(updatedInterviews);
    saveInterviews(updatedInterviews);

    // Sync state
    const currentActiveSession = updatedInterviews.find(i => i.id === session.id) || session;
    setActiveSession(currentActiveSession);
    
    // Redirect to sandbox IDE page
    navigate('/sandbox');
  };

  // Trigger: Complete Assessment and record grades
  const handleCompleteSession = (
    sessionId: string, 
    score: number, 
    feedback: string, 
    recStatus: CandidateStatus
  ) => {
    const session = interviews.find(i => i.id === sessionId);
    if (!session) return;

    // 1. Update Interview Status to completed with logs
    const updatedInterviews = interviews.map(i => {
      if (i.id === sessionId) {
        return { 
          ...i, 
          status: 'Completed' as InterviewStatus,
          score: score,
          notes: feedback
        };
      }
      return i;
    });
    setInterviews(updatedInterviews);
    saveInterviews(updatedInterviews);

    // 2. Update Candidate profile with new scores, status and last assessed date
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedCandidates = candidates.map(c => {
      if (c.id === session.candidateId) {
        return {
          ...c,
          status: recStatus,
          averageScore: c.averageScore > 0 ? (c.averageScore + score) / 2 : score,
          lastInterviewDate: todayStr,
          notes: feedback
        };
      }
      return c;
    });
    setCandidates(updatedCandidates);
    saveCandidates(updatedCandidates);

    // 3. Clear active sandbox state
    setActiveSession(null);

    // 4. Redirect back to main dashboard
    navigate('/dashboard');
  };

  // State Handler: Append new Question to database
  const handleAddQuestion = (newQuestion: Question) => {
    const updated = [newQuestion, ...questions];
    setQuestions(updated);
    saveQuestions(updated);
  };

  const handleUpdateSessionCode = (codeSolution: string) => {
    if (!activeSession) return;
    const updated = interviews.map(i => {
      if (i.id === activeSession.id) {
        return { ...i, codeSolution };
      }
      return i;
    });
    setInterviews(updated);
    saveInterviews(updated);
    setActiveSession({ ...activeSession, codeSolution });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('interviewos_current_user');
    navigate('/login');
  };

  // 1. UNPROTECTED / UNAUTHENTICATED GATEWAY
  if (!currentUser) {
    return (
      <Login 
        interviews={interviews} 
        onLogin={(user) => {
          setCurrentUser(user);
          localStorage.setItem('interviewos_current_user', JSON.stringify(user));
          if (user.role === 'Candidate') {
            navigate(`/room/${user.joiningId}`);
          } else {
            navigate('/dashboard');
          }
        }} 
      />
    );
  }

  // 2. CANDIDATE WORKSPACE GATEWAY
  if (currentUser.role === 'Candidate') {
    const candidateSession = interviews.find(i => i.joiningId === currentUser.joiningId || i.id === currentUser.joiningId) || activeSession || interviews[0] || null;
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">i</div>
            <span className="font-display font-bold text-slate-900">Interview<span className="text-indigo-600">OS</span></span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ml-2 flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              SECURE ASSESSMENT ROUND
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-rose-600 font-bold transition-colors cursor-pointer"
          >
            Leave Secure Portal
          </button>
        </header>
        <main className="flex-1 relative overflow-hidden">
          <CodingSandbox 
            activeSession={candidateSession} 
            questions={questions} 
            onCompleteSession={handleCompleteSession}
            onUpdateSessionCode={handleUpdateSessionCode}
          />
        </main>
      </div>
    );
  }

  // 3. FULL INTERVIEWER PLATFORM
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Platform Header */}
      <Navbar onScheduleClick={() => navigate('/interviews')} onLogout={handleLogout} />

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Navigation Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={handleSetCurrentTab} />

        {/* Dynamic Workspace Panel */}
        <main className="flex-1 bg-slate-50 relative overflow-hidden">
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/login" 
              element={<Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  candidates={candidates} 
                  interviews={interviews} 
                  questions={questions}
                  onNavigate={handleSetCurrentTab}
                  onScheduleClick={() => navigate('/interviews')}
                />
              } 
            />
            <Route 
              path="/candidates" 
              element={
                <Candidates 
                  candidates={candidates}
                  onAddCandidate={handleAddCandidate}
                  onDeleteCandidate={handleDeleteCandidate}
                  onUpdateCandidateStatus={handleUpdateCandidateStatus}
                  onScheduleInterview={handleRequestScheduleInterview}
                />
              } 
            />
            <Route 
              path="/interviews" 
              element={
                <Interviews 
                  interviews={interviews}
                  candidates={candidates}
                  questions={questions}
                  onAddInterview={handleAddInterview}
                  onDeleteInterview={handleDeleteInterview}
                  onUpdateInterviewStatus={handleUpdateInterviewStatus}
                  onCompleteSession={handleCompleteSession}
                  onLaunchSandbox={handleLaunchSandbox}
                  selectedCandidateForSchedule={candidateToSchedule}
                  clearSelectedCandidateForSchedule={() => setCandidateToSchedule(null)}
                />
              } 
            />
            <Route 
              path="/questions" 
              element={
                <QuestionBank 
                  questions={questions}
                  onAddQuestion={handleAddQuestion}
                />
              } 
            />
            <Route 
              path="/aptitude" 
              element={
                <AptitudeTests />
              } 
            />
            <Route 
              path="/reports" 
              element={
                <Reports interviews={interviews} candidates={candidates} />
              } 
            />
            <Route 
              path="/sandbox" 
              element={
                <CodingSandbox 
                  activeSession={activeSession || interviews.find(i => i.status === 'In Progress') || interviews[0] || null} 
                  questions={questions}
                  onCompleteSession={handleCompleteSession}
                  onUpdateSessionCode={handleUpdateSessionCode}
                />
              } 
            />
            <Route 
              path="/room/:joiningId" 
              element={
                <CodingSandbox 
                  activeSession={activeSession || interviews.find(i => i.status === 'In Progress') || interviews[0] || null} 
                  questions={questions}
                  onCompleteSession={handleCompleteSession}
                  onUpdateSessionCode={handleUpdateSessionCode}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <Settings />
              } 
            />
            {/* Fallback route */}
            <Route 
              path="*" 
              element={<Navigate to="/dashboard" replace />} 
            />
          </Routes>
        </main>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <MainLayout />
    </HashRouter>
  );
}
