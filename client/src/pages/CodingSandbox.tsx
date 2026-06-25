import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  CheckCircle, 
  Terminal, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  BookOpen, 
  Clock, 
  Send, 
  Award, 
  RefreshCw, 
  Check, 
  X, 
  Code, 
  User, 
  Activity, 
  FileText,
  Sparkles,
  Monitor,
  MonitorOff,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Star,
  Users
} from 'lucide-react';
import { InterviewSession, Question, Candidate, CandidateStatus, InterviewStatus } from '../types';

interface CodingSandboxProps {
  activeSession: InterviewSession | null;
  questions: Question[];
  onCompleteSession: (sessionId: string, score: number, feedback: string, candidateStatus: CandidateStatus) => void;
  onUpdateSessionCode?: (code: string) => void;
}

export default function CodingSandbox({
  activeSession,
  questions,
  onCompleteSession,
  onUpdateSessionCode,
}: CodingSandboxProps) {
  const navigate = useNavigate();
  
  // Simulation Role State: Let users toggle easily in the preview
  const [simulationRole, setSimulationRole] = useState<'Candidate' | 'Interviewer'>(
    activeSession?.status === 'In Progress' ? 'Interviewer' : 'Candidate'
  );

  // Candidate Pre-Flight hardware checks
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [preFlightComplete, setPreFlightComplete] = useState(false);

  // Core state synced across role simulations
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(questions[0] || null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  
  // Timer State (starts at 45 mins)
  const [timeLeft, setTimeLeft] = useState<number>(2700); 
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Video feed status toggles inside the room
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);

  // Left sidebar tab navigation
  const [sandboxTab, setSandboxTab] = useState<'prompt' | 'chat' | 'hr'>('prompt');
  
  // Chat state
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatLogs, setChatLogs] = useState<Array<{ sender: 'Candidate' | 'Interviewer'; text: string; time: string }>>([
    { sender: 'Interviewer', text: 'Hi! Welcome to your technical round. We will solve a coding problem first, followed by some architectural and HR discussion. Let me know when you are ready.', time: '14:02' },
    { sender: 'Candidate', text: 'Hello! Excited to be here. Yes, camera and mic check completed!', time: '14:03' }
  ]);

  // Editor styling & compilation output
  const [fontSize, setFontSize] = useState<number>(13);
  const [compilerOutput, setCompilerOutput] = useState<string>('// Run diagnostics to execute test cases against the sandboxed engine.\n\nReady.');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [testsPassed, setTestsPassed] = useState<boolean | null>(null);

  // Scorecard / HR evaluation states
  const [isScorecardOpen, setIsScorecardOpen] = useState<boolean>(false);
  const [technicalScore, setTechnicalScore] = useState<number>(4.0);
  const [hrNotes, setHrNotes] = useState<string>('');
  const [hrRating, setHrRating] = useState<number>(4.0);
  const [overallFeedback, setOverallFeedback] = useState<string>('');
  const [recommendedStatus, setRecommendedStatus] = useState<CandidateStatus>('Passed');

  // Load starter code or synced values on session load
  useEffect(() => {
    if (activeSession) {
      const q = questions.find(item => 
        activeSession.notes?.toLowerCase().includes(item.title.toLowerCase()) ||
        activeSession.codingQuestions?.includes(item.id)
      ) || questions[0];
      
      if (q) {
        setSelectedQuestion(q);
      }
      
      if (activeSession.selectedLanguage) {
        setSelectedLanguage(activeSession.selectedLanguage);
      }

      if (activeSession.codeSolution) {
        setCode(activeSession.codeSolution);
      } else if (q) {
        setCode(q.starterCode[activeSession.selectedLanguage || 'javascript'] || '');
      }
    } else {
      setSelectedLanguage('javascript');
      if (questions[0]) {
        setSelectedQuestion(questions[0]);
        setCode(questions[0].starterCode.javascript || '');
      }
    }
  }, [activeSession, questions]);

  // Sync editor changes with the parent active session code solution for absolute "real-time" accuracy
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (onUpdateSessionCode) {
      onUpdateSessionCode(newCode);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (selectedQuestion) {
      const starter = selectedQuestion.starterCode[lang] || '';
      handleCodeChange(starter);
    }
    setCompilerOutput(`// Language changed to ${lang.toUpperCase()}. Editor buffer reset.`);
    setTestsPassed(null);
  };

  const handleQuestionChange = (questionId: string) => {
    const q = questions.find(item => item.id === questionId);
    if (q) {
      setSelectedQuestion(q);
      const starter = q.starterCode[selectedLanguage] || '';
      handleCodeChange(starter);
      setCompilerOutput(`// Loaded problem: "${q.title}". Playground refreshed.`);
      setTestsPassed(null);
    }
  };

  // Timer Tick implementation
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Chat message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setChatLogs(prev => [
      ...prev,
      { sender: simulationRole, text: chatMessage, time: timeStr }
    ]);
    setChatMessage('');

    // Simulate an answer when Candidate types
    if (simulationRole === 'Candidate') {
      setTimeout(() => {
        setChatLogs(prev => [
          ...prev,
          { sender: 'Interviewer', text: 'I am reviewing your code logic in real-time. Make sure to consider edge cases like empty inputs.', time: timeStr }
        ]);
      }, 2000);
    }
  };

  // Code compiler simulation
  const handleRunCode = () => {
    setIsCompiling(true);
    setCompilerOutput('Compiling code buffers...\nParsing imports...\nRunning units tests on sandboxed container...\n');
    setTestsPassed(null);

    setTimeout(() => {
      setIsCompiling(false);
      const passes = code.trim().length > 35 && !code.includes('// Starter code here');
      
      if (passes) {
        setCompilerOutput(
          `> Sandbox Compiler execution complete.\n` +
          `[✓] Unit Test 1: MATCH (input: "${selectedQuestion.testCases[0]?.input || 'default'}")\n` +
          `[✓] Unit Test 2: MATCH\n` +
          `[✓] Unit Test 3: MATCH\n\n` +
          `STATUS: SUCCESS\n` +
          `Complexity analysis: O(n) time, O(n) space.\n` +
          `Peak memory: 12.4 MB.`
        );
        setTestsPassed(true);
      } else {
        setCompilerOutput(
          `> Sandbox Compiler execution complete.\n` +
          `[✗] Unit Test 1: FAIL (expected: ${selectedQuestion.testCases[0]?.expected || 'matching value'})\n` +
          `[!] Warning: Code matches starter signature or is too short. Please rewrite logic.\n\n` +
          `STATUS: TERMINATED_WITH_ERRORS\n` +
          `Tests run: 3 | Passed: 0 | Failed: 3`
        );
        setTestsPassed(false);
      }
    }, 1200);
  };

  // Finish assessment submit
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;

    // Combine Technical score, HR evaluation, and feedback notes
    const combinedFeedback = `[Technical Evaluation: ${technicalScore}/5.0] [HR Assessment Score: ${hrRating}/5.0] ${overallFeedback || 'Completed rounds successfully.'} HR notes: ${hrNotes || 'No notes.'}`;
    
    onCompleteSession(
      activeSession.id, 
      parseFloat(((technicalScore + hrRating) / 2).toFixed(1)), 
      combinedFeedback, 
      recommendedStatus
    );
    setIsScorecardOpen(false);
  };

  // Pre-flight validation gate
  if (simulationRole === 'Candidate' && !preFlightComplete) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Pre-flight Header */}
          <div className="bg-indigo-600 px-6 py-6 text-white text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <Sliders className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-200">Candidate Hardware Audit</span>
                <h2 className="font-display text-lg font-bold tracking-tight">Pre-Flight Screen Check</h2>
              </div>
            </div>
            <p className="text-xs text-indigo-150 mt-2 leading-relaxed">
              SOC-2 enterprise policy requires verifying your media systems. Please trigger the hardware simulator toggles below before joining {activeSession?.candidateName || 'your'} live room.
            </p>
          </div>

          {/* Pre-flight body checks */}
          <div className="p-6 flex flex-col gap-5 text-left">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Device Approvals</span>
            
            <div className="flex flex-col gap-3">
              {/* Camera Approval */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center border ${cameraEnabled ? 'bg-emerald-50 text-emerald-600 border-emerald-150' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    <Video className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Enable Camera Feed</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Stream live high-contrast webcam streams to panelist</span>
                  </div>
                </div>
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`h-7.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${cameraEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                >
                  {cameraEnabled ? 'Simulated Active' : 'Enable Feed'}
                </button>
              </div>

              {/* Microphone Approval */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center border ${micEnabled ? 'bg-emerald-50 text-emerald-600 border-emerald-150' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    <Mic className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Verify Microphone Audio</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Test noise-isolation registers and sound thresholds</span>
                  </div>
                </div>
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`h-7.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${micEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                >
                  {micEnabled ? 'Simulated Active' : 'Enable Audio'}
                </button>
              </div>

              {/* Screen Share Approval */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center border ${screenShareEnabled ? 'bg-emerald-50 text-emerald-600 border-emerald-150' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Authorize Desktop Screen Share</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Expose target application workspace inside code review</span>
                  </div>
                </div>
                <button
                  onClick={() => setScreenShareEnabled(!screenShareEnabled)}
                  className={`h-7.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${screenShareEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                >
                  {screenShareEnabled ? 'Simulated Active' : 'Enable Stream'}
                </button>
              </div>
            </div>

            {/* Error disclaimer if not loaded */}
            {!cameraEnabled || !micEnabled || !screenShareEnabled ? (
              <div className="bg-amber-50 text-amber-800 border border-amber-150 p-3 rounded-xl text-[10.5px] leading-relaxed font-sans font-medium">
                🔒 All authorization flags must be activated prior to gateway opening to keep the testing environment secure and consistent.
              </div>
            ) : (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-150 p-3 rounded-xl text-[10.5px] leading-relaxed font-sans font-medium flex items-center gap-1.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span>Diagnostics verified! You are completely ready to join the assessment room.</span>
              </div>
            )}

            {/* Form actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => navigate('/dashboard')}
                className="h-10 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => setPreFlightComplete(true)}
                disabled={!cameraEnabled || !micEnabled || !screenShareEnabled}
                className={`h-10 text-xs font-bold px-6 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                  cameraEnabled && micEnabled && screenShareEnabled
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <span>Enter Interview Room</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 font-sans relative">
      
      {/* Simulation Bar (Top) */}
      <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shrink-0 text-xs text-amber-900">
        <span className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
          Simulation Control: Switch views below to test both candidate typing and interviewer panelist grading.
        </span>
        <div className="flex bg-amber-150/60 p-0.5 rounded-lg border border-amber-200/60 self-stretch sm:self-auto justify-center">
          <button 
            onClick={() => setSimulationRole('Candidate')}
            className={`px-3 py-1 font-bold rounded-md text-[10px] transition-all cursor-pointer ${simulationRole === 'Candidate' ? 'bg-white text-amber-950 shadow-xs' : 'text-amber-700 hover:text-amber-900'}`}
          >
            💻 Candidate View
          </button>
          <button 
            onClick={() => setSimulationRole('Interviewer')}
            className={`px-3 py-1 font-bold rounded-md text-[10px] transition-all cursor-pointer ${simulationRole === 'Interviewer' ? 'bg-white text-amber-950 shadow-xs' : 'text-amber-700 hover:text-amber-900'}`}
          >
            🔍 Interviewer View
          </button>
        </div>
      </div>

      {/* 1. IDE TOP BAR PANEL */}
      <div className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0">
        
        {/* Candidate Info */}
        <div className="flex items-center gap-3 text-left">
          <div className="h-8.5 w-8.5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 leading-none">
              {activeSession ? activeSession.candidateName : 'Jane Doe'}
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            </span>
            <span className="text-[10px] text-slate-500 mt-1 font-semibold">
              {activeSession ? activeSession.role : 'Senior Software Engineer'}
            </span>
          </div>
        </div>

        {/* Challenge Selection Dropdown */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-slate-450 font-mono hidden md:inline uppercase tracking-wider font-bold">Topic:</span>
          <select
            value={selectedQuestion?.id || ''}
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-[11px] text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium cursor-pointer"
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>{q.title} ({q.difficulty})</option>
            ))}
          </select>
        </div>

        {/* Language Selection */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-450 font-mono hidden md:inline uppercase tracking-wider font-bold">Compiler:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-[11px] text-slate-850 font-mono focus:outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">GoLang</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Chronometer Timer */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 h-8 px-3 rounded-lg">
          <Clock className="h-3.5 w-3.5 text-indigo-600" />
          <span className="font-mono text-xs text-slate-800 font-bold">{formatTime(timeLeft)}</span>
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="text-[9px] font-mono font-bold uppercase tracking-wide text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {isTimerRunning ? 'Pause' : 'Play'}
          </button>
        </div>

        {/* Live Action evaluations (Interviewer exclusive, or shown during simulation) */}
        <div className="flex items-center gap-2">
          {simulationRole === 'Interviewer' && activeSession ? (
            <button
              onClick={() => setIsScorecardOpen(true)}
              id="submit-eval-btn"
              className="h-8.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Award className="h-3.5 w-3.5" />
              <span>Grade Scorecard</span>
            </button>
          ) : (
            <div className="text-[10px] text-slate-400 font-mono border border-slate-200 px-2.5 py-1 rounded-lg bg-slate-50 font-semibold uppercase tracking-wider">
              {simulationRole} Mode
            </div>
          )}
        </div>

      </div>

      {/* 2. MAIN SPLIT EDITOR VIEWPORT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT WORKSPACE PANELS (Question details / WebRTC Chat / HR Panel) */}
        <div className="w-80 md:w-96 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0">
          
          {/* Workspace subtabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
            <button
              onClick={() => setSandboxTab('prompt')}
              className={`flex-1 h-10.5 flex items-center justify-center gap-1.5 text-[10px] font-bold border-b-2 transition-all cursor-pointer ${
                sandboxTab === 'prompt'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Problem</span>
            </button>
            <button
              onClick={() => setSandboxTab('chat')}
              className={`flex-1 h-10.5 flex items-center justify-center gap-1.5 text-[10px] font-bold border-b-2 transition-all cursor-pointer ${
                sandboxTab === 'chat'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Live Chat</span>
            </button>
            <button
              onClick={() => setSandboxTab('hr')}
              className={`flex-1 h-10.5 flex items-center justify-center gap-1.5 text-[10px] font-bold border-b-2 transition-all cursor-pointer ${
                sandboxTab === 'hr'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              {simulationRole === 'Interviewer' ? <Sliders className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
              <span>{simulationRole === 'Interviewer' ? 'HR Eval Round' : 'Pre-flight'}</span>
            </button>
          </div>

          {/* Tab Body Viewports */}
          <div className="flex-1 p-4 overflow-y-auto text-left">
            
            {/* PROBLEM TAB */}
            {sandboxTab === 'prompt' && selectedQuestion && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{selectedQuestion.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                    selectedQuestion.difficulty === 'Easy' ? 'bg-emerald-55 text-emerald-700 border-emerald-200' :
                    selectedQuestion.difficulty === 'Medium' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {selectedQuestion.difficulty}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 leading-relaxed font-sans bg-slate-50 border border-slate-200 p-3.5 rounded-xl whitespace-pre-line">
                  {selectedQuestion.description}
                </div>

                {/* Constraints */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Test Constraints</span>
                  <ul className="text-[10px] text-slate-500 list-disc list-inside space-y-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/60">
                    <li>`nums.length` is bounded securely [2, 1000]</li>
                    <li>Value integers fit standard signed 32-bit registers</li>
                    <li>Time limit allocation maximum: 2000ms</li>
                  </ul>
                </div>

                {/* Live WebRTC Camera feeds */}
                <div className="mt-4 border-t border-slate-200 pt-4 flex flex-col gap-2.5">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Live AV Streams</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* Interviewer stream */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 relative h-24 flex flex-col items-center justify-center">
                      {isVideoOff ? (
                        <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                          <VideoOff className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold">AL</div>
                          <span className="text-[9px] text-slate-700 font-bold mt-1">Sarah (Interviewer)</span>
                        </div>
                      )}
                      
                      <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5">
                        {isMuted ? (
                          <MicOff className="h-3 w-3 text-rose-600" />
                        ) : (
                          <div className="flex items-end gap-0.5 h-2 w-3 shrink-0">
                            <span className="w-0.5 h-1 bg-emerald-500 animate-pulse"></span>
                            <span className="w-0.5 h-2.5 bg-emerald-500 animate-pulse"></span>
                            <span className="w-0.5 h-0.5 bg-emerald-500 animate-pulse"></span>
                          </div>
                        )}
                        <span className="text-[8px] text-slate-400 font-mono font-semibold">You</span>
                      </div>

                      {/* WebRTC simulation toggles */}
                      <div className="absolute top-1 right-1 flex gap-1">
                        <button 
                          onClick={() => setIsMuted(!isMuted)}
                          className={`p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-450 cursor-pointer ${isMuted ? 'text-rose-600 border-rose-200 bg-rose-50' : ''}`}
                        >
                          {isMuted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                        </button>
                        <button 
                          onClick={() => setIsVideoOff(!isVideoOff)}
                          className={`p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-450 cursor-pointer ${isVideoOff ? 'text-rose-600 border-rose-200 bg-rose-50' : ''}`}
                        >
                          {isVideoOff ? <VideoOff className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Candidate Stream */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 relative h-24 flex flex-col items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                          {activeSession ? activeSession.candidateName.substring(0, 2).toUpperCase() : 'JD'}
                        </div>
                        <span className="text-[9px] text-slate-700 font-bold mt-1">{activeSession ? activeSession.candidateName.split(' ')[0] : 'Candidate'}</span>
                      </div>

                      <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5">
                        <div className="flex items-end gap-0.5 h-2 w-3 shrink-0">
                          <span className="w-0.5 h-2 bg-emerald-500 animate-pulse delay-75"></span>
                          <span className="w-0.5 h-0.5 bg-emerald-500 animate-pulse delay-100"></span>
                          <span className="w-0.5 h-1.5 bg-emerald-500 animate-pulse delay-150"></span>
                        </div>
                        <span className="text-[8px] text-slate-400 font-mono font-semibold">Feed</span>
                      </div>
                    </div>
                  </div>

                  {/* Shared Screen mockup (Interviewer visual) */}
                  {simulationRole === 'Interviewer' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-1">
                          <Monitor className="h-3.5 w-3.5" /> Live Shared Desktop Stream
                        </span>
                        <span className="text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold px-1 rounded uppercase">Active</span>
                      </div>
                      <div className="h-16 bg-slate-900 rounded-lg flex items-center justify-center text-[10px] text-slate-300 font-mono border border-slate-800">
                        🖥️ {activeSession ? activeSession.candidateName.split(' ')[0] : 'Candidate'}'s Browser Tab
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* CHAT TAB */}
            {sandboxTab === 'chat' && (
              <div className="flex flex-col justify-between h-full max-h-[460px]">
                <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto mb-3 pr-1">
                  {chatLogs.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col gap-1 max-w-[85%] text-[10.5px] p-2.5 rounded-xl ${
                        msg.sender === simulationRole
                          ? 'bg-indigo-50 border border-indigo-100 self-end text-slate-900'
                          : 'bg-slate-50 border border-slate-200 self-start text-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[8px] font-mono font-bold uppercase text-slate-450 gap-4 mb-0.5">
                        <span>{msg.sender === simulationRole ? 'You' : msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-200 pt-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  />
                  <button 
                    type="submit"
                    className="h-9 w-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors active:scale-95 shadow-2xs"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}

            {/* HR ROUND / PRE-FLIGHT TAB */}
            {sandboxTab === 'hr' && (
              simulationRole === 'Interviewer' ? (
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-indigo-600" />
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Live HR Interview Round</span>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Once the coding evaluation completes, proceed directly to testing corporate alignment, culture fit, and soft skills in the same room. Record values below.
                  </p>

                  {/* HR Notes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">HR Assessment Notes</label>
                    <textarea
                      placeholder="e.g., Demonstrated excellent communication, aligned heavily with team agility directives, salary expectations matched."
                      rows={4}
                      value={hrNotes}
                      onChange={(e) => setHrNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>

                  {/* HR Score Selection */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      <span>HR Round Rating</span>
                      <span className="text-indigo-600 font-bold">{hrRating.toFixed(1)} / 5.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={hrRating}
                        onChange={(e) => setHrRating(parseFloat(e.target.value))}
                        className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="h-7 w-10 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-800 flex items-center justify-center font-bold shadow-2xs">
                        {hrRating.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action button */}
                  {activeSession ? (
                    <button
                      onClick={() => setIsScorecardOpen(true)}
                      className="w-full h-9.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all mt-1"
                    >
                      <Award className="h-4 w-4" />
                      <span>Submit Complete Evaluation</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic text-center">Schedule an interview to record live scores.</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Approved Pre-flight Toggles</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2.5 text-[10.5px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Secure Frame Camera Feed: <span className="font-bold text-emerald-700">Active</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Audio Input Verification: <span className="font-bold text-emerald-700">Active</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Desktop Shared Stream: <span className="font-bold text-emerald-700">Active</span></span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                    Your hardware credentials and screen share authorizations were validated successfully on system access. Stream parameters are fully compliant with corporate anti-plagiarism policies.
                  </p>
                </div>
              )
            )}

          </div>

          {/* Quick status bar */}
          <div className="h-8 border-t border-slate-200 bg-slate-50 px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0 font-medium">
            <span className="flex items-center gap-1 text-slate-550"><Activity className="h-3.5 w-3.5 text-indigo-500" /> AV Connection Quality</span>
            <span className="text-emerald-600 font-bold">12ms (Excellent)</span>
          </div>
        </div>

        {/* RIGHT CODE EDITOR & CONSOLE TERMINAL */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* EDITOR SECTION */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            
            {/* Editor Tab Header */}
            <div className="h-9 border-b border-slate-200 bg-slate-50 px-4 flex items-center justify-between text-[10.5px] text-slate-500 shrink-0">
              <span className="font-mono text-slate-500 flex items-center gap-1.5 font-bold uppercase tracking-wide">
                <Code className="h-3.5 w-3.5 text-indigo-600" /> main_solution.{selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'go' ? 'go' : 'java'}
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setFontSize(Math.max(11, fontSize - 1))}
                  className="hover:text-indigo-600 cursor-pointer px-1.5 font-bold"
                  title="Zoom Out"
                >
                  A-
                </button>
                <button 
                  onClick={() => setFontSize(Math.min(18, fontSize + 1))}
                  className="hover:text-indigo-600 cursor-pointer px-1.5 font-bold"
                  title="Zoom In"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Code editor textarea */}
            <div className="flex-1 flex overflow-y-auto bg-white font-mono">
              {/* Line Numbers */}
              <div className="w-11 text-right select-none pr-3 text-slate-400 pt-3 border-r border-slate-100 bg-slate-50/50 leading-relaxed text-[11px] font-medium">
                {code.split('\n').map((_, index) => (
                  <div key={index} className="h-5">{index + 1}</div>
                ))}
              </div>
              
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                style={{ fontSize: `${fontSize}px` }}
                className="flex-1 p-3 bg-transparent text-slate-800 outline-none resize-none overflow-x-auto leading-relaxed border-none focus:ring-0 focus:outline-none focus:bg-slate-50/25 font-mono"
                placeholder="// Write your candidate solution here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* SPLIT HORIZONTAL CONTAINER BAR */}
          <div className="h-[1px] bg-slate-200 shrink-0"></div>

          {/* COMPILER CONSOLE OUTPUT SECTION (Dark themed for ultimate terminal style) */}
          <div className="h-48 border-t border-slate-200 bg-slate-900 flex flex-col justify-between shrink-0 min-h-0 relative shadow-inner">
            {/* Console header */}
            <div className="h-8.5 bg-slate-950 px-4 flex items-center justify-between text-[10px] font-mono text-slate-450 shrink-0 uppercase tracking-wider font-bold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Terminal className="h-3.5 w-3.5 text-emerald-500" /> Output Terminal & Tests
              </span>
              
              <div className="flex items-center gap-2">
                {testsPassed === true && (
                  <span className="text-emerald-400 font-extrabold flex items-center gap-1 text-[9px] mr-1"><Check className="h-3 w-3" /> UNITS_PASSED</span>
                )}
                {testsPassed === false && (
                  <span className="text-rose-400 font-extrabold flex items-center gap-1 text-[9px] mr-1"><X className="h-3 w-3" /> UNITS_FAILED</span>
                )}
                <button
                  disabled={isCompiling}
                  onClick={handleRunCode}
                  id="run-tests-btn"
                  className="h-6 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 rounded text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {isCompiling ? (
                    <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
                  ) : (
                    <Play className="h-3 w-3 text-emerald-400 fill-emerald-400/20" />
                  )}
                  <span>{isCompiling ? 'Running...' : 'Execute Unit Tests'}</span>
                </button>
              </div>
            </div>

            {/* Terminal screen */}
            <pre className="flex-1 p-4 overflow-y-auto text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-text bg-slate-950 text-left">
              <code>{compilerOutput}</code>
            </pre>
          </div>

        </div>

      </div>

      {/* 3. SUBMIT SCORECARD EVALUATION OVERLAY DIALOG */}
      {isScorecardOpen && activeSession && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl relative overflow-hidden text-left">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                <h2 className="font-display font-bold text-slate-900 text-sm">Submit Candidate Grade & Feedback</h2>
              </div>
              <button 
                onClick={() => setIsScorecardOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scorecard Form */}
            <form onSubmit={handleSaveEvaluation} className="p-5 flex flex-col gap-4 text-left">
              
              {/* Candidate info card */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">{activeSession.candidateName}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{activeSession.role}</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono bg-white border border-slate-200 px-2.5 py-1 rounded">
                  Panelist: {activeSession.interviewerName}
                </div>
              </div>

              {/* Slider for Technical Score */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  <span>Technical Evaluation Score</span>
                  <span className="text-indigo-600 text-xs font-bold">{technicalScore.toFixed(1)} / 5.0</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={technicalScore}
                    onChange={(e) => setTechnicalScore(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="h-8 w-11 bg-slate-100 border border-slate-200 rounded font-mono text-xs text-slate-900 flex items-center justify-center font-bold">
                    {technicalScore.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Slider for HR Rating */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  <span>HR Round Evaluation</span>
                  <span className="text-indigo-600 text-xs font-bold">{hrRating.toFixed(1)} / 5.0</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={hrRating}
                    onChange={(e) => setHrRating(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="h-8 w-11 bg-slate-100 border border-slate-200 rounded font-mono text-xs text-slate-900 flex items-center justify-center font-bold">
                    {hrRating.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Recommendation Choice */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Overall Hiring Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Passed', label: 'Strong Match (Hire)', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
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

              {/* Complete Feedback Details */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Evaluation Comments & Summary *</label>
                <textarea
                  required
                  placeholder="Record summary details about algorithm design correctness, complexities, soft skills performance..."
                  rows={3}
                  value={overallFeedback}
                  onChange={(e) => setOverallFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-555/10 transition-all resize-none"
                />
              </div>

              {/* Modal actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={() => setIsScorecardOpen(false)}
                  className="h-10 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-650 hover:text-slate-800 text-xs font-semibold px-4 rounded-xl cursor-pointer transition-all"
                >
                  Cancel
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
