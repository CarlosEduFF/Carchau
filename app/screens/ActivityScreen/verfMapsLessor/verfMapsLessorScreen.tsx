import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { router, useLocalSearchParams } from 'expo-router';
import firebase from '../../../../config/firebase'; // Importação do Firebase Firestore
import styles from './StylesMapsLessor';
import { useLocationSync } from '~/services/mapsService';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal/CustomModal';

export default function VerfMapsLessorScreen() {
  const soliciIdParam = useLocalSearchParams()?.soliciId;
  const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
  const locadorIdParam = useLocalSearchParams()?.locadorId;
  const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
  const locatarioIdParam = useLocalSearchParams()?.locatarioId;
  const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
  const [modalVisible, setModalVisible] = useState(false);
  const [locatarioCoords, setLocatarioCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [situ, setSitu] = useState("");
  const { ownCoords, loading, approveLocation } = useLocationSync('locador', {
    soliciId: soliciId!,
    locadorId: locadorId!,
    locatarioId: locatarioId!
  }, (coords) => {
    setLocatarioCoords(coords); // Atualiza a localização do locatário
  });
  const [role, setRole] = useState<'locador' | 'locatario'>('locador');
  const handleAprovarLocalizacao = async () => {
    await approveLocation({
      ids: { locatarioId: locatarioId, soliciId: soliciId },
      role,
      setModalVisible,
      setSitu
    });
  };

  if (!ownCoords) {
    return (
      <View style={styles.container}>
        <LoadingCarAnimation loading={true} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: ownCoords.latitude,
          longitude: ownCoords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Locador (você) */}
        <Marker
          coordinate={ownCoords}
          title="Você (Locador)"
          description="Sua posição atual"
          pinColor="red"
        />

        {/* Locatário (se disponível) */}
        {locatarioCoords && (
          <Marker
            coordinate={{
              latitude: locatarioCoords.latitude + 0.00015,
              longitude: locatarioCoords.longitude,
            }}
            title="Locatário"
            description="Posição do locatário"
            pinColor="blue"
          />
        )}
      </MapView>

      <View style={styles.infoContainer}>
        <Text>Latitude: {ownCoords.latitude}</Text>
        <Text>Longitude: {ownCoords.longitude}</Text>
        <Button title="Aprovar Localização" onPress={handleAprovarLocalizacao} />
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message="A confirmação de localização do locatário foi realizada, a segurança de localização foi garantida."
        confirmText="Entendi"
        onConfirm={() => router.replace("/(tabs)/activity")}
      />

    </View>
  );
}