'use client';

import { LoginForm } from './login-form';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
          <Sparkles className="h-6 w-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back to Writara</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to continue generating AI presentations</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
