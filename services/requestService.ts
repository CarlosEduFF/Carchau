import firebase from '~/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Request } from '../types/Request';
import { StatusRequest } from '~/types/Request/StatusRequest';

export const fetchSolicitacaoById = async (
  locatarioId: string,
  solicitacaoId: string
): Promise<(Request & {
  status: StatusRequest;
  locadornome: string;
  locadorperfilImage: string;
  locatarionome: string;
  locatarioperfilImage: string;
}) | null> => {
  try {
    // Referência ao documento principal que já inclui 'status'
    const solicitacaoRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('solicitacoes')
      .doc(solicitacaoId);

    const solicitacaoSnap = await solicitacaoRef.get();
    if (!solicitacaoSnap.exists) return null;

    // Dados da solicitação, incluindo o objeto 'status'
    const solicitacaoData = solicitacaoSnap.data();

    if (!solicitacaoData) return null;

    // Extrai o status do campo corretamente
    const statusData: StatusRequest = {
      visto: solicitacaoData.status?.visto ?? false,
      estadoPGCaucao: solicitacaoData.status?.estadoPGCaucao ?? '',
      estadoPGAluguel: solicitacaoData.status?.estadoPGAluguel ?? '',
      confirRecepLocata: solicitacaoData.status?.confirRecepLocata ?? '',
      confirEntregaLocador: solicitacaoData.status?.confirEntregaLocador ?? '',
      confirRecepLocador: solicitacaoData.status?.confirRecepLocador ?? '',
      confirDevoLocata: solicitacaoData.status?.confirDevoLocata ?? '',
      estadoavaliLD: solicitacaoData.status?.estadoavaliLD ?? '',
      estadoavaliLT: solicitacaoData.status?.estadoavaliLT ?? '',
      confirlocationlocador: solicitacaoData.status?.confirlocationlocador ?? '',
      confirlocationlocatario: solicitacaoData.status?.confirlocationlocatario ?? '',
    }

    // Busca dados adicionais de locador e locatário
    const locadorSnap = await firebase
      .firestore()
      .collection('Locatarios')
      .doc(solicitacaoData.locadorId)
      .get();
    const locadornome = locadorSnap.exists ? locadorSnap.data()?.nome ?? '' : '';
    const locadorperfilImage = locadorSnap.exists ? locadorSnap.data()?.perfilImage ?? '' : '';

    const locatarioSnap = await firebase
      .firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .get();
    const locatarionome = locatarioSnap.exists ? locatarioSnap.data()?.nome ?? '' : '';
    const locatarioperfilImage = locatarioSnap.exists ? locatarioSnap.data()?.perfilImage ?? '' : '';

    const requestData = solicitacaoData as Request;

    return {
      ...requestData,
      status: statusData,
      locadornome: locadornome ?? '',
      locadorperfilImage: locadorperfilImage ?? '',
      locatarionome: locatarionome ?? '',
      locatarioperfilImage: locatarioperfilImage ?? '',
    };

  } catch (error) {
    console.error('Erro ao buscar solicitação:', error);
    throw error;
  }
};

interface ResultadoSalvar {
  success: boolean;
  error?: string;
}

type DadosSolicitacao = Partial<Request & StatusRequest>;

