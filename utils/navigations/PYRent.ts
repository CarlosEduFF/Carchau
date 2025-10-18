import { router } from "expo-router";
import { routes } from "~/constants/routes";
import { RequestNavigationParams } from "~/types";

export const PYRent = async ({
    SolicitacaoId,
    LocadorId,
    LocatarioId,
    TotalValor,
}: RequestNavigationParams) => {
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