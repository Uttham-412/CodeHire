import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, User, ShieldCheck, Key, Video, HelpCircle } from 'lucide-react';
import { InterviewSession } from '../types';
import { loginUser } from '../firebase/firebase';

interface LoginProps {
  interviews: InterviewSession[];
  onLogin: (user: { role: 'Interviewer' | 'Candidate'; email?: string; joiningId?: string }) => void;
}

export default function Login({ interviews, onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'interviewer' | 'candidate'>('interviewer');
  
  // Interviewer fields
  const [email, setEmail] = useState('uttham188@gmail.com');
  const [password, setPassword] = useState('••••••••');
  
  // Candidate fields
  const [joiningId, setJoiningId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterviewerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Sign in to Firebase Auth using centralized helper
      const userCredential = await loginUser(email, password);
      
      // 2. Retrieve Firebase ID Token
      const idToken = await userCredential.user.getIdToken();

      // 3. Request profile verification from Express backend
      const API_URL = 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify account on backend.');
      }

      const data = await response.json();

      // 4. Store token in local storage
      localStorage.setItem('interviewos_token', idToken);

      // 5. Notify parent component
      onLogin(data.user);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCandidateJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningId.trim()) {
      setErrorMsg('Please enter a valid Joining ID.');
      return;
    }

    const cleanId = joiningId.trim().toUpperCase();
    // Look up the interview session with this joining ID
    const session = interviews.find(i => i.joiningId?.toUpperCase() === cleanId || i.id === cleanId);

    if (!session) {
      setErrorMsg('No interview room found for this Joining ID. Please check the ID or contact your recruiter.');
      return;
    }

    setErrorMsg('');
    onLogin({
      role: 'Candidate',
      joiningId: session.joiningId || session.id,
    });
    navigate(`/room/${session.joiningId || session.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/10">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
              Interview<span className="text-indigo-600 font-extrabold">OS</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase font-semibold mt-1">Enterprise Screening Platform</span>
          </div>
        </div>
        <h2 className="mt-8 text-center text-xl font-display font-bold tracking-tight text-slate-900">
          Sign in to secure session portal
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          SOC-2 certified live code evaluation environment
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-200 shadow-sm rounded-2xl sm:px-10">
          
          {/* Role Tabs Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => {
                setActiveTab('interviewer');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'interviewer'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Interviewer Login</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('candidate');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'candidate'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Video className="h-4 w-4" />
              <span>Candidate Portal</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 text-rose-700 border border-rose-150 p-3 rounded-xl text-xs font-semibold leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Form Content */}
          {activeTab === 'interviewer' ? (
            <form onSubmit={handleInterviewerLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Interviewer Account Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-850 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all font-mono"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <Key className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Launch Workspace'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCandidateJoin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Interview Joining ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INT-391-482"
                  value={joiningId}
                  onChange={(e) => setJoiningId(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all placeholder:text-slate-400"
                />
                <p className="mt-1 text-[10px] text-slate-400">
                  Enter the Joining ID sent in your scheduler confirmation email.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Verify ID & Join Room</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* Quick Info Box */}
          <div className="mt-6 border-t border-slate-100 pt-5 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold text-slate-700">Protected Workspace</span>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                By entering, you consent to our anti-plagiarism screening and live video feed streaming. For practice session access, click Interviewer Login to view our mock entries.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
