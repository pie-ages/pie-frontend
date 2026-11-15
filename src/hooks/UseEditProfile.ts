import { router } from 'expo-router';
import { useCallback, useState } from 'react';

import type { AccountSexChoice } from '@/constants/AccountSex';
import { useCurrentUser } from '@/hooks/UseCurrentUser';
import { ApiError, isSessionExpiredError } from '@/services/client';
import { updateCurrentUser } from '@/services/user';
import { ProfileStatus } from '@/types/Profile';
import { toAccountSex, toAccountSexChoice } from '@/utils/account-sex';

export function useEditProfile() {
  const currentUser = useCurrentUser(true);
  const [draftName, setDraftName] = useState<string | null>(null);
  const [draftSexChoice, setSexChoice] = useState<AccountSexChoice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSessionExpired, setSaveSessionExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = currentUser;
  const name = draftName ?? user?.name ?? '';
  const sexChoice = draftSexChoice ?? toAccountSexChoice(user?.sex);
  const canSave = !!user && name.trim().length > 0 && !isSaving;

  const save = useCallback(async () => {
    if (!user || !canSave) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateCurrentUser(user.id, {
        name: name.trim(),
        photoUrl: user.photoUrl ?? null,
        ...(sexChoice !== '' ? { sex: toAccountSex(sexChoice) } : {}),
      });
      router.back();
    } catch (saveError) {
      if (isSessionExpiredError(saveError)) setSaveSessionExpired(true);
      else {
        setError(
          saveError instanceof ApiError && saveError.serverMessage
            ? saveError.serverMessage
            : 'Não foi possível salvar seu perfil. Tente novamente.',
        );
      }
    } finally {
      setIsSaving(false);
    }
  }, [canSave, name, sexChoice, user]);

  return {
    user,
    name,
    setName: setDraftName,
    email: user?.email ?? '',
    isLoading: currentUser.status === ProfileStatus.Loading,
    hasLoadError: currentUser.status === ProfileStatus.Error,
    retry: currentUser.retry,
    sessionExpired: currentUser.sessionExpired || saveSessionExpired,
    isSaving,
    canSave,
    error,
    save,
    sexChoice,
    setSexChoice,
  };
}
