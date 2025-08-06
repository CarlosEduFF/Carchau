
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Request } from '~/types/Request';

import { getOpacity } from '~/utils/Opacity';
import { PGAluguel } from '~/services/navigationService'; // ajuste conforme necessário
import images from '~/constants/images';

interface Props {
  item: Request;
  isLocador: boolean;
  isDisabled: boolean;
}

const PagamentoAluguelCard: React.FC<Props> = ({ item, isLocador, isDisabled }) => {

  const handlePress = () => {
    if (!isLocador) {
      PGAluguel({
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

export default PagamentoAluguelCard;


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

