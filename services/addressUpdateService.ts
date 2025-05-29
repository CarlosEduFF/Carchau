import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Endereco {
    cep: string;
    endereco: string;
    numero: string;
    complemento?: string | null;
    bairro: string;
    cidade: string;
    estado: string;
}

export const salvarOuAtualizarEndereco = async (dados: Endereco) => {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) throw new Error("Usuário não encontrado. Faça login novamente.");

    const locatariosRef = firebase.firestore().collection('Locatarios').doc(uid);
    const subcollectionRef = locatariosRef.collection('endereco');

    const enderecoSnapshot = await subcollectionRef.get();

    if (!enderecoSnapshot.empty) {
        const enderecoDocId = enderecoSnapshot.docs[0].id;
        await subcollectionRef.doc(enderecoDocId).update({
            ...dados,
            complemento: dados.complemento || null,
        });
    } else {
        await subcollectionRef.add({
            ...dados,
            complemento: dados.complemento || null,
        });
    }
};
