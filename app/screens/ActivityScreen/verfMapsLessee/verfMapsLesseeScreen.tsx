import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from '../../../../config/firebase';
import { useLocalSearchParams } from 'expo-router';
import { Button, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';


const VerfMapsLesseeScreen = () => {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [loading, setLoading] = useState(true);
    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

    const [locadorCoords, setLocadorCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    // 1. Captura a localização atual do locatário
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
                setLoading(false); // <- Isso estava faltando!
                await salvarLocalizacao(loc.coords);
                await buscarLocalizacaoLocador();
            }, 5000);

        };

        startLocationTracking();

        return () => clearInterval(locationWatcher);
    }, []);

    // 2. Salva a localização do locatário no Firestore
    const salvarLocalizacao = async (coords: { latitude: any; longitude: any; altitude?: number | null; accuracy?: number | null; altitudeAccuracy?: number | null; heading?: number | null; speed?: number | null; }) => {
        try {
            const docRef = firebase.firestore().collection('Localizacoes').doc(soliciId);
            await docRef.set({
                locatarioId: locatarioId,
                LocatarioLatitude: coords.latitude,
                LocatarioLongitude: coords.longitude,
                timestamp: new Date().toISOString(),
            }, { merge: true });
        } catch (error) {
            console.error('Erro ao salvar localização no Firestore:', error);
        }
    };

    // 3. Carrega a localização do locador do Firestore
    const buscarLocalizacaoLocador = async () => {
        try {
            const docRef = await firebase.firestore().collection('Localizacoes').doc(soliciId).get();
            const data = docRef.data();

            if (data?.LocadorLatitude && data?.LocadorLongitude) {
                setLocadorCoords({
                    latitude: data.LocadorLatitude,
                    longitude: data.LocadorLongitude,
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
                LocalizLocatarioAcei: true
            });


        } catch (error) {
            console.error("Erro ao salvar Localização Aprovada: ", error);
            alert('Erro ao salvar Localização Aprovada.');
        }
    }

    if (loading || !location) return <Text>Carregando localização do locatário...</Text>;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {/* Locatário */}
                <Marker coordinate={location} title="Você (Locatário)" pinColor="red" />

                {/* Locador (se disponível) */}
                {locadorCoords && (
                    <Marker coordinate={locadorCoords} title="Locador" pinColor="blue" />
                )}
            </MapView>

            <View style={styles.infoContainer}>
                <Text>Latitude: {location.latitude}</Text>
                <Text>Longitude: {location.longitude}</Text>
                <Button title="Aprovar Localização" onPress={() => AprovarLocalizacao()} />
            </View>
        </View>
    );
};

export default VerfMapsLesseeScreen;

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