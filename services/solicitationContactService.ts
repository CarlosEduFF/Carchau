import firebase from '../config/firebase'; // Ajuste para o caminho correto
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SolicitacaoContato } from '../types/Contato';
import contatoService from '~/services/contactCreateService'; // Se quiser integrar com o serviço de contatos

const solicitacaoService = {
  /**
   * Escuta em tempo real as solicitações aceitas do usuário logado.
   * @param callback Função que recebe a lista de solicitações aceitas.
   * @returns Função para cancelar o listener (unsubscribe).
   */
  async listenSolicitacoesAceitas(
    callback: (solicitacoes: SolicitacaoContato[]) => void
  ) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não está logado.');
      }

      const solicitacoesRef = firebase
        .firestore()
        .collection(`Locatarios/${userId}/solicitacoes`)
        .where('estado', '==', 'Aceito');

      const unsubscribe = solicitacoesRef.onSnapshot(async (snapshot) => {
        const solicitacoesPromises = snapshot.docs.map(async (doc) => {
          const data = doc.data();

          if (data.locadorId === userId || data.locatarioId === userId) {
            const solicitacao: SolicitacaoContato = {
              id: doc.id,
              locadorId: data.locadorId,
              locatarioId: data.locatarioId,
              locatarionome: data.locatarionome,
              locatarioperfilImage: data.locatarioperfilImage || null,
              locadornome: data.locadornome,
              locadorperfilImage: data.locadorperfilImage || null,
              estado: data.estado,
            };

            // 👉 Verifica ou cria o contato na coleção 'Contatos'
            await contatoService.verificarOuCriarContato(solicitacao);

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
  },
};

export default solicitacaoService;
