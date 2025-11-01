import { router } from "expo-router";
import { routes } from "~/constants/routes";

export const ChooseDate = (carroId: string, LocadorId: string, LocatarioId: string) => {
    if (LocatarioId != LocadorId) {
        router.replace({
            pathname: routes.viewSchedule,
            params: { carroId: carroId, LocadorId: LocadorId },
        });
    }
}