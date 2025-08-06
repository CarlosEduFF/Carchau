import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import firebase from '~/config/firebase'; // ajuste o caminho conforme seu projeto

export type Role = 'locador' | 'locatario';

export interface IDs {
  soliciId: string;
  locadorId: string;
  locatarioId: string;
}

export interface Coords {
  latitude: number;
  longitude: number;
}

export function useLocationSync(
  role: Role,
  ids: IDs,
  onOtherLocationChange?: (coords: Coords) => void
) {
  const [ownCoords, setOwnCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let canceled = false;
    const start = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada para acessar a localização.');
        return;
      }

      intervalRef.current = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({});
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        if (!canceled) {
          setOwnCoords(coords);
          setLoading(false);
          await saveLocation(role, ids, coords);
          const other = await fetchOtherLocation(role, ids);
          if (other && onOtherLocationChange) onOtherLocationChange(other);
        }
      }, 5000);
    };

    start();
    return () => {
      canceled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);



  type ApproveLocationParams = {
    ids: { locatarioId: string; soliciId: string };
    role: 'locador' | 'locatario';
    setModalVisible: (visible: boolean) => void;
    setSitu: (text: string) => void;
  };

  const approveLocation = async ({
    ids,
    role,
    setModalVisible,
    setSitu
  }: ApproveLocationParams) => {
    try {
      const isLocador = role === 'locador';
      const statusField = isLocador ? 'confirlocationlocador' : 'confirlocationlocatario';

      const ref = firebase.firestore()
        .collection('Locatarios') // Sempre salva no locatário
        .doc(ids.locatarioId)
        .collection('solicitacoes')
        .doc(ids.soliciId);

      await ref.update({
        [`status.${statusField}`]: "Localização aprovada",
      });

      setSitu("Localização aprovada com sucesso.");
      setModalVisible(true);

    } catch (err) {
      console.error('Erro ao aprovar localização:', err);
      setSitu("Ocorreu um erro ao salvar a confirmação de localização.");
      setModalVisible(true);
    }
  };





  return { ownCoords, loading, approveLocation };
}

async function saveLocation(role: Role, ids: IDs, coords: Coords) {
  const doc = firebase.firestore().collection('Localizacoes').doc(ids.soliciId);
  const data: any = { timestamp: new Date().toISOString() };
  if (role === 'locador') {
    data.locadorId = ids.locadorId;
    data.LocadorLatitude = coords.latitude;
    data.LocadorLongitude = coords.longitude;
  } else {
    data.locatarioId = ids.locatarioId;
    data.LocatarioLatitude = coords.latitude;
    data.LocatarioLongitude = coords.longitude;
  }
  await doc.set(data, { merge: true });
}

async function fetchOtherLocation(role: Role, ids: IDs): Promise<Coords | null> {
  const doc = await firebase.firestore().collection('Localizacoes').doc(ids.soliciId).get();
  const data = doc.data();
  if (role === 'locador') {
    if (data?.LocatarioLatitude && data?.LocatarioLongitude) {
      return { latitude: data.LocatarioLatitude, longitude: data.LocatarioLongitude };
    }
  } else {
    if (data?.LocadorLatitude && data?.LocadorLongitude) {
      return { latitude: data.LocadorLatitude, longitude: data.LocadorLongitude };
    }
  }
  return null;
}
