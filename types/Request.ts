import { StatusRequest } from './StatusRequest';

export interface Request {
  
  id: string;
  valorTotal: number;
  totalDias: number;
  dataInicio: string;
  dataTermino: string;
  visto: boolean;
  locadorId: string;
  locatarioId: string;
  caucao: number;
  modalidadesAluguel: string;
  pontoencontro: string;
  dia: string;
  locatarionome: string | null;
  locatarioperfilImage: string | null;
  locadornome: string | null;
  locadorperfilImage: string | null;
  carroId: string;
  estado: string;
  descricao: string;
  status: StatusRequest;
}