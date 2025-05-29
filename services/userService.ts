import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '~/config/firebase'; // ajuste conforme seu caminho de configuração
import { UserData } from '~/types/User';



export const fetchUserData = async (): Promise<UserData | null> => {
  try {
    const uid = await AsyncStorage.getItem('userId');
    if (uid) {
      const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();

        if (userData) {
          return {
            nome: userData.nome || '',
            nacionalidade: userData.nacionalidade || '',
            telefone: userData.telefone || '',
            email: userData.email || '',
            sexo: userData.sexo === 'Masculino' ? 'Masculino' : 'Feminino',
            cpf: userData.cpf || '',
            profissao: userData.profissao || '',
            fotoPerfil: userData.fotoPerfil || '',
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
};
