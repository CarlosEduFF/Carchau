import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Upload de imagem
export const uploadImage = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(path);
    const snapshot = await ref.put(blob);
    return snapshot.ref.getDownloadURL();
};

// Upload de múltiplas imagens
export const uploadMultipleImages = async (uris: string[], path: string) => {
    const urls = [];
    for (const uri of uris) {
        const url = await uploadImage(
            uri,
            `${path}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        );
        urls.push(url);
    }
    return urls;
};

// Upload de PDF
export const uploadPDF = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(path);
    const snapshot = await ref.put(blob);
    return snapshot.ref.getDownloadURL();
};

// Atualizar dados do carro
export const updateCarData = async (uid: string, carroId: string, data: any) => {
    const carroRef = firebase.firestore()
        .collection('Locatarios')
        .doc(uid)
        .collection('carros')
        .doc(carroId);
    await carroRef.update(data);
};

// Obter UID
export const getUserId = async () => {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) throw new Error('Erro ao obter ID do usuário.');
    return uid;
};
