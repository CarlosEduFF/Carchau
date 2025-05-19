
import { Link, Stack } from 'expo-router';
import { HeaderButton } from '~/components/HeaderButton';
import React from 'react';


export default function Layout() {
  return (

    
    <Stack>
      <Stack.Screen name="evaluate" options={{ 
        title: 'Avalie a Solicitação',  
         headerTintColor: "#fff", 
         navigationBarColor: '#022036', 
         headerTransparent: true,
         headerLeft: () => (
          <Link href="/(tabs)/activity" asChild>
            <HeaderButton />
          </Link>
      ),    
      }} />

    </Stack>
  ); 
}
