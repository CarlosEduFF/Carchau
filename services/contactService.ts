import firebase from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SolicitacaoContato } from '../types/Contact';

const contactService = {
  async criarOuBuscarChat(
    locadorId: string,
    locatarioId: string,
    locadornome: string,
    locadorperfilImage: string | null,
    locatarionome: string,
    locatarioperfilImage: string | null
  ) {
    try {
      const [id1, id2] = [locadorId, locatarioId].sort(); // ordena os dois
      const chatId = `${id1}_${id2}`;

      await contactService.criarOuAtualizarContato({
        locadorId,
        locatarioId,
        locadornome,
        locadorperfilImage,
        locatarionome,
        locatarioperfilImage,
      });

      return chatId;
    } catch (error) {
      console.error('Erro ao criar ou buscar chat:', error);
      throw error;
    }
  },

  /**
   * Escuta em tempo real os contatos do usuário logado.
   */
  async listenContatos(
    callback: (contatos: SolicitacaoContato[]) => void
  ) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não está logado.');

      const contatosLocadorRef = firebase
        .firestore()
        .collection('Contatos')
        .where('locadorId', '==', userId);

      const contatosLocatarioRef = firebase
        .firestore()
        .collection('Contatos')
        .where('locatarioId', '==', userId);

      let contatosLocador: SolicitacaoContato[] = [];
      let contatosLocatario: SolicitacaoContato[] = [];

      const mergeAndSend = () => {
        const todosContatos = [...contatosLocador, ...contatosLocatario];
        const contatosUnicos = todosContatos.filter(
          (contato, index, self) =>
            index === self.findIndex((c) => c.id === contato.id)
        );
        callback(contatosUnicos);
      };

      const unsubscribeLocador = contatosLocadorRef.onSnapshot((snapshot) => {
        contatosLocador = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as SolicitacaoContato));
        mergeAndSend();
      });

      const unsubscribeLocatario = contatosLocatarioRef.onSnapshot((snapshot) => {
        contatosLocatario = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as SolicitacaoContato));
        mergeAndSend();
      });

      return () => {
        unsubscribeLocador();
        unsubscribeLocatario();
      };
    } catch (error) {
      console.error('Erro ao escutar contatos:', error);
      throw error;
    }
  },




  /**
   * Escuta as solicitações aceitas e cria automaticamente os contatos.
   */
  async listenSolicitacoesAceitas(
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

            // ✅ Garante que o contato existe
            await contactService.verificarOuCriarContato(solicitacao);

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

  async criarOuAtualizarContato({
    locadorId,
    locatarioId,
    locadornome,
    locadorperfilImage,
    locatarionome,
    locatarioperfilImage,
  }: {
    locadorId: string;
    locatarioId: string;
    locadornome: string;
    locadorperfilImage: string | null;
    locatarionome: string;
    locatarioperfilImage: string | null;
  }): Promise<string> {
    const [id1, id2] = [locadorId, locatarioId].sort(); // ordena os dois
    const chatId = `${id1}_${id2}`;

    const contatoRef = firebase.firestore().collection('Contatos').doc(chatId);

    await firebase.firestore().runTransaction(async (transaction) => {
      const doc = await transaction.get(contatoRef);

      if (!doc.exists) {
        transaction.set(contatoRef, {
          id: chatId,
          locadorId,
          locatarioId,
          locadornome,
          locadorperfilImage: locadorperfilImage || null,
          locatarionome,
          locatarioperfilImage: locatarioperfilImage || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        transaction.set(
          contatoRef,
          {
            locadornome,
            locadorperfilImage: locadorperfilImage || null,
            locatarionome,
            locatarioperfilImage: locatarioperfilImage || null,
          },
          { merge: true }
        );
      }
    });

    return chatId;
  },

  async verificarOuCriarContato(solicitacao: SolicitacaoContato) {
    try {
      await contactService.criarOuAtualizarContato({
        locadorId: solicitacao.locadorId,
        locatarioId: solicitacao.locatarioId,
        locadornome: solicitacao.locadornome,
        locadorperfilImage: solicitacao.locadorperfilImage || null,
        locatarionome: solicitacao.locatarionome,
        locatarioperfilImage: solicitacao.locatarioperfilImage || null,
      });
    } catch (error) {
      console.error('Erro ao verificar ou criar contato:', error);
      throw error;
    }
  }
}

export default contactService;
