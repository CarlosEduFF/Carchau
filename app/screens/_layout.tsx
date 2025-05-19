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
        <Stack.Screen name="auth" options={{
          headerShown: false,
          navigationBarColor: '#022036' // Apenas o navigationBarColor é mantido
        }} />


        <Stack.Screen name="AccountScreen" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="ActivityScreen" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="chat" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

      </Stack>
    </>
  );
}