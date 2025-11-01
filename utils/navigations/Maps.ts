import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { routes } from "~/constants/routes";
import { RequestNavigationParams } from "~/types";

export const Maps = (id: string, locadorId: string, locatarioId: string, carroId: string, {
    SolicitacaoId, LocadorId, LocatarioId, CarroID,
}: RequestNavigationParams) => {

    AsyncStorage.getItem('userId').then(userId => {
        if (userId === LocadorId) {
            router.replace({
                pathname: routes.mapsLessor,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,

                },
            });
        } else if (userId === LocatarioId) {
            router.replace({
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