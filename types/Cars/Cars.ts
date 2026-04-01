import firebase from '~/config/firebase'; // seu caminho de configuração

export type Car = {
  id?: string;
  modelo: string;
  marca: string;
  quantidadeLugares: string;
  pontoencontro: string;
  precoDia: number;
  precoSemana: number;
  precoMes: number;
  nota?: number;
  primeiraFoto?: string | null;
  ano: string;
  arCondicionado: string;
  cambio: string;
  caucao: number;
  combustivel: string;
  fotoLaud: string;
  fotosCarro: string[];
  modalidadesAluguel: number[];
  pdfDocumento: string;
  pdfNome: string;
  placa: string;
  step: string;
  airbags: string;
  dataCriacao?: firebase.firestore.Timestamp | firebase.firestore.FieldValue | null;
};
