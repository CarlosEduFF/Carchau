import firebase from "~/config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateUserData } from '~/utils/validators';  // ajuste o caminho conforme seu projeto

export const updateUserProfile = async (data: {
  nome: string;
  nacionalidade: string;
  telefone: string;
  email: string;
  profissao: string;
  sexo: 'Masculino' | 'Feminino';
  perfilImage?: string | undefined;
  selectedIndex?: number ;  // para validar aqui se quiser
}) => {
  // Se quiser validar aqui, precisa receber o selectedIndex ou validar pelo sexo
  if (data.selectedIndex !== undefined) {
    const isValid = validateUserData({
      nome: data.nome,
      nacionalidade: data.nacionalidade,
      telefone: data.telefone,
      email: data.email,
      profissao: data.profissao,
      selectedIndex: data.selectedIndex,
    });

    if (!isValid) {
      throw new Error('Dados inválidos. Preencha corretamente todos os campos.');
    }
  }

  const uid = await AsyncStorage.getItem('userId');
  if (!uid) {
    throw new Error('Usuário não encontrado. Faça login novamente.');
  }

  const userRef = firebase.firestore().collection('Locatarios').doc(uid);
  const userData: any = {
    nome: data.nome,
    nacionalidade: data.nacionalidade,
    telefone: data.telefone,
    email: data.email,
    sexo: data.sexo,
    profissao: data.profissao,
  };

  if (data.perfilImage) {
    const response = await fetch(data.perfilImage);
    const blob = await response.blob();

    const storageRef = firebase.storage().ref().child(`imagemPerfil/${uid}`);
    const snapshot = await storageRef.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();

    userData.fotoPerfil = downloadURL;
  }

  await userRef.set(userData, { merge: true });
};
