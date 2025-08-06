import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { routes } from '../constants/routes';
import { RequisicaoParams } from '~/types/RequestNavigation';



export const Requisicao = async ({
    SolicitacaoId,
    LocadorId,
    LocatarioId,
    CarroID,
    SelectedModalidade,
    DataInicio,
    DataTermino,
    TotalValor,
    TotalDias,
    Dia,
    Estado,
    Descricao,
}: RequisicaoParams) => {
    try {
        const userId = await AsyncStorage.getItem('userId');

        const params = {
            soliciId: SolicitacaoId,
            locadorId: LocadorId,
            locatarioId: LocatarioId,
            carroId: CarroID,
            Modalidade: SelectedModalidade,
            DataInicio,
            DataTermino,
            TotalValor,
            TotalDias,
            Dia,
            Estado,
            Descricao,
        };

        if (userId === LocadorId) {
            router.push({ pathname: routes.viewLessorRequest, params });
        } else if (userId === LocatarioId) {
            router.push({ pathname: routes.viewLesseeRequest, params });
        }
    } catch (error) {
        console.error('Erro ao obter o ID do usuário: ', error);
    }
};

export const PGCaucao = async ({
    SolicitacaoId,
    LocadorId,
    LocatarioId,
}: RequisicaoParams) => {
    router.push({
        pathname: routes.payCaucao,
        params: {
            soliciId: SolicitacaoId,
            locadorId: LocadorId,
            locatarioId: LocatarioId,
        }
    });
};

export const PGAluguel = async ({
    SolicitacaoId,
    LocadorId,
    LocatarioId,
    TotalValor,
}: RequisicaoParams) => {
    router.push({
        pathname: routes.payRent,
        params: {
            soliciId: SolicitacaoId,
            locadorId: LocadorId,
            locatarioId: LocatarioId,
            TotalValor: (TotalValor || "0").toString(),
        }
    });
};

export const VerificacaoUsuario = async ({
    SolicitacaoId,
    LocadorId,
    LocatarioId,
}: RequisicaoParams) => {
    try {
        const userId = await AsyncStorage.getItem('userId');

        if (userId === LocadorId) {
            router.push({
                pathname: routes.verfLessor,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,
                },
            });
        } else if (userId === LocatarioId) {
            router.push({
                pathname: routes.verfLessee,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,
                },
            });
        }
    } catch (error) {
        console.error("Erro ao obter o ID do usuário: ", error);
    }
};

export const Avaliacao = async (id: string, locadorId: string, locatarioId: string, carroId: string, {
    SolicitacaoId, LocadorId, LocatarioId, CarroID,
}: RequisicaoParams) => {

    AsyncStorage.getItem('userId').then(userId => {
        if (userId === LocadorId) {
            router.push({
                pathname: routes.evaluateLessor,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,

                },
            });
        } else if (userId === LocatarioId) {
            router.push({
                pathname: routes.evaluateLessee,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,
                    carroId: CarroID,
                },
            });
        }
    }).catch((error: any) => {
        console.error("Erro ao obter o ID do usuário: ", error);
    });
};

export const Maps = (id: string, locadorId: string, locatarioId: string, carroId: string, {
    SolicitacaoId, LocadorId, LocatarioId, CarroID,
}: RequisicaoParams) => {

    AsyncStorage.getItem('userId').then(userId => {
        if (userId === LocadorId) {
            router.push({
                pathname: routes.mapsLessor,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,

                },
            });
        } else if (userId === LocatarioId) {
            router.push({
                pathname: routes.mapsLessee,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,
                    carroId: CarroID,
                },
            });
        }
    }).catch((error: any) => {
        console.error("Erro ao obter o ID do usuário: ", error);
    });
};

export const Escolher = (carroId: string, LocadorId: string, LocatarioId: string) => {
    if (LocatarioId != LocadorId) {
        router.push({
            pathname: routes.viewSchedule,
            params: { carroId: carroId, LocadorId: LocadorId },
        });
    }
}

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

export const ChatGerado = async (chatId: string, LocadorId: string, LocatarioId: string) => {
    router.push({
        pathname: routes.ViewMenssage,
        params: {
            id: chatId,
            locadorId: LocadorId,
            locatarioId: LocatarioId
        },
    });
};

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

export const ViewChat = async (id: string, locadorId: string, locatarioId: string) => {
    router.push({
        pathname: routes.ViewMenssage,
        params: {
            id,
            locadorId,
            locatarioId,
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

export const Troca = async (locadorId: string, locatarioId: string) => {
    router.push({
        pathname: '/screens/chat/changeValue/change',
        params: {
            locadorId: locadorId,
            locatarioId: locatarioId,
        }
    });
};