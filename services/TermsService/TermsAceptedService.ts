import firebase from '~/config/firebase'; // ajuste o caminho do seu firebase config

export interface LocatarioData {
  nome: string;
  email: string;
  cpf: string;
}

/**
 * Salva dados do locatário no Firestore
 * @param userId ID do usuário (documento principal)
 * @param data Dados do locatário (nome, email, cpf)
 */
export const TermsAcepted = async (
  userId: string | undefined,
  data: LocatarioData
): Promise<void> => {
  try {
    if (!userId) {
      throw new Error('ID de usuário inválido.');
    }

    // Cria/atualiza documento do locatário
    await firebase.firestore().collection('Locatarios').doc(userId).set({
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
    });

    // Cria subcoleção "termos"
    const termosRef = firebase
      .firestore()
      .collection('Locatarios')
      .doc(userId)
      .collection('termos');

    await termosRef.add({
      termoAceito: true,
      dataAceitacao: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao salvar dados no Firestore: ', error);
    throw new Error('Erro ao salvar dados no Firestore.');
  }
};
