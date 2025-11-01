import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { routes } from "~/constants/routes";
import { RequestNavigationParams } from "~/types";

export const VerifyUser = async ({
    SolicitacaoId,
    LocadorId,
    LocatarioId,
}: RequestNavigationParams ) => {
    try {
        const userId = await AsyncStorage.getItem('userId');

        if (userId === LocadorId) {
            router.replace({
                pathname: routes.verfLessor,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,
                },
            });
        } else if (userId === LocatarioId) {
            router.replace({
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