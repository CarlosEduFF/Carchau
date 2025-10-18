import firebase from '~/config/firebase';
import { Avaliacao } from '~/types/Evalue/Evalue';

export const fetchEvalueByCar = async (
  locadorId: string,
  carroId: string
): Promise<Avaliacao[]> => {
  try {
    const avaliacoesRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(locadorId)
      .collection('carros')
      .doc(carroId)
      .collection('avaliacoes');

    const snapshot = await avaliacoesRef.get();

    const avaliacoes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nome: data.nome || '',
        avaliacao: data.avaliacao || '',
        estrelas: data.estrelas || 0,
        fotoPerfil: data.fotoPerfil || '',
      } as Avaliacao;
    });

    return avaliacoes;
  } catch (error) {
    console.error('Erro ao buscar avaliações: ', error);
    throw new Error('Erro ao buscar avaliações.');
  }
};
