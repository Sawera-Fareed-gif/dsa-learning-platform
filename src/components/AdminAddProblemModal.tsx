import React, { useState } from 'react';
import { api } from '../services/api';
import { Problem } from '../types';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';

interface AdminAddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemCreated: (newProblem: Problem) => void;
  existingTopics: string[];
}

export const AdminAddProblemModal: React.FC<AdminAddProblemModalProps> = ({
  isOpen,
  onClose,
  onProblemCreated,
  existingTopics,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [topic, setTopic] = useState(existingTopics[0] || 'Arrays');
  const [customTopic, setCustomTopic] = useState('');
  const [isCustomTopic, setIsCustomTopic] = useState(false);

  // Quiz Options
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalTopic = isCustomTopic ? customTopic.trim() : topic.trim();

    if (!title.trim() || title.length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }

    if (!description.trim() || description.length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }

    if (!finalTopic) {
      setError('Please select or specify a topic.');
      return;
    }

    const options = [optA.trim(), optB.trim(), optC.trim(), optD.trim()].filter(Boolean);
    if (options.length > 0 && options.length < 2) {
      setError('Please provide at least 2 answer choices for quiz capability.');
      return;
    }

    let correctAnswer = '';
    if (options.length >= 2) {
      if (correctOption === 'A') correctAnswer = optA.trim();
      else if (correctOption === 'B') correctAnswer = optB.trim();
      else if (correctOption === 'C') correctAnswer = optC.trim();
      else if (correctOption === 'D') correctAnswer = optD.trim();

      if (!correctAnswer) {
        setError(`Option ${correctOption} cannot be empty as it is marked as the correct answer.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await api.createProblem({
        title: title.trim(),
        description: description.trim(),
        difficulty,
        topic: finalTopic,
        options: options.length >= 2 ? options : undefined,
        correct_answer: correctAnswer || undefined,
        explanation: explanation.trim() || undefined,
      });

      onProblemCreated(res.problem);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create problem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        id="admin-add-problem-modal"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          id="close-admin-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Admin Portal
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mb-4">Add New DSA Problem</h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Problem Title</label>
            <input
              id="admin-problem-title-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Trapping Rain Water"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Difficulty & Topic Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Difficulty</label>
              <select
                id="admin-problem-difficulty-select"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">DSA Topic</label>
              {!isCustomTopic ? (
                <div className="flex gap-2">
                  <select
                    id="admin-problem-topic-select"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {existingTopics.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomTopic(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[11px]"
                  >
                    New
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="admin-custom-topic-input"
                    type="text"
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                    placeholder="e.g. Trie or Heaps"
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomTopic(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[11px]"
                  >
                    List
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Problem Description</label>
            <textarea
              id="admin-problem-desc-input"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="State the algorithmic problem, input parameters, and required output."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Quiz Assessment Options */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Interactive Quiz Multiple Choice Options</span>
              <span className="text-[10px] text-slate-400">Mark radio for correct choice</span>
            </div>

            <div className="space-y-2">
              {[
                { label: 'A', val: optA, set: setOptA },
                { label: 'B', val: optB, set: setOptB },
                { label: 'C', val: optC, set: setOptC },
                { label: 'D', val: optD, set: setOptD },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctOption === item.label}
                    onChange={() => setCorrectOption(item.label as any)}
                    className="accent-indigo-500 w-4 h-4 cursor-pointer"
                    title={`Mark option ${item.label} as correct`}
                  />
                  <span className="w-5 text-center font-bold text-slate-400">{item.label}</span>
                  <input
                    type="text"
                    value={item.val}
                    onChange={e => item.set(e.target.value)}
                    placeholder={`Answer option ${item.label}`}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Algorithmic Solution / Complexity Explanation</label>
            <textarea
              id="admin-problem-explanation-input"
              rows={2}
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="e.g. Time complexity O(N), Space complexity O(1) using two pointers."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              id="admin-cancel-btn"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="admin-submit-problem-btn"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding...' : 'Save & Publish Problem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
