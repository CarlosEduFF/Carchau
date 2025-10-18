import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../Styles/StylesActivity';
import { Request, StatusRequest } from '~/types/index';
import { Services } from '~/services';
import { Components } from '~/components';

export default function AtividadeScreen() {
  type RequestComStatus = Request & { status: StatusRequest };
  const [solicitacoesLocador, setSolicitacoesLocador] = useState<RequestComStatus[]>([]);
  const [solicitacoesLocatario, setSolicitacoesLocatario] = useState<RequestComStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [activeTab, setActiveTab] = useState<'suas' | 'recebidas'>('suas');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const solicitacoesData = activeTab === 'suas' ? solicitacoesLocatario : solicitacoesLocador;
  const emptyMessage = 'Nenhuma solicitação encontrada';

  const toggleExpand = (id: string) => {
    setExpandedId((prevId) => {
      const novoId = prevId === id ? null : id;
      return novoId;
    });
  };

  const loadUserId = async () => {
    const id = await Services.StorageService.getUserId();
    if (id) {
      setUserId(id);
    } else {
      console.warn("Nenhum userId encontrado no AsyncStorage");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      setLoading(true);
      const unsubscribeLocador = Services.listenRequestLessor(
        userId,
        (solicitacoesFiltradas) => {
          setSolicitacoesLocador(solicitacoesFiltradas);
          setLoading(false);
          setLoading2(false);
        },
        (error) => {
          console.error('Erro ao buscar solicitações do locador:', error);
          alert('Erro ao buscar solicitações do locador.');
          setLoading(false);
          setLoading2(false);
        }
      );

      const unsubscribeLocatario = Services.listenRequestLesse(
        userId,
        (solicitacoes) => {
          setSolicitacoesLocatario(solicitacoes);
          setLoading(false);
          setLoading2(false);
        },
        (error) => {
          console.error('Erro ao buscar solicitações do locatário:', error);
          alert('Erro ao buscar solicitações do locatário.');
          setLoading(false);
          setLoading2(false);
        }
      );

      return () => {
        unsubscribeLocador();
        unsubscribeLocatario();
        console.log(solicitacoesData);
      };
    }, [userId])
  );

  return (
    <View style={styles.container}>
      {(loading || loading2) && <Components.LoadingCarAnimation loading={loading} loading2={loading2} />}

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'suas' && styles.activeTab]}
          onPress={() => setActiveTab('suas')}
        >
          <Text style={styles.tabText}>Suas Solicitações</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'recebidas' && styles.activeTab]}
          onPress={() => setActiveTab('recebidas')}
        >
          <Text style={styles.tabText}>Solicitações Recebidas</Text>
        </TouchableOpacity>
      </View>

      {solicitacoesData.length > 0 ? (
        <FlatList<Request & { status: StatusRequest }>
          data={solicitacoesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Components.RequestItem
              item={item}
              expandedId={expandedId}
              toggleExpand={toggleExpand}
              userId={userId}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View style={styles.EmptyList}>
          <Text style={styles.foco}>{emptyMessage}</Text>
        </View>
      )}

      {selectedRequest && (
        <Components.CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={`A solicitação foi enviada e está em processo de análise pelo locador, aguarde a resposta.\n\nSolicitante: ${selectedRequest.locatarionome}\nDescrição: ${selectedRequest.descricao}`}
          confirmText="Entendi"
          onConfirm={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}
