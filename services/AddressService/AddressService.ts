import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddressData } from '~/types/';


export const fetchAddress = async (id?: string): Promise<AddressData | null> => {
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

            const enderecoData: AddressData = {
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

