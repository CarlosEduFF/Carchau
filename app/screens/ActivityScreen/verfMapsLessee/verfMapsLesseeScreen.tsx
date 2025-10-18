import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import styles from './StylesMapsLessee';
import { useLocationSync } from '~/services/mapsService';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal/CustomModal';


export default function VerfMapsLesseeScreen() {
    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
    const [modalVisible, setModalVisible] = useState(false);
    const [locadorCoords, setLocadorCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [situ, setSitu] = useState("");
    const { ownCoords, loading, approveLocation } = useLocationSync('locatario', {
        soliciId: soliciId!,
        locadorId: locadorId!,
        locatarioId: locatarioId!
    }, (coords) => {
        setLocadorCoords(coords); // Atualiza a localização do locador
    });
    const [role, setRole] = useState<'locador' | 'locatario'>('locatario');

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
                {/* Locatário */}
                <Marker coordinate={ownCoords} title="Você (Locatário)"
                    description="Sua posição atual"
                    pinColor="red" />

                {/* Locador (se disponível) */}
                {locadorCoords && (
                    <Marker
                        coordinate={{
                            latitude: locadorCoords.latitude + 0.00015,
                            longitude: locadorCoords.longitude,
                        }}
                        title="Locador"
                        description="Posição do locador"
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
                message="A confirmação de localização do locador foi realizada, a segurança de localização foi garantida."
                confirmText="Entendi"
                onConfirm={() => router.push("/(tabs)/activity")}
            />
        </View>
    );
};



