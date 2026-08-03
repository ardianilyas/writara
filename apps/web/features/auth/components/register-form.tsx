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
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {registerMutation.error.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-foreground mb-1.5">
          Full Name
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Ardian Ilyas"
          className="w-full rounded-lg bg-background border border-input px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring transition shadow-xs"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

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
          placeholder="At least 6 characters"
          className="w-full rounded-lg bg-background border border-input px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring transition shadow-xs"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="default"
        disabled={registerMutation.isPending}
        className="w-full gap-2"
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

      <p className="text-center text-xs text-muted-foreground pt-2">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-foreground underline underline-offset-4 transition"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
