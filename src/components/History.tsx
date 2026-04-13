import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory, DiagnosisRecord } from '../lib/storage';
import Markdown from 'react-markdown';
import { Clock, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, FileText } from 'lucide-react';

export default function History() {
  const [records, setRecords] = useState<DiagnosisRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your history?')) {
      clearHistory();
      setRecords([]);
    }
  };

  if (records.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">No History Yet</h2>
        <p className="text-gray-500">Your symptom and image diagnosis history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Diagnosis History</h2>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.type === 'image' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'}`}>
                  {record.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {record.type === 'image' ? 'Image Analysis' : 'Symptom Check'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
              {expandedId === record.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {expandedId === record.id && (
              <div className="p-6 pt-0 border-t border-gray-100 mt-4">
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Your Input:</h4>
                  {record.type === 'image' && record.imageUrl && (
                    <img src={record.imageUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded-lg mb-3 border border-gray-200" />
                  )}
                  <p className="text-gray-600">{record.input}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">AI Analysis:</h4>
                  <div className="prose prose-sm prose-teal max-w-none">
                    <Markdown>{record.result}</Markdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
