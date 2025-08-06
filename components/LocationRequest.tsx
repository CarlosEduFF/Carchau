// components/RequisicaoLocacao.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Requisicao } from '~/services/navigationService'; // ou o caminho certo da função
import { Request } from '../types/Request'; // tipagem da solicitação
import images from '~/constants/images';
import { StyleSheet } from 'react-native';

interface Props {
  item: Request;
}

export const RequisicaoLocacao: React.FC<Props> = ({ item }) => {
  const handlePress = () => {
    Requisicao({
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
});