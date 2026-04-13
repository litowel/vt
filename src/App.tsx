/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SymptomChecker from './components/SymptomChecker';
import ImageDiagnosis from './components/ImageDiagnosis';
import History from './components/History';
import { Activity, ImageIcon, Clock, WifiOff, HeartPulse } from 'lucide-react';

type Tab = 'symptoms' | 'image' | 'history';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('symptoms');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Vitala AI</h1>
              <p className="text-xs text-gray-500 font-medium">powered by Upfrica.africa</p>
            </div>
          </div>
          
          {isOffline && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <WifiOff className="w-4 h-4" />
              <span className="hidden sm:inline">Offline Mode</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'symptoms'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            Symptoms
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'image'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            History
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'symptoms' && <SymptomChecker isOffline={isOffline} />}
          {activeTab === 'image' && <ImageDiagnosis isOffline={isOffline} />}
          {activeTab === 'history' && <History />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            <strong>Disclaimer:</strong> Vitala AI is an experimental AI tool and does not provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            &copy; {new Date().getFullYear()} Vitala AI by Upfrica.africa
          </p>
        </div>
      </footer>
    </div>
  );
}
