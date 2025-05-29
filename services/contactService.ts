import firebase from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SolicitacaoContato } from '../types/Contato';

const contatoService = {
  /**
   * Escuta em tempo real os contatos onde o usuário é locador ou locatário,
   * evitando contatos duplicados.
   * @param callback Função que recebe a lista de contatos atualizados.
   * @returns Função para cancelar os listeners (unsubscribe).
   */
  async listenContatos(
    callback: (contatos: SolicitacaoContato[]) => void
  ) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não está logado.');
      }

      const contatosRef = firebase.firestore().collection('Contatos');

      const processSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            locadorId: data.locadorId || '',
            locatarioId: data.locatarioId || '',
            locatarionome: data.locatarionome || '',
            locatarioperfilImage: data.locatarioperfilImage || null,
            locadornome: data.locadornome || '',
            locadorperfilImage: data.locadorperfilImage || null,
            estado: data.estado || '',
          } as SolicitacaoContato;
        });
      };

      // Variáveis para armazenar os contatos de cada listener
      let contatosLocatario: SolicitacaoContato[] = [];
      let contatosLocador: SolicitacaoContato[] = [];

      // Função para mesclar os dois arrays sem duplicatas
      const mergeAndRemoveDuplicates = (
        arr1: SolicitacaoContato[],
        arr2: SolicitacaoContato[]
      ) => {
        const map = new Map<string, SolicitacaoContato>();
        [...arr1, ...arr2].forEach((item) => {
          map.set(item.id, item);
        });
        return Array.from(map.values());
      };

      // Sempre que houver alteração em qualquer listener, chama o callback atualizado
      const notify = () => {
        const contatosAtualizados = mergeAndRemoveDuplicates(
          contatosLocatario,
          contatosLocador
        );
        callback(contatosAtualizados);
      };

      // Listener para locatário
      const unsubscribeLocatario = contatosRef
        .where('locatarioId', '==', userId)
        .onSnapshot((snapshot) => {
          contatosLocatario = processSnapshot(snapshot);
          notify();
        });

      // Listener para locador
      const unsubscribeLocador = contatosRef
        .where('locadorId', '==', userId)
        .onSnapshot((snapshot) => {
          contatosLocador = processSnapshot(snapshot);
          notify();
        });

      // Retorna a função de unsubscribe para parar os listeners
      return () => {
        unsubscribeLocatario();
        unsubscribeLocador();
      };
    } catch (error) {
      console.error('Erro ao escutar contatos:', error);
      throw error;
    }
  },
};

export default contatoService;
