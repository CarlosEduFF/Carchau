import firebase from '~/config/firebase';
import { Request, StatusRequest } from '~/types/index';

export const listenRequestLessor = (
  userId: string,
  onUpdate: (solicitacoes: (Request & { status: StatusRequest })[]) => void,
  onError: (error: any) => void
) => {
  return firebase
    .firestore()
    .collection('Locatarios')
    .onSnapshot(async (locatariosSnapshot) => {
      try {
        const solicitacoesPromises = locatariosSnapshot.docs.map(async (locatarioDoc) => {
          const solicitacoesRef = locatarioDoc.ref
            .collection('solicitacoes')
            .where('locadorId', '==', userId)
            .orderBy('dia', 'desc');

          const solicitacoesSnapshot = await solicitacoesRef.get();

          return Promise.all(solicitacoesSnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // ✅ Pega o status diretamente do documento
            const statusData: StatusRequest = {
              visto: data.status?.visto ?? false,
              estadoPGCaucao: data.status?.estadoPGCaucao ?? '',
              estadoPGAluguel: data.status?.estadoPGAluguel ?? '',
              confirRecepLocata: data.status?.confirRecepLocata ?? '',
              confirEntregaLocador: data.status?.confirEntregaLocador ?? '',
              confirRecepLocador: data.status?.confirRecepLocador ?? '',
              confirDevoLocata: data.status?.confirDevoLocata ?? '',
              estadoavaliLT: data.status?.estadoavaliLT ?? '',
              estadoavaliLD: data.status?.estadoavaliLD ?? '',
              confirlocationlocador: data.status?.confirlocationlocador ?? '',
              confirlocationlocatario: data.status?.confirlocationlocatario ?? '',
            };

            const solicitacao: Request & { status: StatusRequest } = {
              id: doc.id,
              valorTotal: data.valorTotal || 0,
              totalDias: data.totalDias || 0,
              visto: data.visto || false,
              dataInicio: data.dataInicio || '',
              dataTermino: data.dataTermino || '',
              locadorId: data.locadorId || '',
              locatarioId: locatarioDoc.id,
              caucao: data.caucao || 0,
              modalidadesAluguel: data.modalidadesAluguel || '',
              pontoencontro: data.pontoencontro || '',
              dia: data.dia || '',
              locatarionome: data.locatarionome || '',
              locatarioperfilImage: data.locatarioperfilImage || null,
              locadornome: data.locadornome || null,
              locadorperfilImage: data.locadorperfilImage || null,
              carroId: data.carroId || '',
              estado: data.estado || '',
              descricao: data.descricao || '',
              status: statusData, // ✅ Agora corretamente embutido
            };

            return solicitacao;
          }));
        });

        const solicitacoesList = (await Promise.all(solicitacoesPromises)).flat();
        onUpdate(solicitacoesList);
      } catch (error) {
        onError(error);
      }
    });
};
