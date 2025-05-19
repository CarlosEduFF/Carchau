import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>A tela não foi encontrada!</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Vá para a tela inicial!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#022036',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  link: {
    marginTop: 16,
    paddingVertical: 16,
  },
  linkText: {
    fontSize: 14,
    
    color: '#F2A51A'
  },
});
