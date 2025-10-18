
import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { Request, StatusRequest } from '~/types/';
import images from '~/constants/images';
import { getOpacity } from '~/utils/Opacity'; 
import { PYCaucao } from '~/utils/navigations/index';
import styles from './styles';

interface Props {
  item: Request & { status: StatusRequest };
  isLocador: boolean;
  isDisabled: boolean;
}


const LocationPYCaucao: React.FC<Props> = ({ item, isLocador, isDisabled }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        !isLocador &&
        PYCaucao({
          SolicitacaoId: item.id,
          LocadorId: item.locadorId,
          LocatarioId: item.locatarioId,
        })
      }
      disabled={isDisabled}
      style={[styles.eventContainer, getOpacity(isDisabled)]}
    >
      <Image
        source={
          item.locatarioperfilImage && item.locatarioperfilImage.startsWith('http')
            ? { uri: item.locatarioperfilImage }
            : images.defaultProfileImage
        }
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.eventName}>{item.locatarionome}</Text>
        <Text style={styles.eventDescription}>
          Realize o pagamento do caução
        </Text>

      </View>
    </TouchableOpacity>
  );
};

export default LocationPYCaucao;
