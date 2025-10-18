import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Request } from '~/types/';
import { getOpacity } from '~/utils/Opacity';
import images from '~/constants/images';
import { VerifyUser } from '~/utils/navigations/index';
import styles from './styles';

interface Props {
  item: Request;
  isDisabled: boolean;
  descricao: string;
}

const LocationConfirmCode: React.FC<Props> = ({ item, isDisabled, descricao }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        VerifyUser({
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
        <Text style={styles.eventDescription}>{descricao}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LocationConfirmCode;
