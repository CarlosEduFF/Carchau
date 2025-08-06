import { Carro } from "~/types/Cars";
import { StatusRequest } from "~/types/StatusRequest";

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
  if (!ano || isNaN(ano)) return 'Informe o ano do carro.';
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


type Dados = Record<string, any>;

export type ValidarCamposResultado = {
  valido: boolean;
  camposVazios: string[];
};

export const validarCampos = (
  dados: Record<string, any>,
  camposObrigatorios: string[]
): ValidarCamposResultado => {
  const camposVazios = camposObrigatorios.filter((campo) => {
    const valor = dados[campo];
    return (
      valor === undefined ||
      valor === null ||
      (typeof valor === 'string' && valor.trim() === '') ||
      valor === false
    );
  });

  return {
    valido: camposVazios.length === 0,
    camposVazios,
  };
};

/**
 * LocationPGCaucao:
 * - Renderiza para ambos, mas:
 *   • sempre desabilitado para locador
 *   • desabilita após “Caução pago”
 */
export const isCaucaoDisabled = (
  status: StatusRequest,
  isLocador: boolean
): boolean =>
  // locador nunca pode pagar caução
  isLocador ||
  // assim que estiver “Caução pago” bloqueia o botão
  status.estadoPGCaucao === 'Caução pago';

/**
 * LocationPGRent:
 * - Renderiza para ambos, mas:
 *   • só habilita para locatário quando “Caução pago”
 *   • desabilita após “Aluguel pago”
 */
export const isRentDisabled = (
  status: StatusRequest,
  isLocador: boolean
): boolean =>
  // locador nunca pode pagar aluguel
  isLocador ||
  // só libera se caução já estiver paga
  status.estadoPGCaucao !== 'Caução pago' ||
  // bloqueia de novo após aluguel pago
  status.estadoPGAluguel === 'Aluguel pago';

export const isMapsDisabled = (
  status: StatusRequest,
  isLocador: boolean
): boolean =>
  // Só deve estar habilitado para ambos os usuários após caução e aluguel pagos
  status.estadoPGCaucao !== 'Caução pago' ||
  status.estadoPGAluguel !== 'Aluguel pago' ||
  // Desabilita se ambos já aprovaram a localização
  (
    status.confirlocationlocador === 'Localização aprovada' &&
    status.confirlocationlocatario === 'Localização aprovada'
  );

export const isEntregaDisabled = (
  status: StatusRequest,
  _isLocador: boolean,
  _isLocatario: boolean
): boolean =>
  // Só habilita se ambas localizações forem aprovadas
  status.confirlocationlocador !== 'Localização aprovada' ||
  status.confirlocationlocatario !== 'Localização aprovada' ||
  // Desabilita quando os dois confirmam a entrega e o recebimento do veículo
  (
    status.confirEntregaLocador === 'Veículo entregue' &&
    status.confirRecepLocata === 'Veículo recebido'
  );


export const isDevolucaoDisabled = (
  status: StatusRequest,
  _isLocador: boolean,
  _isLocatario: boolean
): boolean =>
  // Só habilita se entrega e recebimento foram confirmados
  status.confirEntregaLocador !== 'Veículo entregue' ||
  status.confirRecepLocata !== 'Veículo recebido' ||
  // Desabilita se devolução e recebimento final forem confirmados
  (
    status.confirDevoLocata === 'Veículo devolvido' &&
    status.confirRecepLocador === 'Veículo recebido'
  );


export const isAvaliacaoDisabled = (status: StatusRequest, isLocador: boolean): boolean =>
  (isLocador
    ? status.estadoavaliLD === 'Avaliado'
    : status.estadoavaliLT === 'Avaliado') ||
  !(
    status.confirRecepLocador === 'Veículo recebido' &&
    status.confirDevoLocata === 'Veículo devolvido'
  );

  
  export const isLocacaoFinalizada = (item: StatusRequest) =>
    item.estadoPGCaucao === 'Caução pago' &&
    item.estadoPGAluguel === 'Aluguel pago' &&
    item.confirRecepLocata === 'Veículo recebido' &&
    item.confirEntregaLocador === 'Veículo entregue' &&
    item.confirDevoLocata === 'Veículo devolvido' &&
    item.confirRecepLocador === 'Veículo recebido' &&
    item.estadoavaliLD === 'Avaliado' &&
    item.estadoavaliLT === 'Avaliado';

