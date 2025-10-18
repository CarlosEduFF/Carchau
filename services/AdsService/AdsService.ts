import firebase from '~/config/firebase';
import { fetchLocatariosDetails } from './LesseeAllService';
import { fetchCarrosByLocatario } from './CarAllService';

export function listenRealTimeCars(
  onSuccess: (carros: any[]) => void,
  onError?: (error: any) => void
) {
  try {
    const unsubscribe = firebase.firestore()
      .collection('Locatarios')
      .onSnapshot(async () => {
        try {
          const locatariosDetails = await fetchLocatariosDetails();

          const carrosPorLocatario = await Promise.all(
            locatariosDetails.map(async (locatario) => {
              const carros = await fetchCarrosByLocatario(locatario);

              return carros.map(carro => ({
                ...carro,
                owner: locatario.nome,
                fotoLoca: locatario.fotoPerfil,
                address: locatario.endereco,
                LocaId: locatario.id,
              }));
            })
          );

          const allCars = carrosPorLocatario.flat();

          // 🔥 Ordenar por dataCriacao
          const sortedCars = allCars.sort((a, b) => {
            const dateA = a.dataCriacao?.toMillis?.() || 0;
            const dateB = b.dataCriacao?.toMillis?.() || 0;
            return dateB - dateA;
          });

          onSuccess(sortedCars);
        } catch (error) {
          console.error('Erro ao processar locatários e carros:', error);
          onError?.(error);
        }
      });

    return unsubscribe;
  } catch (error) {
    console.error('Erro ao iniciar listener dos locatários:', error);
    onError?.(error);
  }
}
export { fetchLocatariosDetails };

