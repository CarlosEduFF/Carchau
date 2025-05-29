
import { Link, Stack } from 'expo-router';
import { HeaderButton } from '~/components/HeaderButton';
import React from 'react';
import { routes } from '~/constants/routes';


export default function Layout() {
  return (

    
    <Stack>
      <Stack.Screen name="deletecard" options={{ 
        title: 'Visualizar Cartão',  
         headerTintColor: "#fff", 
         navigationBarColor: '#022036', 
         headerTransparent: true,
         headerLeft: () => (
          <Link href={routes.viewCard} asChild>
            <HeaderButton />
          </Link>
      ),    
      }} />

    </Stack>
  ); 
}
