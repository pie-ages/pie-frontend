import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useRegisterForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible((prev) => !prev);

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return false;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Futura integração com a API:
      // await api.post('/users', { name, email, password });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redireciona para o login após criar a conta
      router.replace('/login');
    } catch (err) {
      setError('Ocorreu um erro ao criar a conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    email,
    password,
    confirmPassword,
    isPasswordVisible,
    isConfirmPasswordVisible,
    isLoading,
    error,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleRegister,
  };
}