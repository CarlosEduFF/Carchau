
export const validateUserData = ({
  nome,
  nacionalidade,
  telefone,
  email,
  profissao,
  selectedIndex,
}: {
  nome: string;
  nacionalidade: string;
  telefone: string;
  email: string;
  profissao: string;
  selectedIndex: number | null;
}) => {
  if (
    !nome ||
    !nacionalidade ||
    (selectedIndex !== 0 && selectedIndex !== 1) ||
    !telefone ||
    telefone.length !== 15 ||
    !email ||
    !email.includes('@') ||
    !profissao
  ) {
    return false;
  }
  return true;
};