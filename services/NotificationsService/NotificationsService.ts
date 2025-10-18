import * as Notifications from 'expo-notifications';

export const requestPermissions = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    return false;
  }

  return true;
};
