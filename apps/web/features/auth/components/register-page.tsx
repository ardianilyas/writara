'use client';

import { RegisterForm } from './register-form';
import { Sparkles, Gift } from 'lucide-react';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
          <Sparkles className="h-6 w-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your Writara Account</h1>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Gift className="h-3.5 w-3.5 text-emerald-600" />
            Get 3 Free Credits Instantly
          </div>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
