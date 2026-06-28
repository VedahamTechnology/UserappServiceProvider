import * as Location from 'expo-location';

/**
 * Best-effort reverse geocoding of the current device location.
 * Returns both a full and a short formatted address.
 */
export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const currentLocation = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const { latitude, longitude } = currentLocation.coords;

  const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
  const address = addresses[0] || {};

  const fullAddress = [
    address.name,
    address.street,
    address.district,
    address.city,
    address.region,
    address.postalCode,
    address.country,
  ].filter(Boolean).join(', ');

  const shortAddress = [
    address.name,
    address.street,
    address.district,
    address.city,
  ].filter(Boolean).join(', ');

  return { latitude, longitude, fullAddress, shortAddress };
};
