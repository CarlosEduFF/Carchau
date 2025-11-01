import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UploadCNHResponse {
    success: boolean;
    message: string;
}

/**
 * Faz upload das imagens (front/back) da CNH para o Storage e grava/atualiza o documento
 * Locatarios/{uid}/documentos/cnh com os campos:
 *  - fotoFront?: string
 *  - fotoBack?: string
 *  - cnhvalida: boolean
 *
 * Regras de cnhvalida:
 *  - se for passado explicitamente cnhValida, usamos esse valor
 *  - caso contrário, inferimos true somente se existirem BOTH (fotoFront && fotoBack)
 */
export const uploadAndSaveCNH = async (
    frontCNH: string | null,
    backCNH: string | null,
    cnhValida?: boolean // opcional: força o valor se fornecido
): Promise<UploadCNHResponse> => {
    try {
        const uid = await AsyncStorage.getItem('userId');
        if (!uid) {
            return {
                success: false,
                message: 'Usuário não encontrado. Faça login novamente.',
            };
        }

        const updateData: { fotoFront?: string; fotoBack?: string; cnhvalida?: boolean } = {};

        const uploadImage = async (imageUri: string, imageType: 'front' | 'back') => {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const storageRef = firebase
                .storage()
                .ref()
                .child(`cnh/${uid}/${imageType}`);
            const snapshot = await storageRef.put(blob);
            return await snapshot.ref.getDownloadURL();
        };

        // Faz upload se vierem imagens nesta chamada
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
            .collection('documentos')
            .doc('cnh');

        const docSnapshot = await documentRef.get();

        // Se o usuário já tem documento, precisamos combinar as imagens antigas (se existirem)
        let existingFront: string | undefined;
        let existingBack: string | undefined;

        if (docSnapshot.exists) {
            const data = docSnapshot.data() as any;
            existingFront = data?.fotoFront;
            existingBack = data?.fotoBack;
        }

        // Decide o valor de cnhvalida:
        let finalCnhValida: boolean;
        if (typeof cnhValida === 'boolean') {
            // se foi passado explicitamente, respeitamos
            finalCnhValida = cnhValida;
        } else {
            // caso contrário, inferimos true somente se BOTH existirem (quer vindos antes, quer enviados agora)
            const frontExists = Boolean(updateData.fotoFront || existingFront);
            const backExists = Boolean(updateData.fotoBack || existingBack);
            finalCnhValida = frontExists && backExists;
        }

        updateData.cnhvalida = finalCnhValida;

        if (docSnapshot.exists) {
            await documentRef.update(updateData);
        } else {
            await documentRef.set(updateData);
        }

        return {
            success: true,
            message: 'CNH salva com sucesso!',
        };
    } catch (error) {
        console.error('Erro no upload da CNH:', error);
        return {
            success: false,
            message: 'Erro ao salvar CNH. Tente novamente!',
        };
    }
};
