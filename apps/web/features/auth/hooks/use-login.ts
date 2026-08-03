import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { login } from '../api/login';
import type { LoginDto } from '../types/auth.type';
import { useUserStore } from '../stores/use-user-store';

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: (dto: LoginDto) => login(dto),
    onSuccess: (data) => {
      if (data?.user) {
        setUser({
          email: data.user.email,
          name: data.user.name,
        });
      }
      toast.success('Successfully signed in!');
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}
