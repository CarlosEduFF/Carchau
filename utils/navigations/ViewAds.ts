import { router } from 'expo-router';
import { routes } from '~/constants/routes'; 

export function viewAds(carroId: string, LocadorId?: string) {
  router.push({
    pathname: routes.viewAds,
    params: { carroId, LocadorId },
  });
}
