/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, Clock, Tag, MessageSquare, ArrowLeft } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { FAQ_DATA } from '../data/faqData';
import { BlogPost, FAQItem } from '../types';

interface BlogFAQProps {
  mode: 'blog' | 'faqs';
}

export default function BlogFAQ({ mode }: BlogFAQProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);

  // Pagination for blog posts (10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Derive categories
  const blogCategories = useMemo(() => {
    const cats = new Set(BLOG_POSTS.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const faqCategories = useMemo(() => {
    const cats = new Set(FAQ_DATA.map(f => f.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter Blog Posts
  const filteredBlogPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle Blog pagination
  const paginatedBlogPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredBlogPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredBlogPosts, currentPage]);

  const totalPages = Math.ceil(filteredBlogPosts.length / postsPerPage);

  const toggleFaq = (id: string) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#050608] py-16 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Render Single Blog Post Detail View */}
        {activeBlogPost ? (
          <article className="mx-auto max-w-4xl space-y-8 animate-fade-in">
            <button 
              onClick={() => setActiveBlogPost(null)}
              className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-white/10 transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog Articles
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-semibold">
                  <Tag className="h-3 w-3" />
                  {activeBlogPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activeBlogPost.readTime}
                </span>
                <span>•</span>
                <span>{activeBlogPost.date}</span>
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
                {activeBlogPost.title}
              </h1>
              <p className="text-lg text-slate-300 font-sans italic border-l-4 border-blue-500 pl-4 py-1">
                "{activeBlogPost.excerpt}"
              </p>
            </div>

            {/* Simulated rich rendering of our Markdown content blocks */}
            <div className="prose prose-invert prose-blue max-w-none border-t border-white/10 pt-8 leading-relaxed text-slate-300 space-y-6">
              {activeBlogPost.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.trim().startsWith('# ')) {
                  return null; // Skip redundant top title
                } else if (paragraph.trim().startsWith('## ')) {
                  return (
                    <h2 key={index} className="font-display text-2xl font-bold text-white mt-8 mb-4 border-b border-white/5 pb-2">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                } else if (paragraph.trim().startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2 my-4 font-sans">
                      {paragraph.split('\n').map((li, liIndex) => (
                        <li key={liIndex}>{li.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.trim().startsWith('1. ')) {
                  return (
                    <ol key={index} className="list-decimal pl-6 space-y-2 my-4 font-sans">
                      {paragraph.split('\n').map((li, liIndex) => (
                        <li key={liIndex}>{li.replace(/^\d+\.\s+/, '')}</li>
                      ))}
                    </ol>
                  );
                } else if (paragraph.trim().startsWith('```')) {
                  return (
                    <pre key={index} className="rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-xs overflow-x-auto text-blue-300 my-4">
                      <code>{paragraph.replace(/```[a-z]*/g, '').trim()}</code>
                    </pre>
                  );
                } else if (paragraph.trim()) {
                  // Standard text
                  return <p key={index} className="text-base font-sans">{paragraph}</p>;
                }
                return null;
              })}
            </div>

            <div className="border-t border-white/10 pt-8 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">Written by</span>
                <span className="font-display font-bold text-white">BGCraft Editorial Team</span>
              </div>
              <button 
                onClick={() => setActiveBlogPost(null)}
                className="rounded-lg bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition cursor-pointer"
              >
                Find More Articles
              </button>
            </div>
          </article>
        ) : (
          <div className="space-y-12">
            
            {/* Header / Intro section */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {mode === 'blog' ? 'Design Guides & Tutorials' : 'Help Center & FAQs'}
              </h1>
              <p className="text-lg text-slate-400 font-sans">
                {mode === 'blog' 
                  ? 'Explore our SEO-optimized graphic knowledge library. Tips, secrets, and tutorials for background removing, e-commerce listing, and digital branding.'
                  : 'Have questions about background removal, output resolutions, transparency, or local storage? Check our detailed troubleshooting database.'}
              </p>
            </div>

            {/* Search and Filters Bento Grid Panel */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={mode === 'blog' ? "Search 50 articles..." : "Search 60 FAQs..."}
                    className="w-full rounded-xl border border-white/10 bg-[#050608]/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-start md:justify-end">
                  <span className="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider font-display">Filters:</span>
                  {(mode === 'blog' ? blogCategories : faqCategories).map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/20' 
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Mode: Blog Posts Layout */}
            {mode === 'blog' && (
              <div className="space-y-8">
                {filteredBlogPosts.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-sans">
                    No articles found matching your query. Try a different keyword!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {paginatedBlogPosts.map(post => (
                      <article 
                        key={post.id}
                        onClick={() => setActiveBlogPost(post)}
                        className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-sans">
                            <span className="font-semibold text-blue-400 uppercase tracking-wider">{post.category}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h3 className="font-display text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-400 line-clamp-3 font-sans">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-xs font-semibold text-blue-400 font-sans">
                          <span>Read Full Article</span>
                          <span className="text-slate-500">{post.date}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/10 transition disabled:opacity-40 disabled:hover:bg-white/5"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/10 transition disabled:opacity-40 disabled:hover:bg-white/5"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mode: FAQs Accordion Layout */}
            {mode === 'faqs' && (
              <div className="max-w-4xl mx-auto space-y-4">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-sans">
                    No FAQs found matching your query. Try a different category!
                  </div>
                ) : (
                  filteredFaqs.map(faq => {
                    const isOpen = activeFaqId === faq.id;
                    return (
                      <div 
                        key={faq.id}
                        className="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition duration-300 hover:border-white/20"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="flex w-full items-center justify-between p-5 text-left font-sans text-base font-semibold text-white focus:outline-none cursor-pointer"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-bold rounded bg-blue-500/10 px-2 py-0.5 text-blue-400 uppercase tracking-wider">
                              {faq.category}
                            </span>
                            {faq.question}
                          </span>
                          {isOpen ? <ChevronUp className="h-4 w-4 text-blue-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </button>
                        
                        {isOpen && (
                          <div className="border-t border-white/5 bg-[#050608]/60 p-5 text-sm leading-relaxed text-slate-300 font-sans">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
