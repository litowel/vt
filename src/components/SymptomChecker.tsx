import React, { useState } from 'react';
import { analyzeSymptoms } from '../lib/gemini';
import { saveRecord } from '../lib/storage';
import Markdown from 'react-markdown';
import { Loader2, Send, AlertCircle } from 'lucide-react';

export default function SymptomChecker({ isOffline }: { isOffline: boolean }) {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    if (isOffline) {
      setError('You are currently offline. Please connect to the internet to use the AI Symptom Checker.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await analyzeSymptoms(symptoms);
      setResult(response);
      saveRecord({
        type: 'symptom',
        input: symptoms,
        result: response,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing symptoms.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Symptom Checker</h2>
        <p className="text-gray-500 mb-6">Describe your symptoms in detail, and our AI will provide a preliminary analysis.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., I have had a headache for two days, feeling slightly nauseous, and have a mild fever..."
              className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !symptoms.trim() || isOffline}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Result</h3>
          <div className="prose prose-teal max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
