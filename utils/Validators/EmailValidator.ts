
export const validateMessageForm = (email: string, mensagem: string) => {
  if (!email.trim()) {
    throw new Error('Por favor, preencha o email antes de enviar.');
  }

  if (!mensagem.trim()) {
    throw new Error('Por favor, preencha a mensagem antes de enviar.');
  }

  // Pode adicionar outras validações, como email válido:
  if (!email.includes('@')) {
    throw new Error('Digite um email válido.');
  }
};

export default validateMessageForm;