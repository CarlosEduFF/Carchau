import firebase from '~/config/firebase';
import { LocatarioDetails } from '~/types/Users/LesseeDetails';


// Service for All lessee registered
export const fetchLocatariosDetails = async (): Promise<LocatarioDetails[]> => {
  try {
    const locatariosSnapshot = await firebase.firestore().collection('Locatarios').get();

    const locatariosDetails = await Promise.all(
      locatariosSnapshot.docs.map(async (locatarioDoc) => {
        const detalhesSnapshot = await locatarioDoc.ref.collection('endereco').get();
        const detalhesData = detalhesSnapshot.docs.length > 0 ? detalhesSnapshot.docs[0].data() : {};

        return {
          id: locatarioDoc.id,
          nome: locatarioDoc.data().nome || '',
          fotoPerfil: locatarioDoc.data().fotoPerfil || '',
          endereco: detalhesData.endereco || 'Endereço não disponível',
          ref: locatarioDoc.ref,
        };
      })
    );

    return locatariosDetails;
  } catch (error) {
    console.error('Erro ao buscar detalhes dos locatários:', error);
    return [];
  }
};
