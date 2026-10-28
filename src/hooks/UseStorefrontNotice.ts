import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

const NOTICE_DURATION_MS = 4000;

export function useStorefrontNotice() {
  const { notice } = useLocalSearchParams<{ notice?: string }>();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(notice);
    router.setParams({ notice: undefined });
  }, [notice]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(null), NOTICE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [message]);

  return { message };
}
