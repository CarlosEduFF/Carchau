// index.tsx (root)
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import App from './screens/AppScreen/App';
import { View, ActivityIndicator } from 'react-native';

// DEV: seu IP local (obtido via ipconfig). Em dev use http://<IP>:4242
const LOCAL_HOST_IP = '192.168.15.23';
const DEV_PUBLISHABLE_ENDPOINT = `http://${LOCAL_HOST_IP}:4242/stripe-publishable-key`;

// Em produção coloque sua URL segura (HTTPS)
const PROD_PUBLISHABLE_ENDPOINT = 'https://seu-backend-production.com/stripe-publishable-key';

// usa o endpoint adequado dependendo do ambiente
const PUBLISHABLE_KEY_ENDPOINT = __DEV__ ? DEV_PUBLISHABLE_ENDPOINT : PROD_PUBLISHABLE_ENDPOINT;

const Root: React.FC = () => {
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchKey = async () => {
      try {
        const res = await fetch(PUBLISHABLE_KEY_ENDPOINT, { method: 'GET' });
        if (!res.ok) throw new Error('Falha ao buscar publishable key do backend');
        const json = await res.json();
        if (mounted && json?.publishableKey) {
          // em dev, log para garantir que é pk_test_...
          if (__DEV__) console.log('[Stripe] publishableKey from backend:', json.publishableKey);
          setPublishableKey(json.publishableKey);
          return;
        }
      } catch (err) {
        console.warn('[Stripe] Could not fetch publishable key from backend:', (err as any)?.message);
      }

      // fallback opcional (somente dev) - use com cautela
      if (__DEV__ && mounted) {
        const FALLBACK_PUBLISHABLE_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';
        console.warn('[Stripe] Using fallback publishable key (dev only). Remove before prod.');
        setPublishableKey(FALLBACK_PUBLISHABLE_KEY);
      }
    };

    fetchKey().finally(() => {
      if (mounted) setLoadingKey(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (loadingKey) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!publishableKey) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StripeProvider
        publishableKey={publishableKey}
        
        urlScheme="carchau" // substitua pelo scheme do seu app (configurado no app.json/AndroidManifest/Info.plist)
      >
        <App />
      </StripeProvider>
    </SafeAreaProvider>
  );
};

export default Root;
