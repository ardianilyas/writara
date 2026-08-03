import { useQuery } from '@tanstack/react-query';
import { getCredits } from '../api/get-credits';
import { useSession } from '@/features/auth';

export function useCredits() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return useQuery({
    queryKey: ['credits'],
    queryFn: () => getCredits(),
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds
  });
}
