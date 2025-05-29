import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '~/config/firebase'; // ajuste o caminho conforme sua estrutura
import { CardData } from '~/types/Card';



export const fetchCards = async (): Promise<CardData[] | null> => {
  try {
    const uid = await AsyncStorage.getItem('userId');

    if (uid) {
      const snapshot = await firebase.firestore()
        .collection('Locatarios')
        .doc(uid)
        .collection('cartoes')
        .get();

      const cardsData: CardData[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          cartaoNumero: data.cartaoNumero || '',
          cartaoData: data.cartaoData || '',
          cardNome: data.cartaoNome || '',
          expiryDate: data.expiryDate || '',  // Se tiver campo específico para validade
          cvv: data.cvv || '',
        };
      });

      return cardsData;
    }

    return null; // Caso não encontre o UID
  } catch (error) {
    console.error('Erro ao buscar os cartões:', error);
    return null;
  }
};
