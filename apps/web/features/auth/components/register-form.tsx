'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Loader2 } from 'lucide-react';

import { registerSchema, type RegisterSchema } from '../schemas/auth.schema';
import { useRegister } from '../hooks/use-register';

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {registerMutation.isError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {registerMutation.error.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Full Name
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Ardian Ilyas"
          className="w-full rounded-xl bg-slate-900/60 border border-slate-700/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-xl bg-slate-900/60 border border-slate-700/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          placeholder="At least 6 characters"
          className="w-full rounded-xl bg-slate-900/60 border border-slate-700/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Create Free Account
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400 pt-2">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
