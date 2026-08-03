import { useQuery } from '@tanstack/react-query';
import { getSession } from '../api/get-session';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => getSession(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
