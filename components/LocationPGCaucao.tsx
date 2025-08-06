// components/AtividadePGCaucao.tsx
import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { Request } from '~/types/Request';
import images from '~/constants/images'; // ajuste o caminho se necessário
import { getOpacity } from '~/utils/Opacity'; // modularize se ainda não estiver
import { PGCaucao } from '~/services/navigationService';
import { StatusRequest } from '~/types/StatusRequest';

interface Props {
  item: Request & { status: StatusRequest };
  isLocador: boolean;
  isDisabled: boolean;
}


const AtividadePGCaucao: React.FC<Props> = ({ item, isLocador, isDisabled }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        !isLocador &&
        PGCaucao({
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

export default AtividadePGCaucao;

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  eventDescription: {
    fontSize: 14,
    color: '#888',
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
  },
  eventValue: {
    fontSize: 14,
    color: '#f2a51a',
    marginRight: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    marginLeft: 0
  },
});
