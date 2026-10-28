import { Redirect } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, pendingStyleQuiz } = useAuth();

  if (!isAuthenticated) return <Redirect href="/Login" />;
  return <Redirect href={pendingStyleQuiz ? '/StyleQuiz' : '/Storefront'} />;
}
