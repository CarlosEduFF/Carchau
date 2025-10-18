import AsyncStorage from "@react-native-async-storage/async-storage";
import { SolicitacaoContato } from "~/types";
import firebase from "~/config/firebase";
/**
   * Escuta em tempo real os contatos do usuário logado.
   */
export async function GetContacts(
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
}