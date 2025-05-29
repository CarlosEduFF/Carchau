import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UploadCNHResponse {
    success: boolean;
    message: string;
}

export const uploadAndSaveCNH = async (
    frontCNH: string | null,
    backCNH: string | null
): Promise<UploadCNHResponse> => {
    try {
        const uid = await AsyncStorage.getItem('userId');
        if (!uid) {
            return {
                success: false,
                message: 'Usuário não encontrado. Faça login novamente.',
            };
        }

        const updateData: { fotoFront?: string; fotoBack?: string } = {};

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
