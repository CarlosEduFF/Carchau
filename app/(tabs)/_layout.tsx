import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons';
import { HeaderButton } from '~/components/HeaderButton';
import { TabBarIcon } from '~/components/TabBarIcon';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F2A51A',
        tabBarInactiveTintColor: 'white',
        tabBarInactiveBackgroundColor: '#022036',
        tabBarActiveBackgroundColor: '#022036',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <HeaderButton onPress={() => console.log('Navigating to modal')} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: 'Atividade',
          headerTitleAlign: 'center',
          headerTintColor: '#F2A51A',
          headerStyle: { backgroundColor: '#022036' },
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contatos',
          headerTitleAlign: 'center',
          headerTintColor: '#F2A51A',
          headerStyle: { backgroundColor: '#022036' },
          tabBarIcon: ({ color }) => (
            <FontAwesome name="wechat" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          headerTitleAlign: 'center',
          headerTintColor: '#F2A51A',
          headerStyle: { backgroundColor: '#022036' },
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  colorheader: {
    backgroundColor: '#022036',
  },
});
