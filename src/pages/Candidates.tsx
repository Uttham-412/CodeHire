import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Mail, 
  Calendar, 
  Clock, 
  Star, 
  UserPlus, 
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Candidate, CandidateStatus } from '../types';

interface CandidatesProps {
  candidates: Candidate[];
  onAddCandidate: (candidate: Omit<Candidate, 'id' | 'averageScore' | 'lastInterviewDate'>) => void;
  onDeleteCandidate: (id: string) => void;
  onUpdateCandidateStatus: (id: string, status: CandidateStatus) => void;
  onScheduleInterview: (candidate: Candidate) => void;
}

export default function Candidates({
  candidates,
  onAddCandidate,
  onDeleteCandidate,
  onUpdateCandidateStatus,
  onScheduleInterview,
}: CandidatesProps) {
  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Modals & Details State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // New Candidate Form State
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateEmail, setNewCandidateEmail] = useState('');
  const [newCandidateRole, setNewCandidateRole] = useState('Senior Frontend Engineer');
  const [newCandidateNotes, setNewCandidateNotes] = useState('');

  // Handle Add Form Submission
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateEmail) return;

    onAddCandidate({
      name: newCandidateName,
      email: newCandidateEmail,
      status: 'Pending',
      appliedRole: newCandidateRole,
      notes: newCandidateNotes || 'Added via Applicant manager.'
    });

    // Reset state & close modal
    setNewCandidateName('');
    setNewCandidateEmail('');
    setNewCandidateRole('Senior Frontend Engineer');
    setNewCandidateNotes('');
    setIsAddModalOpen(false);
  };

  // Filter candidates based on status and search query
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.appliedRole.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto h-full max-w-7xl mx-auto w-full relative">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Candidates Database</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage applicant tracking pipelines, review previous scores, and organize multi-stage evaluations.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          id="add-candidate-btn"
          className="flex items-center gap-1.5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Control panel: Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicants by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-2xs"
          />
        </div>

        {/* Status filters tab row */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-200/80 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
          {['All', 'Pending', 'Active', 'Passed', 'Failed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`h-9 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[11px] uppercase font-mono tracking-wider">
                <th className="py-4 px-5">Applicant Name</th>
                <th className="py-4 px-5">Role Applied</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Avg Tech Score</th>
                <th className="py-4 px-5">Last Assessment</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <tr 
                    key={candidate.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Name & Email */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                          {candidate.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span 
                            onClick={() => setSelectedCandidate(candidate)}
                            className="font-semibold text-slate-950 hover:text-indigo-600 hover:underline cursor-pointer transition-colors text-xs"
                          >
                            {candidate.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{candidate.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-5 text-slate-700 font-semibold">
                      {candidate.appliedRole}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                        candidate.status === 'Passed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : candidate.status === 'Failed'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : candidate.status === 'Active'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-55 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          candidate.status === 'Passed' ? 'bg-emerald-500' :
                          candidate.status === 'Failed' ? 'bg-rose-550' :
                          candidate.status === 'Active' ? 'bg-indigo-500' : 'bg-amber-500'
                        }`} />
                        {candidate.status}
                      </span>
                    </td>

                    {/* Technical Score */}
                    <td className="py-4 px-5">
                      {candidate.averageScore > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-450 text-amber-500" />
                          <span className="font-semibold text-slate-800 font-mono">{candidate.averageScore.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400 font-mono">/ 5.0</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono italic">Unevaluated</span>
                      )}
                    </td>

                    {/* Last assessment date */}
                    <td className="py-4 px-5 text-slate-500 font-mono">
                      {candidate.lastInterviewDate}
                    </td>

                    {/* Actions button */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => onScheduleInterview(candidate)}
                          className="h-7 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 hover:text-indigo-700 text-[10px] font-semibold px-2.5 rounded-md cursor-pointer transition-colors border border-indigo-100"
                        >
                          Schedule
                        </button>
                        <button
                          onClick={() => onDeleteCandidate(candidate.id)}
                          className="h-7 w-7 text-slate-400 hover:text-rose-600 flex items-center justify-center rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete applicant"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-semibold">No candidates match your filters.</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Try adjusting search strings or status tabs</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Candidate Details Drawer/Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col justify-between shadow-2xl relative">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center font-bold text-indigo-600">
                  {selectedCandidate.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <h2 className="font-display font-bold text-slate-900 text-sm">{selectedCandidate.name}</h2>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedCandidate.email}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-6">
              
              {/* Role & Status info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Applied Position</span>
                  <span className="text-slate-800 font-semibold">{selectedCandidate.appliedRole}</span>
                </div>
                <div className="h-[1px] bg-slate-200"></div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Evaluation Status</span>
                  <div className="flex items-center gap-1.5">
                    {['Pending', 'Active', 'Passed', 'Failed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => onUpdateCandidateStatus(selectedCandidate.id, status as CandidateStatus)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold transition-all cursor-pointer ${
                          selectedCandidate.status === status
                            ? status === 'Passed' ? 'bg-emerald-600 text-white' :
                              status === 'Failed' ? 'bg-rose-600 text-white' :
                              status === 'Active' ? 'bg-indigo-600 text-white' : 'bg-amber-605 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Score Ring */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white border-2 border-slate-200">
                  <Star className="h-6 w-6 text-amber-405 fill-amber-400/10 absolute opacity-10" />
                  <span className="font-mono text-sm font-bold text-slate-800 leading-none">
                    {selectedCandidate.averageScore > 0 ? selectedCandidate.averageScore.toFixed(1) : '0.0'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800">Average Interview Rating</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {selectedCandidate.averageScore >= 4.0 ? 'Exceeds team baseline standards' :
                     selectedCandidate.averageScore >= 3.0 ? 'Meets core coding baselines' :
                     selectedCandidate.averageScore > 0 ? 'Requires general secondary reviews' : 'No coding assessments evaluated yet'}
                  </p>
                </div>
              </div>

              {/* Feedback Notes */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span>Internal Evaluator Notes</span>
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-xl italic leading-relaxed">
                  "{selectedCandidate.notes}"
                </p>
              </div>

              {/* Assessment Timeline / Details */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Timeline Events</span>
                </span>
                <div className="flex flex-col gap-2 font-mono text-[10px]">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600">
                    <span>Database Record Created</span>
                    <span className="text-slate-400">2026-06-10</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600">
                    <span>Last Assessment Round</span>
                    <span className="text-slate-800 font-semibold">{selectedCandidate.lastInterviewDate}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <button
                onClick={() => {
                  onScheduleInterview(selectedCandidate);
                  setSelectedCandidate(null);
                }}
                className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule New Round</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${selectedCandidate.name}?`)) {
                    onDeleteCandidate(selectedCandidate.id);
                    setSelectedCandidate(null);
                  }
                }}
                className="h-10 w-10 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 bg-white flex items-center justify-center rounded-xl cursor-pointer transition-all shadow-2xs"
                title="Delete candidate profile"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Candidate Modal Dialog Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                <h2 className="font-display font-bold text-slate-900 text-sm">Register New Candidate</h2>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-5 flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Candidate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marie Curie"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. m.curie@science.org"
                  value={newCandidateEmail}
                  onChange={(e) => setNewCandidateEmail(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                />
              </div>

              {/* Applied Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Target Position</label>
                <select
                  value={newCandidateRole}
                  onChange={(e) => setNewCandidateRole(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                >
                  <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                  <option value="Backend Engineer II">Backend Engineer II</option>
                  <option value="Senior Infrastructure Architect">Senior Infrastructure Architect</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Staff Data Scientist">Staff Data Scientist</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                </select>
              </div>

              {/* Evaluation Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Preliminary Recruiter Notes</label>
                <textarea
                  placeholder="Initial application details, recruiter scores, or background credentials..."
                  rows={3}
                  value={newCandidateNotes}
                  onChange={(e) => setNewCandidateNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all resize-none"
                />
              </div>

              {/* Dialog Actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-10 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-650 hover:text-slate-800 text-xs font-semibold px-4 rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 rounded-xl cursor-pointer transition-all shadow-xs"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
