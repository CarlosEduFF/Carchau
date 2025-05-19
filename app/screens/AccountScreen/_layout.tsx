import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar'; // Componente para gerenciar a barra de status

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function Layout() {
  return (
    <>
      {/* Configuração global da barra de status */}
      <StatusBar style="light" backgroundColor="#000" />

      <Stack>
        <Stack.Screen name="profile" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="address" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="cnh" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="payment" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="location" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="terms" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="config" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="report" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />
      </Stack>
    </>
  );
}