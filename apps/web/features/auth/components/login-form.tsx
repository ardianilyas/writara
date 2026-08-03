'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react';

import { loginSchema, type LoginSchema } from '../schemas/auth.schema';
import { useLogin } from '../hooks/use-login';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {loginMutation.isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {loginMutation.error.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-lg bg-white border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition shadow-xs"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg bg-white border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition shadow-xs"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Sign In
          </>
        )}
      </Button>

      <p className="text-center text-xs text-slate-500 pt-2">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 transition"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
