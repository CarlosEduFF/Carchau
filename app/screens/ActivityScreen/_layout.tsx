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
        <Stack.Screen name="adsScreen" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="scheduleScreen" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="soliciConfirmScreen" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="lessorRequiScreen" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="lesseeRequiScreen" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="viewProfile" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="pyCaucao" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="pyRent" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="verfLessee" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="verfLessor" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="evaluateLessor" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="evaluateLessee" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="verfMapsLessee" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />

        <Stack.Screen name="verfMapsLessor" options={{
          headerShown: false,
          navigationBarColor: '#022036'
        }} />
      </Stack>
    </>
  );
}
