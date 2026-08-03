import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/login';
import type { LoginDto } from '../types/auth.type';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: LoginDto) => login(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}
