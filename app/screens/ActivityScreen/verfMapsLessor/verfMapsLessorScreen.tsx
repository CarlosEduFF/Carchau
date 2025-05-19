import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import firebase from '../../../../utils/firebase'; // Importação do Firebase Firestore

export default function verfMapsLessorScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const soliciIdParam = useLocalSearchParams()?.soliciId;
  const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
  const locadorIdParam = useLocalSearchParams()?.locadorId;
  const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
  const locatarioIdParam = useLocalSearchParams()?.locatarioId;
  const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

  const [locatarioCoords, setLocatarioCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [watcher, setWatcher] = useState(null);


  useEffect(() => {
    let locationWatcher: ReturnType<typeof setInterval>;


    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada para acessar a localização.');
        return;
      }

      // Atualiza continuamente a localização
      locationWatcher = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        await salvarLocalizacao(loc.coords); // salva a cada atualização
        await buscarLocalizacaoLocatario();   // busca localização do locatário
      }, 5000); // a cada 5 segundos
    };

    startLocationTracking();

    return () => clearInterval(locationWatcher);
  }, []);

  const salvarLocalizacao = async (coords: { latitude: any; longitude: any; altitude?: number | null; accuracy?: number | null; altitudeAccuracy?: number | null; heading?: number | null; speed?: number | null; }) => {
    try {
      const docRef = firebase.firestore().collection('Localizacoes').doc(soliciId);
      await docRef.set({
        locadorId: locadorId,
        LocadorLatitude: coords.latitude,
        LocadorLongitude: coords.longitude,
        timestamp: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar localização no Firestore:', error);
    }
  };

  const buscarLocalizacaoLocatario = async () => {
    try {
      const docRef = await firebase.firestore().collection('Localizacoes').doc(soliciId).get();
      const data = docRef.data();

      if (data?.LocatarioLatitude && data?.LocatarioLongitude) {
        setLocatarioCoords({
          latitude: data.LocatarioLatitude,
          longitude: data.LocatarioLongitude,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar localização do locatário:', error);
    }
  };

  const AprovarLocalizacao = async () => {
    try {

      const LocaliRef = firebase.firestore()
        .collection('Locatarios')
        .doc(locatarioId)
        .collection('solicitacoes').doc(soliciId);

      await LocaliRef.update({
        LocalizLocadorAcei: true
      });


    } catch (error) {
      console.error("Erro ao salvar Localização Aprovada: ", error);
      alert('Erro ao salvar Localização Aprovada.');
    }
  }

  if (!location) return <Text>Carregando localização...</Text>;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} title="Você (Locador)" pinColor="red" />
        {locatarioCoords && (
          <Marker coordinate={locatarioCoords} title="Locatário" pinColor="blue" />
        )}
      </MapView>

      <View style={styles.infoContainer}>
        <Text>Latitude: {location.latitude}</Text>
        <Text>Longitude: {location.longitude}</Text>
        <Button title="Aprovar Localização" onPress={() => AprovarLocalizacao()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022036',
    padding: 20,
  },
  map: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.4,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 8,
  },
});