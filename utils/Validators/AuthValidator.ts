// ~/utils/Validators/AuthValidator.ts
/**
 * Validators usados na aplicação
 * Usar named exports para evitar ambiguidades na importação.
 */

export const isValidPassword = (senha: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(senha);
};

export const isValidCPF = (cpf: string | string[]): boolean => {
  if (Array.isArray(cpf)) cpf = cpf[0];
  if (!cpf) return false;

  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  const calcularDigito = (cpfStr: string, fatorInicial: number) => {
    let soma = 0;
    for (let i = 0; i < fatorInicial - 1; i++) {
      soma += parseInt(cpfStr[i], 10) * (fatorInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const primeiroDigito = calcularDigito(cpf, 10);
  const segundoDigito = calcularDigito(cpf, 11);

  return (
    primeiroDigito === parseInt(cpf[9], 10) &&
    segundoDigito === parseInt(cpf[10], 10)
  );
};

export const isValidTerms = (termoAceito: boolean): boolean => {
  if (!termoAceito) {
    // Em vez de alert aqui, considere retornar false e deixar o componente mostrar a mensagem
    alert("Você deve aceitar os termos de privacidade e a coleta de dados.");
    return false;
  }
  return true;
};

export const isValidEmail = (text: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
};
