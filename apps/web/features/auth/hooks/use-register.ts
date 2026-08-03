import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register } from '../api/register';
import type { RegisterDto } from '../types/auth.type';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegisterDto) => register(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}
