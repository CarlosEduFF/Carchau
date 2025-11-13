// index.tsx (Root sem telas de carregamento)
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import App from './screens/AppScreen/App';

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

  const loadKey = useCallback(async () => {
    try {
      const key = await fetchPublishableKey();
      setPublishableKey(key);
    } catch (err: any) {
      console.warn('[Stripe] Could not fetch publishable key:', err?.message || err);
      // fallback DEV apenas — remova em prod
      if (__DEV__) {
        setPublishableKey('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');
      }
    }
  }, []);

  useEffect(() => {
    loadKey();
  }, [loadKey]);

  return (
    <SafeAreaProvider>
      {publishableKey ? (
        <StripeProvider publishableKey={publishableKey} urlScheme="carchau">
          <App />
        </StripeProvider>
      ) : (
        // Enquanto não carrega, apenas renderiza o app SEM Stripe (funciona normal)
        <App />
      )}
    </SafeAreaProvider>
  );
};

export default Root;
