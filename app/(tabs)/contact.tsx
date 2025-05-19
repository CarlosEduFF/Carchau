import React, { useEffect, useId, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase, { firestore } from '../../utils/firebase';
import { router, useFocusEffect } from 'expo-router';
import styles from '../Styles/StylesContact';

// Definindo a interface para o tipo de solicitação
interface Solicitacao {
  id: string;
  locadorId: string;
  locatarioId: string;
  locatarionome: string;
  locatarioperfilImage: string,
  locadornome: string,
  locadorperfilImage: string,
  estado: string;
}

export default function Contatos() {
  const [loading2, setLoading2] = useState<boolean | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [perfilImage, setPerfilImage] = useState<string | null>(null);
  const defaultProfileImage = require('../../assets/icons/Profile-Icon.png');
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Função que busca as solicitações e verifica se deve criar um contato

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      setLoading(false);
    };

    fetchUserId();
  }, []);


  // Estado com o tipo definido como Solicitacao[]
  const [solicitacoesAceitas, setSolicitacoesAceitas] = useState<Solicitacao[]>([]);
  
  

  useEffect(() => {  
    const fetchSolicitacoesAceitas = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          alert('Usuário não está logado.');
          return;
        }
  

  
        const solicitacoesRef = firebase.firestore().collection(`Locatarios/${userId}/solicitacoes`)
          .where("estado", "==", "Aceito");

        const unsubscribe = solicitacoesRef.onSnapshot(async (solicitacoesSnapshot) => {
          const solicitacoesAceitasPromises = solicitacoesSnapshot.docs.map(async (doc) => {
            const data = doc.data();
  
            if (data.locadorId === userId || data.locatarioId === userId) {
              const solicitacaoDados: Solicitacao = {
                id: doc.id,
                locadorId: data.locadorId,
                locatarioId: data.locatarioId,
                locatarionome: data.locatarionome,
                locatarioperfilImage: data.locatarioperfilImage || null,
                locadornome: data.locadornome,
                locadorperfilImage: data.locadorperfilImage || null,
                estado: data.estado,
              };
  
              await verificarOuCriarContato(solicitacaoDados);
              return solicitacaoDados;
            }
            return null; // Retorna null para evitar undefined
          });
  
          const todasSolicitacoesAceitas = await Promise.all(solicitacoesAceitasPromises);
          setSolicitacoesAceitas(
            todasSolicitacoesAceitas.filter((item): item is Solicitacao => item !== null)
          );
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao buscar solicitações aceitas: ', error);
      }
    };
  
    fetchSolicitacoesAceitas();
  }, []);
  
  


  useEffect(() => {
    const ExibirContatos = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          alert('Usuário não está logado.');
          return;
        }

        // Referência à coleção 'Contatos'
        const contatosRef = firebase.firestore().collection('Contatos');

        // Listener para contatos onde o usuário logado é locatário
        const unsubscribeLocatario = contatosRef
          .where('locatarioId', '==', userId)
          .onSnapshot((contatosSnapshot) => {
            const contatos = contatosSnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                locadorId: data.locadorId || '',
                locatarioId: data.locatarioId || '',
                locatarionome: data.locatarionome || '',
                locatarioperfilImage: data.locatarioperfilImage || null,
                locadornome: data.locadornome || '',
                locadorperfilImage: data.locadorperfilImage || null,
                estado: data.estado || '',
              };
            });
            setSolicitacoes((prevSolicitacoes) => [
              ...prevSolicitacoes,
              ...contatos,
            ]);
            setLoading(false);
          });

        // Listener para contatos onde o usuário logado é locador
        const unsubscribeLocador = contatosRef
          .where('locadorId', '==', userId)
          .onSnapshot((contatosLocadorSnapshot) => {
            const contatosLocador = contatosLocadorSnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                locadorId: data.locadorId || '',
                locatarioId: data.locatarioId || '',
                locatarionome: data.locatarionome || '',
                locatarioperfilImage: data.locatarioperfilImage || null,
                locadornome: data.locadornome || '',
                locadorperfilImage: data.locadorperfilImage || null,
                estado: data.estado || '',
              };
            });
            setSolicitacoes((prevSolicitacoes) => [
              ...prevSolicitacoes,
              ...contatosLocador,
            ]);
            setLoading(false);
          });

        // Retorna uma função de cleanup para desativar os listeners
        return () => {
          unsubscribeLocatario();
          unsubscribeLocador();
        };
      } catch (error) {
        console.error('Erro ao exibir contatos:', error);
        setLoading(false);
      }
    };

    ExibirContatos();
  }, []);


  // Função para verificar ou criar contato
  const verificarOuCriarContato = async (solicitacao: Solicitacao) => {
    try {
      console.log(`Verificando contato para Locador ID: ${solicitacao.locadorId}, Locatario ID: ${solicitacao.locatarioId}`);

      // Criar um ID único para o documento baseado nos IDs do locador e locatário
      const contatoId = [solicitacao.locadorId, solicitacao.locatarioId].sort().join('_');
      const contatoRef = firebase.firestore().collection('Contatos').doc(contatoId);

      // Usar uma transação para garantir atomicidade
      await firebase.firestore().runTransaction(async (transaction) => {
        const contatoDoc = await transaction.get(contatoRef);

        if (!contatoDoc.exists) {
          console.log('Contato não encontrado, criando novo contato...');
          transaction.set(contatoRef, {
            id: contatoId,
            locadorId: solicitacao.locadorId,
            locatarioId: solicitacao.locatarioId,
            locadornome: solicitacao.locadornome,
            locadorperfilImage: solicitacao.locadorperfilImage,
            locatarionome: solicitacao.locatarionome,
            locatarioperfilImage: solicitacao.locatarioperfilImage,
            estado: solicitacao.estado,
          });
          console.log('Contato criado com sucesso:', contatoId);
        } else {
          console.log('Contato já existe para essa solicitação');
          // Opcionalmente, você pode atualizar informações aqui se necessário
          transaction.set(contatoRef, {
            estado: solicitacao.estado,
            // Adicione outros campos que você quer atualizar
          }, { merge: true });
        }
      });

    } catch (error) {
      console.error('Erro ao criar/verificar contato: ', error);
      alert('Erro ao criar/verificar contato.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const uid = await AsyncStorage.getItem('userId');
          if (uid) {
            console.log(uid);
            const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              if (userData) {
                setNome(userData.nome || 'Usuário');
                setPerfilImage(userData.fotoPerfil || null);
              }
            }
          }
          setLoading(false);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário: ", error);
          setLoading(false);
        }
      };
      fetchUserData();
    }, [])
  );


  // Renderizando as solicitações (função corrigida, movida para antes do uso)
  // Dentro da função renderSolicitacao, verifique o ID do usuário
  const renderSolicitacao = ({ item }: { item: Solicitacao }) => {
    if (!userId) return null; // Retorna null se o userId ainda não estiver carregado
  
    const isLocador = userId === item.locadorId;
  
    return (
      <TouchableOpacity
        style={styles.solicitacaoContainer}
        onPress={() =>
          Chat(
            item.id,
            item.locadorId,
            item.locatarioId,

          )
        }
      >
        <Image
          source={
            isLocador
              ? item.locatarioperfilImage
                ? { uri: item.locatarioperfilImage }
                : defaultProfileImage
              : item.locadorperfilImage
                ? { uri: item.locadorperfilImage }
                : defaultProfileImage
          }
          style={styles.image}
        />
        <Text style={styles.text}>
          {isLocador ? item.locatarionome : item.locadornome}
        </Text>
      </TouchableOpacity>
    );
  };
  

  function Chat(
    id: string,
    LocadorId: string,
    LocatarioId: string,
  ) {
    console.log("Locador", LocadorId, "Locatario", LocatarioId, "LodI");
    router.push({
      pathname: '/screens/chat/messages/message',
      params: {
        id: id,
        locadorId: LocadorId,
        locatarioId: LocatarioId,
      },
    });

  }



  const translateX = useRef(new Animated.Value(-100)).current; // Inicia fora da tela à esquerda

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 100, // Mova 100 pixels para a direita
          duration: 1000, // Duração da animação
          useNativeDriver: true, // Usa a API nativa para melhor performance
        }),
        Animated.timing(translateX, {
          toValue: -100, // Retorna à posição inicial
          duration: 0, // Sem duração para retornar
          useNativeDriver: true,
        }),
      ])
    );

    if (loading || loading2) {
      animation.start();
    }

    // Para parar a animação quando os carregamentos não estiverem ativos
    return () => animation.stop();
  }, [loading, loading2, translateX]);

  if (loading || loading2) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={{ transform: [{ translateX }] }}>
        <Image style={styles.carlogo} source={require('../../assets/icons/Car-Logo.png')} />
        </Animated.View>
        <Text style={{ color: 'white' }}>Carregando...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
        
      <FlatList
        data={solicitacoes}
        renderItem={renderSolicitacao}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}




