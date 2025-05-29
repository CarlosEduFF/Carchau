import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SolicitacaoContato } from '~/types/Contato';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { routes } from '~/constants/routes';
import styles from '../Styles/StylesContact';
import contatoService from '~/services/contactService';
import solicitacaoService from '~/services/solicitationContactService';
import ContactItem from '~/components/ContactItem';

export default function Contatos() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoContato[]>([]);
  const [contatos, setContatos] = useState<SolicitacaoContato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSolicitacoes: (() => void) | undefined;
    let unsubscribeContatos: (() => void) | undefined;

    const fetchSolicitacoes = async () => {
      try {
        unsubscribeSolicitacoes = await solicitacaoService.listenSolicitacoesAceitas((dados) => {
          setSolicitacoes(dados);
        });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchContatos = async () => {
      try {
        unsubscribeContatos = await contatoService.listenContatos((dados) => {
          setContatos(dados);
          setLoading(false);
        });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchSolicitacoes();
    fetchContatos();

    return () => {
      if (unsubscribeSolicitacoes) unsubscribeSolicitacoes();
      if (unsubscribeContatos) unsubscribeContatos();
    };



  }, []);

  const listaUnica = [...solicitacoes, ...contatos].filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
  );
  function Chat(id: string, locadorId: string, locatarioId: string) {
    router.push({
      pathname: routes.ViewMenssage,
      params: {
        id,
        locadorId,
        locatarioId,
      },
    });
  }

  return (
    <View style={styles.containerFull}>
      {loading && <LoadingCarAnimation loading={loading} />}
      <FlatList
        data={listaUnica}
        renderItem={({ item }) => (
          <ContactItem
            item={item}
            onPress={() => Chat(item.id, item.locadorId, item.locatarioId)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
