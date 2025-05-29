// services/cardService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '~/config/firebase';
/**
 * Deleta um cartão do usuário logado.
 * 
 * @param cardId - ID do cartão a ser deletado
 * @returns true se deletado com sucesso, false se houve erro
 */
export const deleteCard = async (cardId: string): Promise<boolean> => {
  try {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) {
      console.error('Erro: Usuário não encontrado.');
      return false;
    }

    await firebase.firestore()
      .collection('Locatarios')
      .doc(uid)
      .collection('cartoes')
      .doc(cardId)
      .delete();

    return true;
  } catch (error) {
    console.error('Erro ao deletar o cartão: ', error);
    return false;
  }
};
