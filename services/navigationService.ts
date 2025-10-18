import { router } from 'expo-router';
import { routes } from '../constants/routes';

















export const CardsVisu = (cardId: string) => {
    router.push({
        pathname: routes.deleteCard,
        params: { cardId }
    });
}

export const ViewCars = (carro: { id: any; }) => {
    router.push({
        pathname: routes.editLocation,
        params: { carroId: carro.id }
    });
}

export const PerfilLocador = (LocadorId: string, LocatarioId: string) => {
    if (LocatarioId != LocadorId) {
        router.push({
            pathname: routes.viewOtherProfile,
            params: { locatarioId: LocadorId },
        });
    }
}



export const Requisitar = async (
    carroId: string,
    locadorId: string,
    selectedModalidade: string,
    valorTotal: string,
    dataInicio: string,
    dataTermino: string,
    totalDias: string
) => {
    router.push({
        pathname: routes.confirmScreen,
        params: {
            carroId,
            locadorId,
            modalidade: selectedModalidade,
            valorTotal,
            dataInicio,
            dataTermino,
            totalDias,
        },
    });
}


export const BackSchedule = async (
    carroId: string,
    LocadorId: string,
    selectedModalidade: string,
    valorTotal: string,
    dataInicio: string,
    dataTermino: string,
    totalDias: string
) => {
    router.push({
        pathname: routes.viewSchedule,
        params: {
            carroId,
            LocadorId,
            modalidade: selectedModalidade,
            valorTotal,
            dataInicio,
            dataTermino,
            totalDias,
        },
    });
};



export const Perfil = async (locatarioId: string) => {
    router.push({
        pathname: '/screens/ActivityScreen/viewProfile/profile',
        params: {
            locatarioId: locatarioId,
        },
    });
};

