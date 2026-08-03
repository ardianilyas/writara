import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/logout';
import { useUserStore } from '../stores/use-user-store';

export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useUserStore((state) => state.clearUser);

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      clearUser();
      queryClient.setQueryData(['session'], null);
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}
