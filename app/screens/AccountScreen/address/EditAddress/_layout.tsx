
import { Link, Stack } from 'expo-router';
import { HeaderButton } from '~/components/HeaderButton';
import React from 'react';


export default function Layout() {
  return (

    
    <Stack>
      <Stack.Screen name="editaddress" options={{ 
        title: 'Endereço',  
         headerTintColor: "#fff", 
         navigationBarColor: '#022036', 
         headerTransparent: true,
         headerLeft: () => (
          <Link href="/screens/AccountScreen/address/ViewAddress/address" asChild>
            <HeaderButton />
          </Link>
      ),    
      }} />

    </Stack>
  ); 
}
