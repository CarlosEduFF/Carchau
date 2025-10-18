// services/AuthService.ts
import firebase from "~/config/firebase"; // ajuste o path conforme seu projeto

export const ResetPassword = async (email: string) => {
  if (!email) {
    throw new Error("Por favor, insira seu e-mail para recuperar a senha.");
  }
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    return "Um link de recuperação de senha foi enviado para o seu email.";
  } catch (error) {
    console.error("Erro ao enviar email de redefinição: ", error);
    throw new Error(
      "Erro ao enviar email de redefinição. Verifique se o email está correto."
    );
  }
};
