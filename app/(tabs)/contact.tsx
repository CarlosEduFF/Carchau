import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { SolicitacaoContato } from '~/types/Contact';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import styles from '../Styles/StylesContact';
import contatoService from '~/services/contactService';
import ContactItem from '~/components/ContactItem';
import { ViewChat } from '~/services/navigationService';
import { useFocusEffect } from 'expo-router';

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
          unsubscribeSolicitacoes = await contatoService.listenSolicitacoesAceitas((dados) => {
            const unicos = removeDuplicatasPorId(dados);
            setSolicitacoes(unicos);
          });

          unsubscribeContatos = await contatoService.listenContatos((dados) => {
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
        <LoadingCarAnimation loading={loading} />
      ) : listaUnica.length > 0 ? (
        <FlatList
          data={listaUnica}
          renderItem={({ item }) => (
            <ContactItem
              item={item}
              onPress={() => ViewChat(item.id, item.locadorId, item.locatarioId)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            paddingTop: 20,
          }}
        >
          <Text style={styles.foco}>{emptyMessage}</Text>
        </View>
      )}
    </View>
  );
}
