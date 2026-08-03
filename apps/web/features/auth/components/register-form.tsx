'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Loader2 } from 'lucide-react';

import { registerSchema, type RegisterSchema } from '../schemas/auth.schema';
import { useRegister } from '../hooks/use-register';
import { Button } from '@/components/ui/button';

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
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {registerMutation.error.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Full Name
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Ardian Ilyas"
          className="w-full rounded-lg bg-white border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition shadow-xs"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

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
          placeholder="At least 6 characters"
          className="w-full rounded-lg bg-white border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition shadow-xs"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
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
      </Button>

      <p className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 transition"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
