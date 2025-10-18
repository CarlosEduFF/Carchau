// services/AuthService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "~/config/firebase"; // ajuste o path conforme seu projeto

export const loginUser = async (email: string, senha: string) => {
  if (!email || !senha) {
    throw new Error("Por favor, preencha todos os campos.");
  }

  // Exemplo de validação de senha (pode estar em outro ValidationService)
  const isValidPassword = (senha: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(senha);
  };

  if (!isValidPassword(senha)) {
    throw new Error(
      "A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, números e símbolos."
    );
  }

  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, senha);

    if (!userCredential.user) {
      throw new Error("Usuário não foi autenticado. Tente novamente.");
    }

    const userId = userCredential.user.uid;

    // 🔥 Salvar no AsyncStorage
    await AsyncStorage.setItem("userId", userId);
    await AsyncStorage.setItem(
      "userName",
      userCredential.user.displayName || "Nome não disponível"
    );

    return userId; // retorna para o componente usar
  } catch (error: any) {
    console.error("Erro ao autenticar usuário:", error);
    throw new Error("Erro ao autenticar usuário: Senha Incorreta.");
  }
};
