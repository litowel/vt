/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import HomeSlider from './components/HomeSlider';
import SymptomChecker from './components/SymptomChecker';
import ImageDiagnosis from './components/ImageDiagnosis';
import History from './components/History';
import Premium from './components/Premium';
import Affiliate from './components/Affiliate';
import FirstAid from './components/FirstAid';
import { Home, Activity, ImageIcon, Clock, WifiOff, HeartPulse, Star, Users, AlertTriangle } from 'lucide-react';

type Tab = 'home' | 'symptoms' | 'image' | 'history' | 'firstaid' | 'premium' | 'affiliate';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
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
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Vitala AI</h1>
              <p className="text-xs text-gray-500 font-medium">powered by Upfrica.africa</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isOffline && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                <WifiOff className="w-4 h-4" />
                <span className="hidden sm:inline">Offline Mode</span>
              </div>
            )}
            <button 
              onClick={() => setActiveTab('premium')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl text-sm font-medium hover:from-teal-500 hover:to-teal-400 transition-colors shadow-sm"
            >
              <Star className="w-4 h-4" />
              Upgrade
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs - Scrollable on mobile */}
        <div className="flex overflow-x-auto pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex gap-1 bg-gray-200/50 p-1 rounded-xl min-w-max mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('symptoms')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'symptoms'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Symptoms</span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'image'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Image Scan</span>
            </button>
            <button
              onClick={() => setActiveTab('firstaid')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'firstaid'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>First Aid</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>History</span>
            </button>
            <button
              onClick={() => setActiveTab('affiliate')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'affiliate'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-teal-700/70 hover:text-teal-800 hover:bg-teal-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Affiliates</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'home' && <HomeSlider onNavigate={setActiveTab} />}
          {activeTab === 'symptoms' && <SymptomChecker isOffline={isOffline} />}
          {activeTab === 'image' && <ImageDiagnosis isOffline={isOffline} />}
          {activeTab === 'firstaid' && <FirstAid />}
          {activeTab === 'history' && <History />}
          {activeTab === 'premium' && <Premium />}
          {activeTab === 'affiliate' && <Affiliate />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            <strong>Disclaimer:</strong> Vitala AI is an experimental AI tool and does not provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Vitala AI by Upfrica.africa
            </p>
            <span className="text-gray-300">•</span>
            <button onClick={() => setActiveTab('affiliate')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Join Affiliate Program
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
