
import { Link, Stack } from 'expo-router';
import { HeaderButton } from '~/components/HeaderButton';
import React from 'react';
import { routes } from '~/constants/routes';


export default function Layout() {
  return (

    
    <Stack>
      <Stack.Screen name="add-location" options={{ 
        title: 'Adicionar Veículo',  
         headerTintColor: "#fff", 
         navigationBarColor: '#022036', 
         headerTransparent: true,
         headerLeft: () => (
          <Link href={routes.viewLocation} asChild>
            <HeaderButton />
          </Link>
      ),    
      }} />

    </Stack>
  ); 
}
