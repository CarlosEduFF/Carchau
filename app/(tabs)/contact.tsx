import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import styles from '../Styles/StylesContact';
import { ViewChat } from '~/utils/navigations/';
import { useFocusEffect } from 'expo-router';
import { SolicitacaoContato } from '~/types';
import { Components } from '~/components';
import { Services } from '~/services';

export default function Contatos() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoContato[]>([]);
  const [contatos, setContatos] = useState<SolicitacaoContato[]>([]);
  const [loading, setLoading] = useState(true);
  const emptyMessage = 'Nenhum contato encontrado.';

  useFocusEffect(
    React.useCallback(() => {
      let unsubscribeSolicitacoes: (() => void) | undefined;
      let unsubscribeContatos: (() => void) | undefined;

      const fetchData = async () => {
        try {
          unsubscribeSolicitacoes = await Services.GetAceptedRequest((dados) => {
            const unicos = removeDuplicatasPorId(dados);
            setSolicitacoes(unicos);
          });

          unsubscribeContatos = await Services.GetContacts((dados) => {
            const unicos = removeDuplicatasPorId(dados);
            setContatos(unicos);
            setLoading(false);
          });
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };

      fetchData();

      return () => {
        if (unsubscribeSolicitacoes) unsubscribeSolicitacoes();
        if (unsubscribeContatos) unsubscribeContatos();
      };
    }, [])
  );

  const listaUnica = Array.from(
    new Map(
      [...solicitacoes, ...contatos].map((item) => [item.id, item])
    ).values()
  );

  function removeDuplicatasPorId<T extends { id: string }>(lista: T[]): T[] {
    return Array.from(new Map(lista.map((item) => [item.id, item])).values());
  }

  return (
    <View style={styles.containerFull}>
      {loading ? (
        <Components.LoadingCarAnimation loading={loading} />
      ) : listaUnica.length > 0 ? (
        <FlatList
          data={listaUnica}
          renderItem={({ item }) => (
            <Components.ContactItem
              item={item}
              onPress={() => ViewChat(item.id, item.locadorId, item.locatarioId)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.EmptyMessage}>
          <Text style={styles.foco}>{emptyMessage}</Text>
        </View>
      )
      }
    </View >
  );
}
