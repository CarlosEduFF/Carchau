import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
export type Car = {
  id: string;
  modelo: string;
  image: string;
  location: string;
  address: string;
  seats: number;
  rating: number;
  owner: string;
  precoDia?: string;
  precoSemana?: string;
  precoMes?: string; 
  fotoLoca?: string; 
  LocaId?: string;
  marca: string;
  dataCriacao?: FirebaseFirestoreTypes.Timestamp | null;
}