import { useState } from 'react';
import { getToken } from '../api/ndsService';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const fetchToken = async () => {
    try {
      const newToken = await getToken();
      setToken(newToken);
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Ошибка при получении токена:', error);
    }
  };

  const setCustomToken = (customToken: string) => {
    setToken(customToken);
    localStorage.setItem('token', customToken);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return {
    token,
    fetchToken,
    setCustomToken,
    removeToken,
  };
};
