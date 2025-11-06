// services/CnhService/CnhService.ts
import { Cnh } from '~/types/index';
import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// normaliza para 'valido' | 'invalido' | null (DB usa 'valido'/'invalido')
const normalizeCnhValida = (value: any): 'valido' | 'invalido' | null => {
  if (value === null || typeof value === 'undefined') return null;
  const str = String(value).trim().toLowerCase();
  if (str === 'valido' || str === 'válido' || str === 'aprovado') return 'valido';
  if (str === 'invalido' || str === 'inválido' || str === 'reprovado') return 'invalido';
  return null;
};

/**
 * Busca o documento em um caminho específico e retorna data se existir.
 */
const getDocAtPath = async (uid: string, collectionName: string, docName: string) => {
  try {
    const ref = firebase.firestore().collection('Locatarios').doc(uid).collection(collectionName).doc(docName);
    const snap = await ref.get();
    return snap.exists ? snap.data() || {} : null;
  } catch (e) {
    console.debug('[fetchCnhData] erro getDocAtPath', collectionName, docName, e);
    return null;
  }
};

export const fetchCnhData = async (): Promise<Cnh | null> => {
  try {
    const uid = await AsyncStorage.getItem('userId');

    if (!uid) {
      console.warn('Usuário não encontrado no AsyncStorage.');
      return null;
    }

    // Primeiro tenta o caminho exato atual (com maiúsculas)
    let data = await getDocAtPath(uid, 'Documentos', 'CNH');

    // Se não existir nesse caminho, tenta fallback para minúsculas
    if (!data) {
      console.debug('[fetchCnhData] não encontrou em Documentos/CNH, tentando documentos/cnh');
      data = await getDocAtPath(uid, 'documentos', 'cnh');
    }

    if (!data) {
      console.warn('Documento de CNH não encontrado em nenhum dos paths esperados.');
      return null;
    }

    console.debug('[fetchCnhData] raw data:', data);

    return {
      fotoFront: data?.fotoFront || null,
      fotoBack: data?.fotoBack || null,
      cnhvalida: normalizeCnhValida(data?.cnhvalida ?? null),
    };
  } catch (error) {
    console.error('Erro ao buscar dados da CNH:', error);
    return null;
  }
};
