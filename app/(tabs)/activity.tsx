import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../Styles/StylesActivity';
import { Request } from '~/types/Request';
import { StatusRequest } from '~/types/StatusRequest';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal';
import { listenSolicitacoesDoLocador } from '~/services/requestsLessorService';
import { listenSolicitacoesDoLocatario } from '~/services/requestsLesseeService';
import SolicitacaoItem from '~/components/RequestItem';
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

  // Toggle expand for solicitacoes accepted
  const toggleExpand = (id: string) => {
    setExpandedId((prevId) => {
      const novoId = prevId === id ? null : id;
      return novoId;
    });
  };

  // Load userId from AsyncStorage once on mount
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
        } else {
          console.warn('Nenhum userId encontrado no AsyncStorage');
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao carregar userId:', error);
        setLoading(false);
      }
    };
    loadUserId();
  }, []);

  // Listen to solicitacoes updates when userId is ready
  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      setLoading(true);

      const unsubscribeLocador = listenSolicitacoesDoLocador(
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

      const unsubscribeLocatario = listenSolicitacoesDoLocatario(
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
      {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}

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
            <SolicitacaoItem
              item={item}
              expandedId={expandedId}
              toggleExpand={toggleExpand}
              userId={userId}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <Text style={styles.foco}>{emptyMessage}</Text>
        </View>
      )}

      {selectedRequest && (
        <CustomModal
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
