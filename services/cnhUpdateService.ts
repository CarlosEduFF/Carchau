// services/CnhService/CnhService.ts
import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UploadCNHResponse {
  success: boolean;
  message: string;
}

type CnhValidaType = 'valido' | 'invalido' | null;

/** Normaliza para 'valido'|'invalido'|null (aceita boolean/string/number) */
const normalizeCnhValida = (value: any): CnhValidaType => {
  if (value === null || typeof value === 'undefined') return null;
  if (value === true) return 'valido';
  if (value === false) return 'invalido';
  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();
    if (lower === 'valido' || lower === 'válido' || lower === 'aprovado' || lower === 'aceito') return 'valido';
    if (lower === 'invalido' || lower === 'inválido' || lower === 'reprovado' || lower === 'recusado') return 'invalido';
  }
  if (typeof value === 'number') {
    if (value === 1) return 'valido';
    if (value === 0) return 'invalido';
  }
  return null;
};

/**
 * Faz upload das imagens (front/back) da CNH e grava/atualiza o documento
 * Locatarios/{uid}/Documentos/CNH
 *
 * Nota: cnhValida aceita boolean|string|undefined para maior compatibilidade com a UI.
 */
export const uploadAndSaveCNH = async (
  frontCNH: string | null,
  backCNH: string | null,
  cnhValida?: boolean | string | null // mais permissivo
): Promise<UploadCNHResponse> => {
  try {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) {
      return { success: false, message: 'Usuário não encontrado. Faça login novamente.' };
    }

    const updateData: { fotoFront?: string; fotoBack?: string; cnhvalida?: CnhValidaType; updatedAt?: any } = {};

    const uploadImage = async (imageUri: string, imageType: 'front' | 'back') => {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = firebase.storage().ref().child(`cnh/${uid}/${imageType}`);
      const snapshot = await storageRef.put(blob);
      return await snapshot.ref.getDownloadURL();
    };

    if (frontCNH) {
      const frontUrl = await uploadImage(frontCNH, 'front');
      updateData.fotoFront = frontUrl;
    }
    if (backCNH) {
      const backUrl = await uploadImage(backCNH, 'back');
      updateData.fotoBack = backUrl;
    }

    const documentRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(uid)
      .collection('Documentos')
      .doc('CNH');

    const docSnapshot = await documentRef.get();

    let existingFront: string | undefined;
    let existingBack: string | undefined;
    let existingCnhValida: any = null;

    if (docSnapshot.exists) {
      const data = docSnapshot.data() as any;
      existingFront = data?.fotoFront;
      existingBack = data?.fotoBack;
      existingCnhValida = data?.cnhvalida ?? null;
    } else {
      console.debug('[uploadAndSaveCNH] documento CNH não existe ainda para uid:', uid);
    }

    // Decide o valor de cnhvalida:
    let finalCnhValida: CnhValidaType = null;

    if (typeof cnhValida !== 'undefined') {
      // normaliza qualquer entrada (boolean, string, number)
      finalCnhValida = normalizeCnhValida(cnhValida);
    } else {
      // inferimos 'valido' somente se existirem BOTH (atualizados agora ou já existentes)
      const frontExists = Boolean(updateData.fotoFront || existingFront);
      const backExists = Boolean(updateData.fotoBack || existingBack);

      if (frontExists && backExists) {
        // <<< CORREÇÃO: quando ambas as imagens existem, inferir 'valido'
        finalCnhValida = 'valido';
      } else {
        // preserva valor anterior se existia (mantém histórico)
        finalCnhValida = normalizeCnhValida(existingCnhValida);
        // se preferir forçar pendente quando faltar imagem, use: finalCnhValida = null;
      }
    }

    updateData.cnhvalida = finalCnhValida;
    // opcional: registro de auditoria
    updateData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    // grava com merge para preservar outros campos
    await documentRef.set(updateData, { merge: true });

    return { success: true, message: 'CNH salva com sucesso!' };
  } catch (error) {
    console.error('Erro no upload da CNH:', error);
    return { success: false, message: 'Erro ao salvar CNH. Tente novamente!' };
  }
};
