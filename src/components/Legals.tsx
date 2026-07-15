/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldCheck, FileCheck, Info, MapPin, Send } from 'lucide-react';

interface LegalsProps {
  view: 'privacy' | 'terms' | 'about' | 'contact';
}

export default function Legals({ view }: LegalsProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] py-16 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Privacy Policy */}
        {view === 'privacy' && (
          <div className="space-y-8 animate-fade-in font-sans">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Privacy Policy</h1>
            </div>
            <p className="text-slate-400 text-xs">Last Updated: July 15, 2026</p>
            
            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">1. Overview and Our Privacy Guarantee</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                Welcome to BGCraft AI. We provide a completely free, online, sign-up-free AI background remover and photo editing application. We guarantee absolute data security. Because we do not require accounts, signups, credit cards, or logins, we do NOT collect, buy, or sell your personal credentials. Your privacy is structurally built into our architecture.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">2. Image Data Processing Policy</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                Any image you upload to BGCraft AI is temporarily processed to enable the editing and background removal features.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li><strong>Local Client Processing:</strong> The majority of your photo modifications, visual filter adjustments, text overlays, and sticker compositions happen directly inside your web browser using HTML5 hardware-accelerated canvas components. This data never leaves your computer.</li>
                <li><strong>AI Services Processing:</strong> AI background replacement request layers are handled via secure, transient endpoint calls. The image is held in temporary memory for the immediate execution of the segmentation/image generation models, and is instantly deleted. We do NOT maintain long-term image vaults.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">3. Third-Party Services and Analytics</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                We do not integrate aggressive telemetry, spyware trackers, or diagnostic analytics. We utilize standard, anonymous web hosting logs purely to check deployment health and bandwidth allocations. Our AI operations are performed securely using Google Gemini API structures.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">4. Cookies and Local Storage</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                BGCraft AI does not set tracking cookies. We utilize standard browser <code className="text-blue-400 font-mono">localStorage</code> or memory states solely to hold your current image editing state, history stack (for Undo/Redo operations), and editor configurations so your workflow is not lost on accidental page refreshes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">5. Contacting Us for Privacy Queries</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                If you have any questions, concerns, or requests regarding this Privacy Policy or how your session data is handled, feel free to email our privacy desk at <span className="text-blue-400">privacy@bgcraft.ai</span> or fill out our Contact form.
              </p>
            </section>
          </div>
        )}

        {/* Terms of Service */}
        {view === 'terms' && (
          <div className="space-y-8 animate-fade-in font-sans">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <FileCheck className="h-8 w-8 text-blue-400" />
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Terms of Service</h1>
            </div>
            <p className="text-slate-400 text-xs">Last Updated: July 15, 2026</p>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">1. Agreement to Terms</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                By accessing or using BGCraft AI, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you must cease using the application immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">2. Free Use License</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                We grant you a fully free, revocable, non-exclusive, non-transferable license to utilize BGCraft AI for editing photos, removing backgrounds, and exporting assets.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li><strong>Commercial Use:</strong> You are granted 100% full commercial rights over any images you process, edit, and export. There are no licensing fees, royalties, or premium subscriptions required to use your finished assets on web stores, ads, print, or social media.</li>
                <li><strong>No Restrictions:</strong> There are no download limits, image dimension limits, or hidden fees. We place no watermarks on your creations.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">3. User Responsibility and Prohibited Activities</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                While using BGCraft AI, you are solely responsible for the images you upload. You are strictly forbidden from uploading images that:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li>Infringe upon third-party trademarks, copyright licenses, or patents.</li>
                <li>Depict highly offensive, violent, illegal, explicit, or abusive content.</li>
                <li>Contain malicious code, viruses, or executables meant to attack our hosting containers or API limits.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">4. Disclaimer of Warranty</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                BGCraft AI is provided "as is" and "as available" without any warranty of any kind, either express or implied, including the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the tool will be uninterrupted, error-free, or achieve 100% background removal precision on every single complex graphic.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">5. Service Terminations and Edits</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                We reserve the right to modify, optimize, suspend, or terminate the application or any specific service features at any time without notice to adjust for model configurations, API limits, or container health.
              </p>
            </section>
          </div>
        )}

        {/* About Us */}
        {view === 'about' && (
          <div className="space-y-8 animate-fade-in font-sans">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Info className="h-8 w-8 text-blue-400" />
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">About BGCraft AI</h1>
            </div>

            <p className="text-lg leading-relaxed text-slate-300 font-sans font-light">
              We believe that top-tier, professional-grade visual design and photo-editing software should be **available to everyone, completely free, without gatekeepers or subscription locks.**
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="font-display text-lg font-bold text-white mb-2">Our Mission</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  To democratize graphic asset creation for small business owners, online e-commerce sellers, students, and digital creators worldwide. By removing complex price tiers, logins, and watermark restrictions, we enable creators to design freely.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="font-display text-lg font-bold text-white mb-2">The Technology</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  BGCraft AI leverages a state-of-the-art full-stack pipeline. The client-side utilizes GPU-accelerated HTML5 canvas contexts for instantaneous adjustments, text compilation, and layered compositions. The AI backend relies on cutting-edge computer vision networks and Google Gemini generative API suites.
                </p>
              </div>
            </div>

            <section className="space-y-4 pt-4">
              <h2 className="font-display text-xl font-bold text-white">Why BGCraft AI is Completely Free</h2>
              <p className="leading-relaxed text-slate-300 text-sm">
                Traditional background removers lure users in with "free trials" only to lock the actual high-resolution exports behind monthly paywalls, or render ugly, unusable watermarks across the final cutout. BGCraft AI is fully subsidized by open-source computer vision optimizations and smart, efficient container execution, letting us maintain zero operational premium costs. Use it as much as you like, forever!
              </p>
            </section>
          </div>
        )}

        {/* Contact Page */}
        {view === 'contact' && (
          <div className="space-y-8 animate-fade-in font-sans">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <MessageSquare className="h-8 w-8 text-blue-400" />
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Contact Us</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Contact Info Sidebar */}
              <div className="md:col-span-2 space-y-6">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Have a feature request? Spotted a complex edge extraction issue? Want to partner with our tech stack? Get in touch with our team directly.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white">Support Desk</h4>
                      <p className="text-slate-400">support@bgcraft.ai</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white">Tech Sandbox Office</h4>
                      <p className="text-slate-400 font-mono">Cloud Run Containers, San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form panel */}
              <div className="md:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Send className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">Message Transmitted!</h3>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Thank you for contacting BGCraft AI. Our senior engineering team will review your ticket and reply within 24 hours.
                    </p>
                    <button 
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 transition text-white cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-display">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. Alex Johnson"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-display">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. alex@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-display">Subject</label>
                      <input 
                        type="text" 
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. Feature request / Bug report"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-display">Message</label>
                      <textarea 
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                        placeholder="How can we assist you?"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:scale-[1.01] hover:opacity-95 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      Transmit Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
