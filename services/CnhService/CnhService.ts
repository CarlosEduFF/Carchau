import { Cnh } from '~/types/index';
import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const fetchCnhData = async (): Promise<Cnh | null> => {
  try {
    const uid = await AsyncStorage.getItem('userId');

    if (!uid) {
      console.warn('Usuário não encontrado no AsyncStorage.');
      return null;
    }

    const doc = await firebase
      .firestore()
      .collection('Locatarios')
      .doc(uid)
      .collection('documentos')
      .doc('cnh')
      .get();

    if (doc.exists) {
      const data = doc.data();
      return {
        fotoFront: data?.fotoFront || null,
        fotoBack: data?.fotoBack || null,
      };
    } else {
      console.warn('Documento de CNH não encontrado.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar dados da CNH:', error);
    return null;
  }
};
