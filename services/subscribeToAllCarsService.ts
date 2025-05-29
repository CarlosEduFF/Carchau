import { Image } from 'react-native';
import images from '~/constants/images';
import { Car } from '~/types/CarAds';

interface Locatario {
  id: string;
  ref: any;
  nome: string;
  endereco: string;
  fotoPerfil: string;
}

export const fetchCarrosByLocatario = async (locatario: Locatario): Promise<Car[]> => {
  try {
    const carrosSnapshot = await locatario.ref.collection('carros').get();

    const carrosData: Car[] = carrosSnapshot.docs.map((carroDoc: { data: () => any; id: any; }) => {
      const carroData = carroDoc.data();

      const fotosCarro = carroData.fotosCarro && carroData.fotosCarro.length > 0
        ? carroData.fotosCarro
        : [Image.resolveAssetSource(images.defaultVehicleImage).uri];

      const primeiraFoto = (typeof fotosCarro[0] === 'string')
        ? fotosCarro[0]
        : Image.resolveAssetSource(images.defaultVehicleImage).uri;

      return {
        id: carroDoc.id,
        modelo: carroData.modelo || '',
        marca: carroData.marca || '',
        image: primeiraFoto,
        location: carroData.pontoencontro || '',
        address: locatario.endereco || '',
        seats: typeof carroData.quantidadeLugares === 'number'
          ? carroData.quantidadeLugares
          : parseInt(carroData.quantidadeLugares) || 0,
        rating: typeof carroData.nota === 'number'
          ? carroData.nota
          : parseFloat(carroData.nota) || 0,
        owner: locatario.nome || '',
        precoDia: carroData.precoDia ? String(carroData.precoDia) : '',
        precoSemana: carroData.precoSemana ? String(carroData.precoSemana) : '',
        precoMes: carroData.precoMes ? String(carroData.precoMes) : '',
        fotoLoca: locatario.fotoPerfil || '',
        LocaId: locatario.id,
      };
    });

    return carrosData;
  } catch (error) {
    console.error(`Erro ao buscar carros do locatário ${locatario.id}:`, error);
    return [];
  }
};
