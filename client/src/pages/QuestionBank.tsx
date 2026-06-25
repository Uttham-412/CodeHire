import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  X, 
  Code, 
  Terminal, 
  Play, 
  CheckCircle, 
  HelpCircle,
  FileText,
  Bookmark,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Question, QuestionDifficulty, QuestionCategory } from '../types';

interface QuestionBankProps {
  questions: Question[];
  onAddQuestion: (question: Question) => void;
}

export default function QuestionBank({ questions, onAddQuestion }: QuestionBankProps) {
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Accordion details
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('q1');

  // Create Question Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<QuestionDifficulty>('Medium');
  const [newCategory, setNewCategory] = useState<QuestionCategory>('Algorithms');
  const [newDesc, setNewDesc] = useState('');
  const [newStarterJs, setNewStarterJs] = useState('');
  const [newStarterPy, setNewStarterPy] = useState('');
  const [testCaseInput1, setTestCaseInput1] = useState('');
  const [testCaseExpected1, setTestCaseExpected1] = useState('');

  // Handle Create Challenge
  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const id = `q-${Date.now()}`;
    const starterCode = {
      javascript: newStarterJs || `function solve() {\n  // Starter code here\n}`,
      python: newStarterPy || `def solve():\n  # Starter code here\n  pass`,
    };
    const testCases = [
      {
        input: testCaseInput1 || 'sample input',
        expected: testCaseExpected1 || 'expected result'
      }
    ];

    onAddQuestion({
      id,
      title: newTitle,
      difficulty: newDifficulty,
      category: newCategory,
      description: newDesc,
      starterCode,
      testCases
    });

    // Reset state & close
    setNewTitle('');
    setNewDesc('');
    setNewStarterJs('');
    setNewStarterPy('');
    setTestCaseInput1('');
    setTestCaseExpected1('');
    setIsCreateOpen(false);
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    const matchesCat = categoryFilter === 'All' || q.category === categoryFilter;
    
    return matchesSearch && matchesDiff && matchesCat;
  });

  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto h-full max-w-7xl mx-auto w-full relative">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Coding Question Bank</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse algorithm templates, maintain test specifications, or append modular coding challenges.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Challenge</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by keyword or logic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-2xs"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="md:col-span-3">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="All">All Categories</option>
            <option value="Algorithms">Algorithms</option>
            <option value="Data Structures">Data Structures</option>
            <option value="System Design">System Design</option>
            <option value="Frontend">Frontend</option>
          </select>
        </div>
      </div>

      {/* Questions Stack Accordion / Layout */}
      <div className="flex flex-col gap-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <div 
                key={q.id}
                className={`border transition-all duration-200 rounded-2xl overflow-hidden shadow-xs ${
                  isExpanded ? 'border-indigo-500 shadow-md bg-white' : 'border-slate-200 hover:border-slate-350 bg-white'
                }`}
              >
                {/* Accordion Row Header */}
                <div 
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-4.5">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Code className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {q.title}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className={`font-bold uppercase tracking-wider ${
                          q.difficulty === 'Easy' ? 'text-emerald-600' :
                          q.difficulty === 'Medium' ? 'text-indigo-650' : 'text-rose-600'
                        }`}>
                          {q.difficulty}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-semibold">{q.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline font-semibold">ID: {q.id}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Accordion Body Detail Panel */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 flex flex-col lg:flex-row gap-6 bg-slate-50/50">
                    
                    {/* Left side: Problem Description markdown */}
                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <p className="text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase mb-1">Challenge Prompt</p>
                        <div className="text-xs text-slate-700 leading-relaxed font-sans bg-white border border-slate-200 p-4 rounded-xl whitespace-pre-line shadow-2xs">
                          {q.description}
                        </div>
                      </div>

                      {/* Test cases list preview */}
                      <div>
                        <p className="text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase mb-1.5">Sample Tests</p>
                        <div className="flex flex-col gap-2">
                          {q.testCases.map((tc, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col gap-1.5 font-mono text-[10px] shadow-2xs">
                              <div className="flex items-start justify-between">
                                <span className="text-slate-500">Input: <span className="text-slate-800 font-semibold">{tc.input}</span></span>
                              </div>
                              <div className="flex items-start justify-between border-t border-slate-100 pt-1.5">
                                <span className="text-slate-500">Expected: <span className="text-emerald-600 font-bold">{tc.expected}</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side: Language preview snippets */}
                    <div className="w-full lg:w-96 shrink-0 flex flex-col gap-3">
                      <p className="text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase">Default Boilerplate Snippet</p>
                      
                      {/* Javascript Box */}
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden font-mono text-[10px] shadow-2xs">
                        <div className="bg-slate-50 px-3.5 py-1.5 border-b border-slate-200 flex items-center justify-between text-slate-500">
                          <span>JavaScript Template</span>
                          <span className="text-[9px] text-slate-400 font-semibold">ReadOnly</span>
                        </div>
                        <pre className="p-3 overflow-x-auto text-slate-700 max-h-44 text-left">
                          <code>{q.starterCode.javascript || '// No snippet'}</code>
                        </pre>
                      </div>

                      {/* Python Box if present */}
                      {q.starterCode.python && (
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden font-mono text-[10px] shadow-2xs">
                          <div className="bg-slate-50 px-3.5 py-1.5 border-b border-slate-200 flex items-center justify-between text-slate-500">
                            <span>Python Template</span>
                            <span className="text-[9px] text-slate-400 font-semibold">ReadOnly</span>
                          </div>
                          <pre className="p-3 overflow-x-auto text-slate-700 max-h-44 text-left">
                            <code>{q.starterCode.python}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No challenges found matching filters.</p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Create custom problems, or adjust searching words</p>
          </div>
        )}
      </div>

      {/* Create Challenge Modal overlay */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-indigo-600" />
                <h2 className="font-display font-bold text-slate-900 text-sm">Add Coding Challenge</h2>
              </div>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="p-5 flex flex-col gap-4 max-h-[500px] overflow-y-auto">
              
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Challenge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reverse Linked List"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                />
              </div>

              {/* Difficulty & Category Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as QuestionDifficulty)}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as QuestionCategory)}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all cursor-pointer"
                  >
                    <option value="Algorithms">Algorithms</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="System Design">System Design</option>
                    <option value="Frontend">Frontend</option>
                  </select>
                </div>
              </div>

              {/* Description Prompt */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Problem Description *</label>
                <textarea
                  required
                  placeholder="Describe constraints, input formats, edge cases, and examples in markdown..."
                  rows={4}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all resize-none font-sans"
                />
              </div>

              {/* Starter Templates */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Boilerplate code templates</label>
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-slate-500 font-semibold">JavaScript Starter Template</span>
                  <textarea
                    placeholder="function solve() { ... }"
                    rows={3}
                    value={newStarterJs}
                    onChange={(e) => setNewStarterJs(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-slate-500 font-semibold">Python Starter Template</span>
                  <textarea
                    placeholder="def solve(): ..."
                    rows={3}
                    value={newStarterPy}
                    onChange={(e) => setNewStarterPy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                  />
                </div>
              </div>

              {/* Simple Test Case Specification */}
              <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-3">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Initial Test Case Specification</label>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-slate-500">Standard Input</span>
                    <input
                      type="text"
                      placeholder="e.g. nums = [2,7], target = 9"
                      value={testCaseInput1}
                      onChange={(e) => setTestCaseInput1(e.target.value)}
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-slate-500">Expected Output</span>
                    <input
                      type="text"
                      placeholder="e.g. [0, 1]"
                      value={testCaseExpected1}
                      onChange={(e) => setTestCaseExpected1(e.target.value)}
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-550/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-10 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-semibold px-4 rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 rounded-xl cursor-pointer transition-all shadow-xs"
                >
                  Append Challenge
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
