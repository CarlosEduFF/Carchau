import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EnderecoData {
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export const fetchEndereco = async (id?: string): Promise<EnderecoData | null> => {
    try {
        const uid = id || await AsyncStorage.getItem('userId');
        if (!uid) {
            console.error('Usuário não encontrado.');
            return null;
        }

        const enderecoSnapshot = await firebase
            .firestore()
            .collection('Locatarios')
            .doc(uid)
            .collection('endereco')
            .get();

        if (!enderecoSnapshot.empty) {
            const enderecoDoc = enderecoSnapshot.docs[0];
            const data = enderecoDoc.data();

            const enderecoData: EnderecoData = {
                cep: data.cep || '',
                endereco: data.endereco || '',
                numero: data.numero || '',
                complemento: data.complemento || '',
                bairro: data.bairro || '',
                cidade: data.cidade || '',
                estado: data.estado || '',
            };

            return enderecoData;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        return null;
    }
};

