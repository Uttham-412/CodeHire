import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Plus, 
  Users, 
  Clock, 
  BarChart, 
  ChevronRight, 
  CheckSquare, 
  BookOpen, 
  Award,
  TrendingUp,
  BrainCircuit,
  Settings,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TestTemplate {
  id: string;
  title: string;
  category: string;
  duration: number; // minutes
  questionsCount: number;
  candidatesCount: number;
  averageScore: number; // percentage
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

export default function AptitudeTests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<TestTemplate | null>(null);

  const [templates, setTemplates] = useState<TestTemplate[]>([
    {
      id: 'apt-1',
      title: 'Full Stack Engineering Aptitude',
      category: 'Software Engineering',
      duration: 60,
      questionsCount: 40,
      candidatesCount: 148,
      averageScore: 74,
      difficulty: 'Intermediate'
    },
    {
      id: 'apt-2',
      title: 'Algorithmic Logic & Complexities',
      category: 'Computer Science Core',
      duration: 45,
      questionsCount: 25,
      candidatesCount: 92,
      averageScore: 68,
      difficulty: 'Advanced'
    },
    {
      id: 'apt-3',
      title: 'System Design Architecture Fundamentals',
      category: 'Architecture',
      duration: 90,
      questionsCount: 30,
      candidatesCount: 61,
      averageScore: 71,
      difficulty: 'Advanced'
    },
    {
      id: 'apt-4',
      title: 'General Quantitative & Analytical Reasoning',
      category: 'Cognitive Ability',
      duration: 30,
      questionsCount: 20,
      candidatesCount: 310,
      averageScore: 82,
      difficulty: 'Basic'
    },
    {
      id: 'apt-5',
      title: 'Frontend React & UI Aptitude',
      category: 'Web Development',
      duration: 40,
      questionsCount: 30,
      candidatesCount: 115,
      averageScore: 79,
      difficulty: 'Intermediate'
    }
  ]);

  const [questionsPreview] = useState([
    {
      id: 'q-1',
      question: 'Which of the following describes the average-case time complexity of looking up a value in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      answer: 'O(log n)'
    },
    {
      id: 'q-2',
      question: 'In a microservices architecture, what pattern is commonly applied to prevent a cascading failure across multiple services when one downstream service becomes slow or unresponsive?',
      options: ['Circuit Breaker', 'Saga Pattern', 'CQRS', 'API Gateway Proxy'],
      answer: 'Circuit Breaker'
    },
    {
      id: 'q-3',
      question: 'A queue is implemented with two stacks. If we push 5 elements onto the queue and then pop 3 elements, what is the minimum number of stack operations required?',
      options: ['5 operations', '8 operations', '11 operations', '13 operations'],
      answer: '13 operations'
    }
  ]);

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || t.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  const handleCreateTemplate = () => {
    const title = prompt('Enter the title for the new Aptitude Test:');
    if (!title) return;
    const category = prompt('Enter the category:', 'Engineering');
    if (!category) return;

    const newTest: TestTemplate = {
      id: `apt-${Date.now()}`,
      title,
      category,
      duration: 45,
      questionsCount: 20,
      candidatesCount: 0,
      averageScore: 0,
      difficulty: 'Intermediate'
    };

    setTemplates([newTest, ...templates]);
  };

  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto h-full max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-indigo-600" />
            <span>Pre-Employment Aptitude Tests</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated screening tests, measure logical reasoning, and review candidate completion statistics before booking human evaluations.
          </p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="flex items-center gap-1.5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Assessment Template</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Active Screening Tests</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{templates.length}</p>
            <p className="text-[10px] text-slate-400 mt-1">Covering algorithm core, system architecture, and UI tools.</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-650 border border-indigo-100">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Total Test Takers</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {templates.reduce((sum, t) => sum + t.candidatesCount, 0)} Candidates
            </p>
            <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="h-3 w-3" /> +28% growth month-over-month
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Mean Passing Score</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">74.2%</p>
            <p className="text-[10px] text-slate-400 mt-1">Using weighted metrics grading.</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-100">
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates list - 7 columns */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-display font-bold text-slate-900 text-sm">Assessment Templates</h2>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-7.5 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
                />
              </div>

              {/* Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="h-7.5 bg-slate-50 border border-slate-200 rounded-lg px-2 text-[11px] text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer shadow-2xs"
              >
                <option value="All">All Levels</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`border p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50/20 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/30'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono font-bold text-indigo-650 uppercase tracking-wide">
                        {template.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-0.5">{template.title}</h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 font-mono mt-2">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-slate-400" /> {template.duration} mins</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-slate-400" /> {template.questionsCount} Multiple Choice / Code Snip Questions</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3 text-slate-400" /> {template.candidatesCount} Tested</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        template.difficulty === 'Basic' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                        template.difficulty === 'Intermediate' ? 'bg-indigo-50 text-indigo-700 border border-indigo-150' :
                        'bg-rose-50 text-rose-700 border border-rose-150'
                      }`}>
                        {template.difficulty}
                      </span>
                      {template.candidatesCount > 0 && (
                        <span className="text-[10px] font-mono text-slate-400 mt-2">
                          Avg: <span className="text-slate-800 font-bold">{template.averageScore}%</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTemplates.length === 0 && (
              <div className="py-12 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs bg-slate-50/50">
                No templates match your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Selected template / Preview column - 5 columns */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
          {selectedTemplate ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-indigo-650 font-semibold uppercase">{selectedTemplate.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedTemplate.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="text-[10px] font-mono text-slate-400 hover:text-slate-700 transition-colors"
                >
                  Clear Preview
                </button>
              </div>

              {/* Template quick details */}
              <div className="bg-slate-50/70 border border-slate-200 p-3.5 rounded-xl grid grid-cols-2 gap-3 text-xs shadow-2xs">
                <div>
                  <span className="text-slate-500 text-[10px] font-semibold">Test Duration</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTemplate.duration} Minutes</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-semibold">Evaluation Level</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTemplate.difficulty}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-semibold">Completion Average</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{selectedTemplate.candidatesCount > 0 ? `${selectedTemplate.averageScore}%` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-semibold">Unique Questions</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTemplate.questionsCount} items</p>
                </div>
              </div>

              {/* Sample Questions Preview list */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Sample Screening Questions</span>
                </span>

                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {questionsPreview.map((qp, index) => (
                    <div key={qp.id} className="bg-slate-50/50 border border-slate-200 p-3 rounded-lg text-xs flex flex-col gap-2">
                      <p className="font-semibold text-slate-800">Q{index + 1}: {qp.question}</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {qp.options.map((opt) => {
                          const isAnswer = opt === qp.answer;
                          return (
                            <span 
                              key={opt} 
                              className={`p-1.5 rounded text-[10px] font-mono text-center border ${
                                isAnswer 
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-750 font-bold' 
                                  : 'bg-white border-slate-150 text-slate-600'
                              }`}
                            >
                              {opt}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => alert(`Aptitude invite link has been generated & ready to email to applicants.`)}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer mt-2"
              >
                <span>Invite Candidate to Test</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
              <FileCheck className="h-10 w-10 text-slate-300" />
              <p className="text-slate-500 font-bold text-xs mt-1">Template Preview Canvas</p>
              <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed mt-1">
                Select an aptitude test template from the left list to inspect duration settings, score metrics, and sample screening logic.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
