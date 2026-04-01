import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LoadingProvider, useLoading } from '~/context/LoadingContext';
import { Components } from '~/components';
import { View } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index',
};

function AppContent() {
  const { loading } = useLoading();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="transparent" translucent={true} />
      <Stack>
        <Stack.Screen name="index" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />
        <Stack.Screen name="(tabs)" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />
        <Stack.Screen name="+not-found" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />
        <Stack.Screen name="modal" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />
        <Stack.Screen name="screens" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />
      </Stack>
      {loading && <Components.LoadingCarAnimation loading={true} />}
    </View>
  );
}

export default function Layout() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}