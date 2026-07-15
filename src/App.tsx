/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeUpload from './components/HomeUpload';
import Workspace from './components/Workspace';
import BlogFAQ from './components/BlogFAQ';
import Legals from './components/Legals';

export default function App() {
  const [currentView, setView] = useState<'home' | 'workspace' | 'blog' | 'faqs' | 'privacy' | 'terms' | 'about' | 'contact'>('home');
  const [activeFile, setActiveFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setActiveFile(file);
    setView('workspace');
  };

  const handleClearFile = () => {
    setActiveFile(null);
    setView('home');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050608] font-sans text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Universal Header */}
      <Header 
        currentView={currentView} 
        setView={setView} 
        hasActiveImage={!!activeFile} 
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'home' && (
          <HomeUpload 
            onFileSelect={handleFileSelect} 
            setView={setView}
          />
        )}
        
        {currentView === 'workspace' && activeFile && (
          <Workspace 
            originalFile={activeFile} 
            setView={setView}
            onClear={handleClearFile}
          />
        )}

        {currentView === 'workspace' && !activeFile && (
          <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4 p-8 text-center bg-[#050608]">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">No active image found</h2>
            <p className="text-sm text-slate-400 max-w-sm">
              Please return to the home screen and upload a picture to open the photo-editing workspace.
            </p>
            <button
              onClick={() => setView('home')}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              Upload Photo
            </button>
          </div>
        )}

        {(currentView === 'blog' || currentView === 'faqs') && (
          <BlogFAQ mode={currentView} />
        )}

        {(currentView === 'privacy' || currentView === 'terms' || currentView === 'about' || currentView === 'contact') && (
          <Legals view={currentView} />
        )}
      </div>

      {/* Universal Footer */}
      <Footer setView={setView} />

    </div>
  );
}
