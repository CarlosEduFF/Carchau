import firebase from '~/config/firebase';

/**
 * Atualiza o pagamento do caução de uma solicitação.
 */
export const pagarCaucao = async (
  locatarioId: string,
  solicitacaoId: string,
  estadoPGCaucao: string,
  cartaoId?: string
): Promise<void> => {
  try {
    const solicitacaoRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('solicitacoes')
      .doc(solicitacaoId);

    await solicitacaoRef.update({
      'status.estadoPGCaucao': estadoPGCaucao,
      cartãoNumCaucao: cartaoId || null,
    });
  } catch (error) {
    console.error('Erro ao atualizar o pagamento do caução:', error);
    throw error;
  }
};


export const pagarRent = async (
  locatarioId: string,
  solicitacaoId: string,
  estadoPGAluguel: string,
  cartaoId?: string
): Promise<void> => {
  try {
    const solicitacaoRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(locatarioId)
      .collection('solicitacoes')
      .doc(solicitacaoId);

    await solicitacaoRef.update({
      'status.estadoPGAluguel': estadoPGAluguel,
      cartãoNumCaucao: cartaoId || null,
    });
  } catch (error) {
    console.error('Erro ao atualizar o pagamento do aluguel:', error);
    throw error;
  }
};
