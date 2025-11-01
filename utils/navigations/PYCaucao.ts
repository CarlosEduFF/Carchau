import { router } from "expo-router";
import { routes } from "~/constants/routes";
import { RequestNavigationParams } from "~/types";

export const PYCaucao = async ({
    SolicitacaoId,
    LocadorId,
    LocatarioId,
}: RequestNavigationParams) => {
    router.replace({
        pathname: routes.payCaucao,
        params: {
            soliciId: SolicitacaoId,
            locadorId: LocadorId,
            locatarioId: LocatarioId,
        }
    });
};