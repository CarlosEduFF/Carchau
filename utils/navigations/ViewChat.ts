import { router } from "expo-router";
import { routes } from "~/constants/routes";

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