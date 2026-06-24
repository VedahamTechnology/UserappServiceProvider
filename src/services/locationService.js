import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  return await Location.getCurrentPositionAsync({});
};

export const getCurrentAddress = async () => {
  const location = await getCurrentLocation();

  const addresses = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    address: addresses[0],
  };
};