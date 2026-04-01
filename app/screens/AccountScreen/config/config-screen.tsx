import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { Switch } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import styles from './StylesConfig';
import colors from '~/constants/colors';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { Components } from '~/components';

const SwitchComponent = () => {
  const [notificationsChecked, setNotificationsChecked] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);

  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);

  function Deslogar() {
    router.replace('/');
  }

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Notificações
    const { status: notificationStatus } = await Notifications.getPermissionsAsync();
    const notificationGranted = notificationStatus === 'granted';
    setNotificationsAllowed(notificationGranted);
    setNotificationsChecked(notificationGranted);

    // Localização
    const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
    const locationGranted = locationStatus === 'granted';
    setLocationAllowed(locationGranted);
    setLocationChecked(locationGranted);
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setNotificationsAllowed(granted);
      setNotificationsChecked(granted);
      if (!granted) {
        Alert.alert(
          'Permissão Necessária',
          'Ative as notificações nas configurações do dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else {
      Alert.alert(
        'Desativar Notificações',
        'As notificações precisam ser desativadas manualmente nas configurações do dispositivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handleToggleLocation = async (value: boolean) => {
    if (value) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setLocationAllowed(granted);
      setLocationChecked(granted);
      if (!granted) {
        Alert.alert(
          'Permissão Necessária',
          'Ative a localização nas configurações do dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else {
      Alert.alert(
        'Desativar Localização',
        'A localização precisa ser desativada manualmente nas configurações do dispositivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Components.BackButton />
      <View style={styles.Topo}></View>

      {/* Notificações */}
      <View style={styles.opcao}>
        <View>
          <Text style={styles.text}>Permitir Notificações</Text>
          {!notificationsAllowed && (
            <Text style={{ color: 'red', fontSize: 12 }}>
              As notificações estão desativadas no dispositivo
            </Text>
          )}
        </View>

        <Switch
          value={notificationsChecked}
          onValueChange={handleToggleNotifications}
          thumbColor={notificationsChecked ? colors.branco : colors.branco}
          trackColor={{ false: colors.cinza, true: colors.amareloClaro }}
        />
      </View>

      {/* Localização */}
      <View style={styles.opcao}>
        <View>
          <Text style={styles.text}>Permitir Localização</Text>
          {!locationAllowed && (
            <Text style={{ color: 'red', fontSize: 12 }}>
              A localização está desativada no dispositivo
            </Text>
          )}
        </View>

        <Switch
          value={locationChecked}
          onValueChange={handleToggleLocation}
          thumbColor={locationChecked ? colors.branco : colors.branco}
          trackColor={{ false: colors.cinza, true: colors.amareloClaro }}
        />
      </View>

      <TouchableOpacity style={styles.opcao} onPress={Deslogar}>
        <Text style={{ color: 'white' }}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SwitchComponent;
