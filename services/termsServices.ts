import firebase from '~/config/firebase';
import { TermoData } from '~/types/Term';



export const fetchLatestTermo = async (userId: string): Promise<TermoData | null> => {
  try {
    const termosSnapshot = await firebase.firestore()
      .collection('Locatarios')
      .doc(userId)
      .collection('termos')
      .orderBy('dataAceitacao', 'desc')
      .limit(1)
      .get();

    if (!termosSnapshot.empty) {
      const data = termosSnapshot.docs[0].data();

      return {
        termoAceito: data.termoAceito ?? false,
        coletaAceito: data.coletaAceito ?? false,
        dataAceitacao: data.dataAceitacao ?? null,
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar dados do termo:', error);
    throw error;
  }
};
