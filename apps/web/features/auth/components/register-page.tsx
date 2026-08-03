'use client';

import { RegisterForm } from './register-form';
import { Sparkles, Gift } from 'lucide-react';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Sparkles className="h-6 w-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your Writara Account</h1>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Gift className="h-3.5 w-3.5" />
            Get 3 Free Credits Instantly
          </div>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