export const salvarSolicitacaoAluguel = async (
  dados: DadosSolicitacao
): Promise<ResultadoSalvar> => {
  try {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) throw new Error('Erro ao obter ID do usuário.');

    const solicitacoesRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(uid)
      .collection('solicitacoes');

    let downloadURL: string | null = null;

    if (dados.locatarioperfilImage) {
      try {
        const response = await fetch(dados.locatarioperfilImage);

        if (!response.ok) throw new Error('Falha ao buscar a imagem');

        const blob = await response.blob();

        // Caminho único evita sobrescrita
        const uniqueImageName = `imagemPerfil/${uid}/${Date.now()}`;
        const storageRef = firebase.storage().ref().child(uniqueImageName);
        const snapshot = await storageRef.put(blob);
        downloadURL = await snapshot.ref.getDownloadURL();
      } catch (e) {
        console.warn('Erro ao fazer upload da imagem de perfil:', e);
        // Se quiser, você pode manter a URL original como fallback:
        downloadURL = typeof dados.locatarioperfilImage === 'string' ? dados.locatarioperfilImage : '';
      }
    }

    // Monta o objeto status
    const status: StatusRequest = {
      visto: dados.visto ?? false,
      estadoPGCaucao: dados.estadoPGCaucao ?? '',
      estadoPGAluguel: dados.estadoPGAluguel ?? '',
      confirRecepLocata: dados.confirRecepLocata ?? '',
      confirEntregaLocador: dados.confirEntregaLocador ?? '',
      confirRecepLocador: dados.confirRecepLocador ?? '',
      confirDevoLocata: dados.confirDevoLocata ?? '',
      estadoavaliLD: dados.estadoavaliLD ?? '',
      estadoavaliLT: dados.estadoavaliLT ?? '',
      confirlocationlocador: dados.confirlocationlocador ?? '',
      confirlocationlocatario: dados.confirlocationlocatario ?? '',
    };

    // Monta os dados completos da solicitação, incluindo status
    const requestData: Request & { status: StatusRequest } = {
      id: '',
      valorTotal: Number(dados.valorTotal ?? 0),
      totalDias: Number(dados.totalDias ?? 0),
      dataInicio: dados.dataInicio ?? '',
      dataTermino: dados.dataTermino ?? '',
      visto: dados.visto ?? false,
      locadorId: dados.locadorId ?? '',
      locatarioId: uid,
      caucao: Number(dados.caucao ?? 0),
      modalidadesAluguel: dados.modalidadesAluguel ?? '',
      pontoencontro: dados.pontoencontro ?? '',
      dia: dados.dia ?? '',
      estado: dados.estado ?? '',
      descricao: dados.descricao ?? '',
      locatarioperfilImage: downloadURL ?? dados.locatarioperfilImage ?? '',
      locadornome: dados.locadornome ?? '',
      locadorperfilImage: dados.locadorperfilImage ?? '',
      locatarionome: dados.locatarionome ?? '',
      status,
      carroId: dados.carroId ?? '',
    };

    // Salva tudo em um único documento
    const solicitacaoDocRef = await solicitacoesRef.add(requestData);
    await solicitacaoDocRef.update({ id: solicitacaoDocRef.id });

    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar solicitação de aluguel: ', error);
    return { success: false, error: 'Erro ao salvar solicitação.' };
  }
};


type DeleteSolicitacaoParams = {
  soliciId: string;
  setModalVisible: (visible: boolean) => void;
  setModalVisible2: (visible: boolean) => void;
  setLoading: (loading: boolean) => void;
};

export const deleteSolicitacao = async ({
  soliciId,
  setModalVisible,
  setModalVisible2,
  setLoading
}: DeleteSolicitacaoParams) => {
  try {
    setLoading(true);

    const uid = await AsyncStorage.getItem('userId');
    if (!uid) {
      setLoading(false);
      console.error('Erro ao obter ID do usuário.');
      alert('Erro ao obter ID do usuário.');
      return;
    }

    const carroRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(uid)
      .collection('solicitacoes')
      .doc(soliciId);

    await carroRef.delete();

    console.log('Solicitação excluída com sucesso');
    setModalVisible(true);
  } catch (error) {
    console.error("Erro ao excluir a solicitação:", error);
    alert('Erro ao excluir a solicitação.');
  } finally {
    setLoading(false);
  }
};

type UpdateEstadoSolicitacaoParams = {
  locatarioId: string;
  soliciId: string;
  novoEstado: 'Aceito' | 'Recusado';
  setModalVisible: (visible: boolean) => void;
};

export const updateEstadoSolicitacao = async ({
  locatarioId,
  soliciId,
  novoEstado,
  setModalVisible
}: UpdateEstadoSolicitacaoParams) => {
  try {
    const uid = await AsyncStorage.getItem('userId');
    if (!uid) {
      console.error('Erro ao obter ID do usuário.');
      alert('Erro ao obter ID do usuário.');
      return;
    }

    const docRef = firebase.firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('solicitacoes')
      .doc(soliciId);

    await docRef.update({
      estado: novoEstado
    });

    console.log(`Estado de solicitação atualizado para "${novoEstado}"`);
    setModalVisible(true);
  } catch (error) {
    console.error("Erro ao atualizar o estado de solicitação:", error);
    alert('Erro ao atualizar o estado da solicitação.');
  }
};