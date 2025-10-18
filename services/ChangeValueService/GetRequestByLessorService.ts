import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "~/config/firebase";
import { Request } from '~/types/';

export const getRequestByLessor = async (
  locatarioId: string,
  locadorId: string
): Promise<Request[]> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    console.log('AsyncStorage userId:', userId);
    console.log('locadorId argumento:', locadorId);
    console.log('locatarioId:', locatarioId);

    if (!userId || userId.trim() !== locadorId.trim()) {
      console.warn('Usuário não autorizado a visualizar estas solicitações.');
      return [];
    }

    const ref = firebase
      .firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('solicitacoes');

    // Duas consultas separadas para simular um OR
    const queryAluguelNaoPago = ref
      .where('estado', '==', 'Aceito')
      .where('status.estadoPGAluguel', '==', 'Aluguel não pago')
      .get();

    const queryCaucaoNaoPago = ref
      .where('estado', '==', 'Aceito')
      .where('status.estadoPGCaucao', '==', 'Caução não pago')
      .get();

    const [snapshotAluguel, snapshotCaucao] = await Promise.all([
      queryAluguelNaoPago,
      queryCaucaoNaoPago
    ]);

    const documentosUnicos: { [id: string]: Request } = {};

    const processSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
      snapshot.forEach(doc => {
        const data = doc.data();
        documentosUnicos[doc.id] = {
          id: doc.id,
          ...data,
        } as Request;
      });
    };

    processSnapshot(snapshotAluguel);
    processSnapshot(snapshotCaucao);

    const resultados = Object.values(documentosUnicos);

    // Filtro final de segurança para garantir que só pegue as solicitações do locador
    const solicitacoesDoLocador = resultados.filter(
      solicitacao => solicitacao.locadorId === userId
    );

    console.log('Solicitações encontradas:', solicitacoesDoLocador.length);
    return solicitacoesDoLocador;
  } catch (error) {
    console.error("Erro ao buscar Solicitações: ", error);
    throw error;
  }
};