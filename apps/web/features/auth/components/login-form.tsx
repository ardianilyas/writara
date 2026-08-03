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
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {loginMutation.error.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-foreground mb-1.5">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-lg bg-background border border-input px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring transition shadow-xs"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-1.5">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg bg-background border border-input px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring transition shadow-xs"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="default"
        disabled={loginMutation.isPending}
        className="w-full gap-2"
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

      <p className="text-center text-xs text-muted-foreground pt-2">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-foreground underline underline-offset-4 transition"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
