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
