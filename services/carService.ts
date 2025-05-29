import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Carro } from '../types/Cars';


export const fetchCarroById = async (carroId: string): Promise<Carro | null> => {
  try {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) {
      throw new Error('Usuário não autenticado');
    }

    const carroDoc = await firebase.firestore()
      .collection('Locatarios')
      .doc(uid)
      .collection('carros')
      .doc(carroId)
      .get();

    if (carroDoc.exists) {
      const data = carroDoc.data();
      if (!data) return null;

      const carro: Carro = {
        id: carroDoc.id,
        modelo: data.modelo || '',
        marca: data.marca || '',
        quantidadeLugares: data.quantidadeLugares || '',
        pontoencontro: data.pontoencontro || '',
        precoDia: data.precoDia || 0,
        precoSemana: data.precoSemana || 0,
        precoMes: data.precoMes || 0,
        caucao: data.caucao || 0,
        nota: data.nota || '',
        primeiraFoto: Array.isArray(data.fotosCarro) && data.fotosCarro.length > 0 ? data.fotosCarro[0] : null,
        ano: data.ano || '',
        arCondicionado: data.arCondicionado || 'nao',
        cambio: data.cambio || 'manual',
        combustivel: data.combustivel || '',
        fotoLaud: data.fotoLaud || null,
        fotosCarro: data.fotosCarro || [],
        modalidadesAluguel: data.modalidadesAluguel || [],
        pdfDocumento: data.pdfDocumento || null,
        pdfNome: data.pdfNome || '',
        placa: data.placa || '',
        step: data.step || 'nao',
        airbags: data.airbags || 'nao',
      };

      return carro;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar dados do carro:', error);
    throw error;
  }
};
