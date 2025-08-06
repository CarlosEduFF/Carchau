import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '~/config/firebase'; // ajuste conforme seu projeto
import { Avaliacao } from '~/types/Evalue';



export const fetchAvaliacoes = async (userId: string): Promise<Avaliacao[]> => {
  try {
    const locatariosRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(userId)
      .collection('avaliacoes');

    const snapshot = await locatariosRef.get();

    const avaliacoes: Avaliacao[] = snapshot.docs.map((doc: { data: () => any; id: any; }) => {
      const data = doc.data();
      return {
        id: doc.id,
        nome: data.nome || '',
        avaliacao: data.avaliacao || '',
        estrelas: data.estrelas || 0,
        fotoPerfil: data.fotoPerfil || '',
      };
    });

    return avaliacoes;
  } catch (error) {
    console.error('Erro ao buscar avaliações: ', error);
    throw error;
  }
};

type SalvarAvaliacaoPLocadorParams = {
  locatarioId: string;
  soliciId: string;
  nome: string | null;
  text: string;
  rating: number;
  estadoavaliLD: string;
  perfilImage: string | null;
  setLoading: (loading: boolean) => void;
  setModalSucesso: (visible: boolean) => void;
  setModalErro: (visible: boolean) => void;
};

export const salvarAvaliacaoPLocador = async ({
  locatarioId,
  soliciId,
  nome,
  text,
  rating,
  estadoavaliLD,
  perfilImage,
  setLoading,
  setModalSucesso,
  setModalErro
}: SalvarAvaliacaoPLocadorParams) => {
  try {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) throw new Error("Usuário não encontrado. Faça login novamente.");

    const soliciRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('solicitacoes')
      .doc(soliciId);

    const dataToUpdate = {
      'status.estadoavaliLD': estadoavaliLD,
    };

    let fotoPerfilURL: string | null = null;

    if (perfilImage) {
      const response = await fetch(perfilImage);
      const blob = await response.blob();
      const storageRef = firebase.storage().ref().child(`imagemPerfil/${uid}`);
      const snapshot = await storageRef.put(blob);
      fotoPerfilURL = await snapshot.ref.getDownloadURL();
    }

    await firebase
      .firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('avaliacoes')
      .add({
        nome,
        avaliacao: text,
        estrelas: rating,
        fotoPerfil: fotoPerfilURL || null,
      });

    await soliciRef.update(dataToUpdate);

    setLoading(false);
    setModalSucesso(true);
    console.log('Avaliação enviada com sucesso!');
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    setLoading(false);
    setModalErro(true);
  }
};

type SaveAvaliacaoLocatarioParams = {
  locadorId: string;
  locatarioId: string;
  soliciId: string;
  carroId: string;
  nome: string | null;
  text: string;
  rating: number;
  estadoavaliLT: string;
  perfilImage: string | null;
  setLoading: (loading: boolean) => void;
  setModalSucesso: (visible: boolean) => void;
  setModalErro: (visible: boolean) => void;
};

export const saveAvaliacaoLocatario = async ({
  locadorId,
  locatarioId,
  soliciId,
  carroId,
  nome,
  text,
  rating,
  estadoavaliLT,
  perfilImage,
  setLoading,
  setModalSucesso,
  setModalErro,
}: SaveAvaliacaoLocatarioParams) => {
  try {
    setLoading(true);

    const uid = await AsyncStorage.getItem('userId');
    if (!uid) throw new Error("Usuário não encontrado. Faça login novamente.");

    const soliciRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('solicitacoes')
      .doc(soliciId);

    const dataToUpdate = {
      'status.estadoavaliLT': estadoavaliLT,
    };

    let fotoPerfilURL: string | null = null;

    if (perfilImage) {
      const response = await fetch(perfilImage);
      const blob = await response.blob();
      const storageRef = firebase.storage().ref().child(`imagemPerfil/${uid}`);
      const snapshot = await storageRef.put(blob);
      fotoPerfilURL = await snapshot.ref.getDownloadURL();
    }

    await firebase
      .firestore()
      .collection('Locatarios')
      .doc(locadorId)
      .collection('carros')
      .doc(carroId)
      .collection('avaliacoes')
      .add({
        nome,
        avaliacao: text,
        estrelas: rating,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
        fotoPerfil: fotoPerfilURL || null,
      });

    const avaliacoesSnapshot = await firebase
      .firestore()
      .collection('Locatarios')
      .doc(locadorId)
      .collection('carros')
      .doc(carroId)
      .collection('avaliacoes')
      .get();

    const avaliacoes = avaliacoesSnapshot.docs
      .map(doc => Number(doc.data().estrelas))
      .filter(n => !isNaN(n));

    const novaNota =
      avaliacoes.length > 0
        ? parseFloat((avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1))
        : 0;

    await firebase
      .firestore()
      .collection('Locatarios')
      .doc(locadorId)
      .collection('carros')
      .doc(carroId)
      .update({ nota: novaNota });

    await soliciRef.update(dataToUpdate);

    setLoading(false);
    setModalSucesso(true);
    console.log('Avaliação enviada com sucesso!');
  } catch (error) {
    console.error("Erro ao salvar avaliação: ", error);
    setModalErro(true);
    setLoading(false);
  }
};