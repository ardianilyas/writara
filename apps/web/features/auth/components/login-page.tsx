'use client';

import { LoginForm } from './login-form';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles className="h-6 w-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back to Writara</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to continue generating AI presentations</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
