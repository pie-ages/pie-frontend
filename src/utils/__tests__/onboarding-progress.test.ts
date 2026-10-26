import { describe, expect, it } from '@jest/globals';

import {
  getOnboardingStorageKey,
  INITIAL_ONBOARDING_PROGRESS,
  parseOnboardingProgress,
} from '@/utils/onboarding-progress';

describe('parseOnboardingProgress', () => {
  it('começa do primeiro passo quando não há progresso salvo', () => {
    expect(parseOnboardingProgress(null, 6)).toEqual(INITIAL_ONBOARDING_PROGRESS);
  });

  it('retoma o passo salvo', () => {
    const raw = JSON.stringify({ status: 'in_progress', stepIndex: 3 });
    expect(parseOnboardingProgress(raw, 6)).toEqual({ status: 'in_progress', stepIndex: 3 });
  });

  it('limita o passo salvo à quantidade de passos', () => {
    const raw = JSON.stringify({ status: 'in_progress', stepIndex: 10 });
    expect(parseOnboardingProgress(raw, 6).stepIndex).toBe(5);
  });

  it('reconhece onboarding concluído', () => {
    const raw = JSON.stringify({ status: 'completed', stepIndex: 2 });
    expect(parseOnboardingProgress(raw, 6).status).toBe('completed');
  });

  it('volta ao início com valor inválido', () => {
    expect(parseOnboardingProgress('não é json', 6)).toEqual(INITIAL_ONBOARDING_PROGRESS);
    expect(parseOnboardingProgress(JSON.stringify({ status: 'x' }), 6)).toEqual(
      INITIAL_ONBOARDING_PROGRESS,
    );
  });
});

describe('getOnboardingStorageKey', () => {
  it('gera uma chave diferente para cada usuário', () => {
    expect(getOnboardingStorageKey('user-1')).toBe('pie_onboarding_progress.user-1');
    expect(getOnboardingStorageKey('user-1')).not.toBe(getOnboardingStorageKey('user-2'));
  });

  it('só usa caracteres aceitos pelo SecureStore', () => {
    const key = getOnboardingStorageKey('6f1c2b0e-1a2b-4c3d-9e8f-001122334455');

    expect(key).toMatch(/^[A-Za-z0-9._-]+$/);
    expect(getOnboardingStorageKey('a:b/c d@e')).toMatch(/^[A-Za-z0-9._-]+$/);
  });
});
