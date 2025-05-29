import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import firebase from '~/config/firebase';


// 📸 Selecionar uma imagem única
export const pickSingleImage = async (): Promise<string | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

// 📷 Tirar uma foto usando a câmera
export const pickImageFromCamera = async (): Promise<string | null> => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [6, 4],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

// 📸 Selecionar múltiplas imagens
export const pickMultipleImages = async (): Promise<string[]> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets.map(asset => asset.uri);
  }

  return [];
};

// 📄 Selecionar um PDF
export const pickPdf = async (): Promise<{ uri: string; name: string } | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      return {
        uri: result.assets[0].uri,
        name: result.assets[0].name,
      };
    }
  } catch (error) {
    console.error('Erro ao selecionar PDF:', error);
  }

  return null;
};


export const removeImageByIndex = (images: string[], index: number): string[] => {
  return images.filter((_, i) => i !== index);
};


export const clearFile = (): string => {
  return '';
};

export const uploadFile = async (uri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = firebase.storage().ref().child(path);
    const snapshot = await storageRef.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  } catch (error) {
    console.error('Erro no upload do arquivo:', error);
    throw new Error('Erro ao fazer upload do arquivo.');
  }
};



