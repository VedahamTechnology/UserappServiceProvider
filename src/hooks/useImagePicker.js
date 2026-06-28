import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * Wraps expo-image-picker for profile avatar selection.
 * Returns { image, pick, clear }.
 */
export const useImagePicker = () => {
  const [image, setImage] = useState(null);

  const pick = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return null;
    const uri = result.assets[0].uri;
    setImage(uri);
    return uri;
  }, []);

  const clear = useCallback(() => setImage(null), []);

  return { image, pick, clear };
};