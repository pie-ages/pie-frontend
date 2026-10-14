export async function requestPasswordRecovery(_email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

export async function resetPassword(_tokenHash: string, _password: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}
