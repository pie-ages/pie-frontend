import { useCallback, useEffect, useState } from 'react';

import { fetchUserProfile } from '@/mocks/userProfile';
import type { UserProfile } from '@/types/UserProfile';

export type UserProfileStatus = 'loading' | 'success' | 'error';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<UserProfileStatus>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetchUserProfile()
      .then((data) => {
        if (!isActive) return;
        setProfile(data);
        setStatus('success');
      })
      .catch(() => {
        if (isActive) setStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }, []);

  return { profile, status, retry };
}
