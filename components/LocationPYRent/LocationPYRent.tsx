
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Request } from '~/types/';
import { getOpacity } from '~/utils/Opacity';
import images from '~/constants/images';
import { PYRent } from '~/utils/navigations/index';
import styles from './styles';

interface Props {
  item: Request;
  isLocador: boolean;
  isDisabled: boolean;
}

const LocationPYRent: React.FC<Props> = ({ item, isLocador, isDisabled }) => {

  const handlePress = () => {
    if (!isLocador) {
      PYRent({
        SolicitacaoId: item.id,
        LocadorId: item.locadorId,
        LocatarioId: item.locatarioId,
        TotalValor: item.valorTotal.toString(),
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
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
          Realize o pagamento do aluguel
        </Text>

      </View>
    </TouchableOpacity>
  );
};

export default LocationPYRent;



