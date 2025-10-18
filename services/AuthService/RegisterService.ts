import firebase from "~/config/firebase"; // ajuste o caminho do seu config

/**
 * Cadastra um usuário no Firebase Auth
 * @param email Email do usuário
 * @param senha Senha do usuário
 * @returns UID do usuário criado
 */
export const RegisterUserAuth = async (
  email: string,
  senha: string
): Promise<string> => {
  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha);

    if (!userCredential.user) {
      throw new Error("Erro ao criar usuário. Tente novamente.");
    }

    return userCredential.user.uid;
  } catch (error) {
    console.error("Erro ao criar usuário no Auth: ", error);
    throw new Error("Erro ao criar usuário no Auth.");
  }
};
