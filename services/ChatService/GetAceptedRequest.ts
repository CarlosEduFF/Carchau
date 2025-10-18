import AsyncStorage from "@react-native-async-storage/async-storage";
import { SolicitacaoContato } from "~/types";
import firebase from "~/config/firebase";
import { verifyOrCreateContact } from "./VerifyOrCreateContactService";
/**
   * Escuta as solicitações aceitas e cria automaticamente os contatos.
   */
export async function GetAceptedRequest(
    callback: (solicitacoes: SolicitacaoContato[]) => void
  ) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não está logado.');

      const solicitacoesRef = firebase
        .firestore()
        .collection(`Locatarios/${userId}/solicitacoes`)
        .where('estado', '==', 'Aceito');

      const unsubscribe = solicitacoesRef.onSnapshot(async (snapshot) => {
        const solicitacoesPromises = snapshot.docs.map(async (doc) => {
          const data = doc.data();

          if (data.locadorId === userId || data.locatarioId === userId) {
            const [id1, id2] = [data.locadorId, data.locatarioId].sort();
            const chatId = `${id1}_${id2}`;

            const solicitacao: SolicitacaoContato = {
              id: chatId,
              locadorId: data.locadorId,
              locatarioId: data.locatarioId,
              locatarionome: data.locatarionome,
              locatarioperfilImage: data.locatarioperfilImage || null,
              locadornome: data.locadornome,
              locadorperfilImage: data.locadorperfilImage || null,
              estado: data.estado,
            };

            await verifyOrCreateContact(solicitacao);

            return solicitacao;
          }
          return null;
        });

        const solicitacoesAceitas = await Promise.all(solicitacoesPromises);

        const filtradas = solicitacoesAceitas.filter(
          (item): item is SolicitacaoContato => item !== null
        );

        callback(filtradas);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Erro ao escutar solicitações aceitas:', error);
      throw error;
    }
  }