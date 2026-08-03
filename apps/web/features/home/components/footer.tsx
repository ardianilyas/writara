'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-100 pt-16 pb-12 px-6 sm:px-12 lg:px-16 mt-20 relative overflow-hidden border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* TOP SECTION: Description & Nav Links + Back to Top Button */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Left Description */}
          <div className="max-w-md space-y-3">
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Writara AI presentation engine helps educators and creators structure complex topics, automate slide layouts, and guide every presenter with total clarity.
            </p>
          </div>

          {/* Right Navigation & Scroll to Top */}
          <div className="flex items-center gap-6 sm:gap-8">
            <nav className="flex items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="#models" className="hover:text-white transition">
                Models
              </a>
              <a href="#features" className="hover:text-white transition">
                Capabilities
              </a>
              <a href="#how-it-works" className="hover:text-white transition">
                Process
              </a>
            </nav>

            {/* Circular Back to Top Button (Matching Reference Image) */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-white shadow-lg cursor-pointer transition"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* BOTTOM SECTION: Social Links, Giant Brand Mark & Footer Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pt-8 border-t border-slate-900">
          {/* Left Column: Social Pills & Massive Brand Name */}
          <div className="lg:col-span-7 space-y-6">
            {/* Social Pills */}
            <div className="flex items-center gap-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white transition"
              >
                X
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Li
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Gh
              </a>
            </div>

            {/* Giant Brand Typography (Matching Reference Image) */}
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white select-none leading-none">
              writara
            </h2>
          </div>

          {/* Right Column: Footer Info Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 text-xs text-slate-400">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">AI Models</h4>
              <ul className="space-y-2 text-slate-400">
                <li>DeepSeek V4 Flash (Pro)</li>
                <li>Nemotron 30B (Free)</li>
                <li>Dynamic Chapter Engine</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Legal & System</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>System Status: Online</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-left text-[11px] text-slate-600 border-t border-slate-900/60">
          <p>© {new Date().getFullYear()} Writara AI. Built with Next.js App Router, Better Auth & TanStack Query.</p>
        </div>
      </div>
    </footer>
  );
}
