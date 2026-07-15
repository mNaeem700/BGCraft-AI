/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, HelpCircle, BookOpen, FileText, Sparkles, MessageSquare } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'workspace' | 'blog' | 'faqs' | 'privacy' | 'terms' | 'about' | 'contact';
  setView: (view: 'home' | 'workspace' | 'blog' | 'faqs' | 'privacy' | 'terms' | 'about' | 'contact') => void;
  hasActiveImage: boolean;
}

export default function Header({ currentView, setView, hasActiveImage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md">
      <div id="header-container" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          id="logo-button" 
          className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-90"
          onClick={() => setView('home')}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-md shadow-blue-500/20">
            <Layers className="h-5 w-5 text-white" />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BGCraft</span>
            <span className="ml-2 rounded-full bg-blue-500/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-blue-400 border border-blue-500/30">AI</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            id="nav-home"
            onClick={() => setView('home')}
            className={`font-sans text-sm font-medium transition-colors hover:text-white ${
              currentView === 'home' ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            Home
          </button>
          
          {hasActiveImage && (
            <button
              id="nav-workspace"
              onClick={() => setView('workspace')}
              className={`flex items-center gap-1.5 font-sans text-sm font-medium transition-colors hover:text-white ${
                currentView === 'workspace' ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              Editor Workspace
            </button>
          )}

          <button
            id="nav-blog"
            onClick={() => setView('blog')}
            className={`flex items-center gap-1.5 font-sans text-sm font-medium transition-colors hover:text-white ${
              currentView === 'blog' ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            SEO Blog
          </button>

          <button
            id="nav-faqs"
            onClick={() => setView('faqs')}
            className={`flex items-center gap-1.5 font-sans text-sm font-medium transition-colors hover:text-white ${
              currentView === 'faqs' ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            FAQs
          </button>

          <button
            id="nav-about"
            onClick={() => setView('about')}
            className={`font-sans text-sm font-medium transition-colors hover:text-white ${
              currentView === 'about' ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            About Us
          </button>

          <button
            id="nav-contact"
            onClick={() => setView('contact')}
            className={`flex items-center gap-1.5 font-sans text-sm font-medium transition-colors hover:text-white ${
              currentView === 'contact' ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Contact
          </button>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {hasActiveImage ? (
            <button
              id="cta-workspace"
              onClick={() => setView('workspace')}
              className="relative hidden sm:flex overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 font-sans text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:scale-[1.02] hover:opacity-95 focus:outline-none"
            >
              Active Workspace
            </button>
          ) : (
            <button
              id="cta-start-free"
              onClick={() => setView('home')}
              className="relative flex overflow-hidden rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 font-sans text-xs font-semibold text-blue-400 transition duration-300 hover:bg-blue-500/20 focus:outline-none"
            >
              Start Free Removing
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
