import { useCallback, useEffect, useState } from 'react';

import { fetchProfile } from '@/services/profile';
import type { Profile } from '@/types/Profile';

export type ProfileStatus = 'loading' | 'success' | 'error';

export function useUserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetchProfile()
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
