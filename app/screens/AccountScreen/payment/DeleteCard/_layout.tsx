
import { Link, Stack } from 'expo-router';
import { HeaderButton } from '~/components/HeaderButton';
import React from 'react';


export default function Layout() {
  return (

    
    <Stack>
      <Stack.Screen name="deletecard" options={{ 
        title: 'Visualizar Cartão',  
         headerTintColor: "#fff", 
         navigationBarColor: '#022036', 
         headerTransparent: true,
         headerLeft: () => (
          <Link href="/screens/AccountScreen/payment/ViewCardList/card-list" asChild>
            <HeaderButton />
          </Link>
      ),    
      }} />

    </Stack>
  ); 
}
