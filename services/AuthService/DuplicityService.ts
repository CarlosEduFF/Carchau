import firebase from '~/config/firebase'; // ajuste o caminho se necessário

/**
 * Verifica se já existe email ou CPF cadastrados na coleção Locatarios
 * @param email Email a ser verificado
 * @param cpf CPF a ser verificado
 * @returns {Promise<{ ok: boolean; erroEmail?: string; erroCPF?: string }>}
 */
export const Duplicity = async (
  email: string,
  cpf: string
): Promise<{ ok: boolean; erroEmail?: string; erroCPF?: string }> => {
  try {
    const emailExists = await firebase
      .firestore()
      .collection('Locatarios')
      .where('email', '==', email)
      .get();

    if (!emailExists.empty) {
      return { ok: false, erroEmail: 'Este e-mail já está cadastrado.' };
    }

    const cpfExists = await firebase
      .firestore()
      .collection('Locatarios')
      .where('cpf', '==', cpf)
      .get();

    if (!cpfExists.empty) {
      return { ok: false, erroCPF: 'Este CPF já está cadastrado.' };
    }

    return { ok: true };
  } catch (error) {
    console.error('Erro ao verificar duplicidade: ', error);
    throw new Error('Erro ao verificar duplicidade.');
  }
};
