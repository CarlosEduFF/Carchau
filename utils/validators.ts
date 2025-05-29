import { Carro } from "~/types/Cars";

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
export const formatExpiryDate = (date: string): string => {
    const cleaned = date.replace(/\D/g, '');
    if (cleaned.length >= 3) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
};

// Valida a data de validade no formato MM/YY
export const isValidExpiryDate = (expiry: string): boolean => {
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) return false;

    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt('20' + yearStr, 10);

    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
};

// Valida se o número do cartão tem 16 dígitos numéricos
export const isValidCardNumber = (cardNumber: string): boolean => {
    return /^\d{16}$/.test(cardNumber);
};

// Valida se o nome do titular não está vazio
export const isValidCardName = (cardName: string): boolean => {
    return cardName.trim().length > 0;
};

// Valida se o CVV tem 3 dígitos numéricos
export const isValidCVV = (cvv: string): boolean => {
    return /^\d{3}$/.test(cvv);
};

export const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
};

export const validateCarData = (data: Carro): string | undefined => {
  const {
    modelo,
    marca,
    ano,
    placa,
    combustivel,
    quantidadeLugares,
    arCondicionado,
    step,
    cambio,
    modalidadesAluguel,
    caucao,
    airbags,
    pontoencontro,
    fotoLaud,
    pdfDocumento,
    fotosCarro,
  } = data;

  if (!modelo.trim()) return 'Informe o modelo do carro.';
  if (!marca.trim()) return 'Informe a marca do carro.';
  if (!ano.trim()) return 'Informe o ano do carro.';
  if (!placa.trim()) return 'Informe a placa do carro.';
  if (!combustivel.trim()) return 'Informe o combustível.';
  if (!arCondicionado.trim()) return 'Informe se possui ar-condicionado.';
  if (!step.trim()) return 'Informe se possui step.';
  if (!cambio.trim()) return 'Informe o tipo de câmbio.';
  if (!airbags.trim()) return 'Informe se possui airbags.';
  if (!pontoencontro.trim()) return 'Informe o ponto de encontro.';

  if (!quantidadeLugares || quantidadeLugares <= 0) {
    return 'Informe corretamente a quantidade de lugares.';
  }

  if (!caucao || caucao <= 0) {
    return 'Informe corretamente o valor do caução.';
  }

  if (!modalidadesAluguel || modalidadesAluguel.length === 0) {
    return 'Selecione pelo menos uma modalidade de aluguel.';
  }

  if (!fotoLaud) return 'Envie uma foto do laudo.';
  if (!pdfDocumento) return 'Envie o documento PDF do carro.';
  if (!fotosCarro || fotosCarro.length === 0) {
    return 'Adicione pelo menos uma foto do carro.';
  }

  return undefined; // Tudo certo!
};

export const validateCNHImages = (
    frontCNH: string | null,
    backCNH: string | null,
    setSitu: (msg: string) => void,
    setModalVisible: (value: boolean) => void
): boolean => {
    if (!frontCNH) {
        setSitu('Tire foto da parte da frente da sua CNH');
        setModalVisible(true);
        return false;
    }
    if (!backCNH) {
        setSitu('Tire foto da parte de trás da sua CNH');
        setModalVisible(true);
        return false;
    }
    return true;
};

export const validateEndereco = (dados: {
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
}, setSitu: (msg: string) => void, setModalVisible2: (visible: boolean) => void) => {
    
    if (!dados.cep || dados.cep.length !== 9) {
        setSitu('Preencha corretamente o seu CEP!');
        setModalVisible2(true);
        return false;
    }
    if (!dados.endereco) {
        setSitu('Preencha corretamente o seu endereço!');
        setModalVisible2(true);
        return false;
    }
    if (!dados.numero) {
        setSitu('Preencha corretamente o número da sua residência');
        setModalVisible2(true);
        return false;
    }
    if (!dados.bairro) {
        setSitu('Preencha corretamente o seu bairro');
        setModalVisible2(true);
        return false;
    }
    if (!dados.cidade) {
        setSitu('Preencha corretamente a sua cidade.');
        setModalVisible2(true);
        return false;
    }
    if (!dados.estado) {
        setSitu('Preencha corretamente o seu estado.');
        setModalVisible2(true);
        return false;
    }

    return true;
};
