/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Mail, Github, Heart } from 'lucide-react';

interface FooterProps {
  setView: (view: 'home' | 'workspace' | 'blog' | 'faqs' | 'privacy' | 'terms' | 'about' | 'contact') => void;
}

export default function Footer({ setView }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#050608] py-12 text-slate-400">
      <div id="footer-container" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1.5 space-y-4">
            <div 
              id="footer-logo" 
              className="flex cursor-pointer items-center gap-2"
              onClick={() => setView('home')}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-md shadow-blue-500/20">
                <Layers className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-white">BGCraft <span className="text-blue-400">AI</span></span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The premier free online background remover and image editor suite. Instant automatic cutout separation, replacement, filters, overlays, and smart enhancements. Zero signups, zero limitations.
            </p>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-white/5 p-2 text-slate-500 hover:text-white transition cursor-pointer">
                <Mail className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-white/5 p-2 text-slate-500 hover:text-white transition cursor-pointer">
                <Github className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wider uppercase text-white">Product</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button onClick={() => setView('home')} className="hover:text-blue-400 transition cursor-pointer">Remove Background</button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-blue-400 transition cursor-pointer">AI Backdrop Gen</button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-blue-400 transition cursor-pointer">Photo Filters</button>
              </li>
              <li>
                <button onClick={() => setView('blog')} className="hover:text-blue-400 transition cursor-pointer">Creative Guides</button>
              </li>
            </ul>
          </div>

          {/* SEO and Resources */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wider uppercase text-white">Resources</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button onClick={() => setView('blog')} className="hover:text-blue-400 transition cursor-pointer">SEO Blog Articles</button>
              </li>
              <li>
                <button onClick={() => setView('faqs')} className="hover:text-blue-400 transition cursor-pointer">Help & FAQs</button>
              </li>
              <li>
                <button onClick={() => setView('about')} className="hover:text-blue-400 transition cursor-pointer">About Our AI Models</button>
              </li>
              <li>
                <button onClick={() => setView('contact')} className="hover:text-blue-400 transition cursor-pointer">Contact Support</button>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wider uppercase text-white">Legal</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button onClick={() => setView('privacy')} className="hover:text-blue-400 transition cursor-pointer">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => setView('terms')} className="hover:text-blue-400 transition cursor-pointer">Terms of Service</button>
              </li>
              <li>
                <button onClick={() => setView('privacy')} className="hover:text-blue-400 transition cursor-pointer">Cookie Settings</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 BGCraft AI. All commercial rights and layouts preserved free.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> in a sandboxed secure workspace.
          </p>
        </div>
      </div>
    </footer>
  );
}
