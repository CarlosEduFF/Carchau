
import { router } from "expo-router";
import { routes } from "~/constants/routes";
import { Services } from "~/services";
import { RequestNavigationParams } from "~/types";

export const Evalue = async (id: string, locadorId: string, locatarioId: string, carroId: string, {
    SolicitacaoId, LocadorId, LocatarioId, CarroID,
}: RequestNavigationParams) => {

    Services.StorageService.getUserId().then(userId => {
        if (userId === LocadorId) {
            router.replace({
                pathname: routes.evaluateLessor,
                params: {
                    soliciId: SolicitacaoId,
                    locadorId: LocadorId,
                    locatarioId: LocatarioId,

                },
            });
        } else if (userId === LocatarioId) {
            router.replace({
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