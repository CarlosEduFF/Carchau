import { router } from "expo-router";
import { routes } from "~/constants/routes";

export const GenerateChat = async (chatId: string, LocadorId: string, LocatarioId: string) => {
    router.push({
        pathname: routes.ViewMenssage,
        params: {
            id: chatId,
            locadorId: LocadorId,
            locatarioId: LocatarioId
        },
    });
};