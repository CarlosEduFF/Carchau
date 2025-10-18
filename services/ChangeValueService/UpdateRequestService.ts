import firebase from "~/config/firebase";

interface UpdateSolicitacaoParams {
  locatarioId: string;
  solicitacaoId: string;
  valorTotal: number | null;
  caucao: number | null;
}

export const UpdateRequestValue = async ({
  locatarioId,
  solicitacaoId,
  valorTotal,
  caucao,
}: UpdateSolicitacaoParams): Promise<void> => {
  try {
    const solicitacaoRef = firebase.firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('solicitacoes')
      .doc(solicitacaoId);

    await solicitacaoRef.update({
      valorTotal,
      caucao,
    });

    console.log('Atualização realizada com sucesso!');
  } catch (error) {
    console.error("Erro ao atualizar solicitação:", error);
    throw error;
  }
};