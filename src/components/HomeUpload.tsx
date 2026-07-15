/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, Image, Sparkles, Sliders, Layers, ChevronRight, CheckCircle, FileImage } from 'lucide-react';

interface HomeUploadProps {
  onFileSelect: (file: File) => void;
  setView: (view: 'home' | 'workspace' | 'blog' | 'faqs' | 'privacy' | 'terms' | 'about' | 'contact') => void;
}

export default function HomeUpload({ onFileSelect, setView }: HomeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main id="home-upload-main" className="relative min-h-screen overflow-hidden bg-[#050608] text-slate-200">
      
      {/* Aurora Background Blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[450px] w-[450px] translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="absolute bottom-1/4 left-1/3 -z-10 h-80 w-80 rounded-full bg-purple-500/5 blur-[90px]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        
        {/* Hero Copy */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 font-mono text-xs font-semibold text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            No Watermarks • Completely Free • No Signup
          </div>
          
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Free AI Background <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Remover & Photo Editor</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-sans font-light">
            BGCraft AI instantly isolates subjects from backgrounds. Fine-tune edges, create stunning AI backdrop generations, apply professional filters, text layers, and shapes. Completely free in HD!
          </p>
        </div>

        {/* Upload Container (Bento Box Style) */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative overflow-hidden rounded-3xl border transition duration-500 ${
              dragActive 
                ? 'border-blue-400 bg-blue-500/5 shadow-2xl shadow-blue-500/10 scale-[1.01]' 
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 shadow-xl'
            } p-12 text-center backdrop-blur-xl`}
          >
            {/* Inner background accents */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />

            <div className="relative flex flex-col items-center justify-center space-y-5 py-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400">
                <Upload className="h-8 w-8 animate-bounce" />
                <div className="absolute -inset-1 rounded-2xl bg-blue-500/10 blur opacity-40 pointer-events-none" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-display text-xl font-bold text-white">Drag & drop your image here</h3>
                <p className="text-sm text-slate-400">or click to browse your local device files</p>
              </div>

              <button
                type="button"
                onClick={onButtonClick}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                Choose Photo to Edit
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-4">
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-blue-500" /> PNG</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-blue-500" /> JPG / JPEG</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-blue-500" /> WEBP</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-blue-500" /> AVIF</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-blue-500" /> HEIC</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-blue-500" /> Up to 25MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-28 space-y-12">
          <h2 className="font-display text-2xl font-bold text-white text-center tracking-tight">
            High-Performance AI Processing Pipeline
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm space-y-4 hover:border-white/10 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Hair & Detail Precision</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our edge segmentation recognizes fine hair fibers, animal fur, and complex transparent layers, generating ultra-clean cutout paths.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm space-y-4 hover:border-white/10 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">AI Backdrop Generator</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Replace backgrounds with colors, presets, gradients, or type a custom prompt to have Gemini build beautiful realistic backdrop stages.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm space-y-4 hover:border-white/10 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Adjustment Suite</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Fine-tune contrast, highlights, shadows, warmth, saturation, vignette, borders, and crop presets for social feeds instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm space-y-4 hover:border-white/10 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FileImage className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Lossless HD Export</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Save your completed compositions as transparent PNGs, high-quality JPEGs, or next-gen WebP & AVIF formats with custom slider weight.
              </p>
            </div>

          </div>
        </div>

        {/* Call to Action for Blog and FAQs */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/20 to-cyan-950/10 p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-mono font-medium text-blue-400 uppercase tracking-widest">Knowledge Base</span>
              <h3 className="font-display text-2xl font-extrabold text-white">50 Professional SEO Design Guides</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Browse our comprehensive editorial articles detailing professional lighting matching, transparent exports, and marketing assets.
              </p>
            </div>
            <button 
              onClick={() => setView('blog')}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition w-fit"
            >
              Explore Knowledge Library <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/20 to-pink-950/10 p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="rounded-md bg-purple-500/10 px-2.5 py-1 text-xs font-mono font-medium text-purple-400 uppercase tracking-widest">Support Core</span>
              <h3 className="font-display text-2xl font-extrabold text-white">60 Searchable Help FAQs</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Uncover exhaustive tutorials regarding file processing size, browser memory limits, compliance rules, and formatting formats.
              </p>
            </div>
            <button 
              onClick={() => setView('faqs')}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition w-fit"
            >
              Search Help Database <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
