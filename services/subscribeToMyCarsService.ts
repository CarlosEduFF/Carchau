import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Carro } from '../types/Cars';

export const subscribeToCarros = async (
  onUpdate: (carros: Carro[]) => void,
  onError: (error: any) => void
): Promise<() => void> => {
  try {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) {
      throw new Error('Usuário não autenticado');
    }

    const unsubscribe = firebase.firestore()
      .collection('Locatarios')
      .doc(uid)
      .collection('carros')
      .onSnapshot(
        snapshot => {
          const carros: Carro[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              modelo: data.modelo,
              marca: data.marca,
              quantidadeLugares: data.quantidadeLugares,
              pontoencontro: data.pontoencontro,
              precoDia: data.precoDia,
              precoSemana: data.precoSemana,
              precoMes: data.precoMes,
              nota: data.nota || '',
              primeiraFoto: Array.isArray(data.fotosCarro) && data.fotosCarro.length > 0 ? data.fotosCarro[0] : null,
              ano: data.ano,
              arCondicionado: data.arCondicionado,
              cambio: data.cambio,
              caucao: data.caucao,
              combustivel: data.combustivel,
              fotoLaud: data.fotoLaud,
              fotosCarro: data.fotosCarro || [],
              modalidadesAluguel: data.modalidadesAluguel || [],
              pdfDocumento: data.pdfDocumento,
              pdfNome: data.pdfNome,
              placa: data.placa,
              step: data.step,
              airbags: data.airbags,
            };
          });
          onUpdate(carros);
        },
        error => {
          onError(error);
        }
      );

    return unsubscribe;
  } catch (error) {
    onError(error);
    return () => {};
  }
};
