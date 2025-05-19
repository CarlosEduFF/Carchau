
import { Link, Stack } from 'expo-router';
import { HeaderButton } from '~/components/HeaderButton';
import React from 'react';


export default function Layout() {
  return (

    
    <Stack>
      <Stack.Screen name="loginScreen" options={{ 
        title: 'Login',  
         headerTintColor: "#fff", 
         navigationBarColor: '#022036', 
         headerTransparent: true,
         headerLeft: () => (
          <Link href="/" asChild>
            <HeaderButton />
          </Link>
      ),    
      }} />

    </Stack>
  ); 
}
