import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const deleteCarById = async (carroId: string): Promise<void> => {
  if (!carroId) throw new Error('ID do carro inválido.');

  const uid = await AsyncStorage.getItem('userId');
  if (!uid) throw new Error('Usuário não encontrado.');

  await firebase.firestore()
    .collection('Locatarios')
    .doc(uid)
    .collection('carros')
    .doc(carroId)
    .delete();
};
export default deleteCarById;