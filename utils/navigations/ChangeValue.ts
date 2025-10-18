import { router } from "expo-router";

export const changeValue = async (locadorId: string, locatarioId: string) => {
    router.push({
        pathname: '/screens/chat/changeValue/change',
        params: {
            locadorId: locadorId,
            locatarioId: locatarioId,
        }
    });
};