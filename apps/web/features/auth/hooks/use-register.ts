import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register } from '../api/register';
import type { RegisterDto } from '../types/auth.type';
import { useUserStore } from '../stores/use-user-store';

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: (dto: RegisterDto) => register(dto),
    onSuccess: (data) => {
      if (data?.user) {
        setUser({
          email: data.user.email,
          name: data.user.name,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}
