
import { Link, Stack } from 'expo-router';
import { HeaderButton } from '~/components/HeaderButton';
import React from 'react';


export default function Layout() {
  return (

    
    <Stack>
      <Stack.Screen
              name="App"
              options={{
                headerShown: false, // Esconde completamente o header
              }}
            />

    </Stack>
  ); 
}
