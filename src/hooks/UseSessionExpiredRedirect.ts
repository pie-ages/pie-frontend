import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useAuth } from '@/contexts/AuthContext';

export function useSessionExpiredRedirect(sessionExpired: boolean) {
  const { signOut } = useAuth();
  const redirected = useRef(false);

  useEffect(() => {
    if (!sessionExpired) {
      redirected.current = false;
      return;
    }
    if (redirected.current) return;

    redirected.current = true;
    signOut().finally(() => router.replace('/Login'));
  }, [sessionExpired, signOut]);
}
