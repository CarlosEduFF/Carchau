import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import App from './screens/AppScreen/App';
import { Components } from '~/components';

const DEV_PUBLISHABLE_ENDPOINT = `https://carchau.onrender.com/stripe-publishable-key`;
const PUBLISHABLE_KEY_ENDPOINT = DEV_PUBLISHABLE_ENDPOINT;

const fetchPublishableKey = async () => {
  const res = await fetch(PUBLISHABLE_KEY_ENDPOINT);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json?.publishableKey) throw new Error('publishableKey missing');
  return json.publishableKey as string;
};

const Root: React.FC = () => {
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const loadKey = useCallback(async () => {
    try {
      const key = await fetchPublishableKey();
      setPublishableKey(key);
    } catch (err: any) {
      console.warn('[Stripe] Could not fetch publishable key:', err?.message || err);
      if (__DEV__) {
        setPublishableKey('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');
      }
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        // Redireciona para Home se já estiver logado
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    loadKey();
    checkAuth();
  }, [loadKey, checkAuth]);

  if (isCheckingAuth) {
    return (
      <SafeAreaProvider>
        <Components.LoadingCarAnimation loading={true} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {publishableKey ? (
        <StripeProvider publishableKey={publishableKey} urlScheme="carchau">
          <App />
        </StripeProvider>
      ) : (
        <App />
      )}
    </SafeAreaProvider>
  );
};

export default Root;
