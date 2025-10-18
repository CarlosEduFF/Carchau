// components/RequisicaoLocacao.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { RequestNav } from '~/utils/navigations/index';
import { Request } from '~/types/index'; 
import images from '~/constants/images';
import styles from './styles';

interface Props {
  item: Request;
}

export const LocationRequest: React.FC<Props> = ({ item }) => {
  const handlePress = () => {
    RequestNav({
      SolicitacaoId: item.id,
      LocadorId: item.locadorId,
      LocatarioId: item.locatarioId,
      CarroID: item.carroId,
      SelectedModalidade: item.modalidadesAluguel,
      DataInicio: item.dataInicio,
      DataTermino: item.dataTermino,
      TotalValor: item.valorTotal?.toString(),
      TotalDias: item.totalDias?.toString(),
      Dia: item.dia,
      Estado: item.estado,
      Descricao: item.descricao,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.eventContainer}>
        <Image
          source={
            item.locatarioperfilImage &&
            typeof item.locatarioperfilImage === 'string' &&
            item.locatarioperfilImage.trim() !== '' &&
            item.locatarioperfilImage.startsWith('http')
              ? { uri: item.locatarioperfilImage }
              : images.defaultProfileImage
          }
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.eventName}>{item.locatarionome}</Text>
          <Text style={styles.eventDescription}>{item.descricao}</Text>
          <Text style={styles.eventDate}>{item.dia}</Text>
        </View>
        <Text style={styles.eventValue}>{item.estado}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LocationRequest;
