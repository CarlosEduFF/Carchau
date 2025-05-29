import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Animated, Modal, Pressable, FlatList } from 'react-native';
import firebase from '../../../../config/firebase';
import { CheckBox, Divider } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './StylesProfile';

interface Avaliacao {
  id: string,
  nome: string,
  avaliacao: string,
  estrelas: number,
  fotoPerfil: string,
}
export default function InformacoesPessoais() {
  const [selectedIndex, setIndex] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [profissao, setProfissao] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [perfilImage, setPerfilImage] = useState<string | null>(null); // Estado inicial como null
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState<boolean | null>(null);
  const defaultProfileImage = require('../../../../assets/icons/Profile-Icon.png'); // Caminho local da imagem padrão
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [situ, setSitu] = useState('');
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]); // Estado para armazenar as avaliações
  const [userId, setUserId] = useState<string | null>(null); // Definição do estado para userId
  const [expandedId, setExpandedId] = useState<string | null>(null);


  const locatarioIdParam = useLocalSearchParams()?.locatarioId;
  const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (locatarioId) {
          // Dados do locatário
          const userDoc = await firebase.firestore().collection('Locatarios').doc(locatarioId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData) {
              setNome(userData.nome || '');
              setTelefone(userData.telefone || '');
              setEmail(userData.email || '');
              setProfissao(userData.profissao || '');

              if (userData.fotoPerfil) {
                setPerfilImage(userData.fotoPerfil);
              }
            }
          }

          // Dados do endereço (pega o primeiro documento da subcoleção)
          const enderecoSnapshot = await firebase
            .firestore()
            .collection('Locatarios')
            .doc(locatarioId)
            .collection('endereco')
            .limit(1)
            .get();

          if (!enderecoSnapshot.empty) {
            const enderecoDoc = enderecoSnapshot.docs[0];
            const enderecoData = enderecoDoc.data();
            if (enderecoData) {
              setCidade(enderecoData.cidade || '');
              setEstado(enderecoData.estado || '');

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
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      const fetchSolicitacoesLocador = async () => {
        if (!locatarioId) return;
        try {
          // Referência da coleção de avaliações para o locatário específico
          const locatariosRef = firebase.firestore().collection('Locatarios').doc(locatarioId).collection('avaliacoes');

          // Obtém todas as avaliações
          const locatariosSnapshot = await locatariosRef.get();

          // Cria uma array de promessas para buscar os dados de cada documento
          const solicitacoesPromises = locatariosSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              nome: data.nome || '',
              avaliacao: data.avaliacao || '',
              estrelas: data.estrelas || 0,
              fotoPerfil: data.fotoPerfil || '',
            } as Avaliacao;
          });

          // Espera por todas as avaliações e as organiza em um array
          const solicitacoes = await Promise.all(solicitacoesPromises);
          setAvaliacoes(solicitacoes); // Define as avaliações no estado

        } catch (error) {
          console.error('Erro ao buscar solicitações do locador: ', error);
          alert('Erro ao buscar solicitações do locador.');
        } finally {
          setLoading(false);
        }
      };

      fetchSolicitacoesLocador();
    }, [userId])
  );

  const renderItem = ({ item }: { item: Avaliacao }) => (
    <View style={styles.reviewItem}>
      <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.reviewHeader}>
        <Image
          source={
            item.fotoPerfil && item.fotoPerfil.startsWith('http')
              ? { uri: item.fotoPerfil }
              : defaultProfileImage
          }
          style={styles.avatar}
        />
        <View style={styles.reviewInfo}>
          <Text style={styles.name}>{item.nome}</Text>
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesome
                key={index}
                name={index < Math.floor(item.estrelas) ? 'star' : 'star-o'}
                size={16}
                color='#FFCD1B'
              />
            ))}
            <Text style={styles.rating}>{item.estrelas.toFixed(1)}</Text>
          </View>
        </View>
        <FontAwesome
          name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
          size={16}
          color='#fff'
        />
      </TouchableOpacity>

      {/* Exibe os detalhes apenas se a avaliação estiver expandida */}
      {expandedId === item.id && (
        <View style={styles.reviewDetails}>
          <Text style={styles.detailsText}>{item.avaliacao}</Text>
        </View>
      )}
    </View>
  );
  const handleImagePicker = async () => {
    const resultPerfilImage = await ImagePicker.launchImageLibraryAsync({
      aspect: [4, 4],
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (!resultPerfilImage.canceled) {
      setPerfilImage(resultPerfilImage.assets[0].uri); // Define a URI da imagem selecionada
    }
  };

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
          <Image style={styles.carlogo} source={require('../../../../assets/icons/Car-Logo.png')} />
        </Animated.View>
        <Text style={{ color: 'white' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.Topo}></View>
      <View style={{ alignItems: 'center' }}>
        {/* Verifica se há uma imagem selecionada, caso contrário usa a imagem padrão */}
        <Image
          style={styles.profileImage}
          source={perfilImage ? { uri: perfilImage } : defaultProfileImage}
        />
      </View>
      <View style={styles.caracteristicaLinha}>
        <MaterialCommunityIcons name="account" size={30} color="#f2a51a" />
        <Text style={styles.caracteristicaTexto}>{nome}</Text>
      </View>


      <View style={styles.caracteristicaLinha}>
        <MaterialCommunityIcons name="cellphone" size={30} color="#f2a51a" />
        <Text style={styles.caracteristicaTexto}>{telefone}</Text>
      </View>

      <View style={styles.caracteristicaLinha}>
        <MaterialCommunityIcons name="email" size={30} color="#f2a51a" />
        <Text style={styles.caracteristicaTexto}>{email}</Text>
      </View>
      <View style={[styles.caracteristicaLinha]}>
        <FontAwesome name="briefcase" size={24} color="#F2A51A" />
        <Text style={styles.textoexi}>{profissao}</Text>
      </View>

      <View style={styles.caracteristicaLinha}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <FontAwesome name="map-marker" size={24} color="#F2A51A" />
          <Text style={styles.textoexi}>{cidade}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="map" size={24} color="#F2A51A" />
          <Text style={styles.textoexi}>{estado}</Text>
        </View>
      </View>



      <Divider style={{ marginBottom: 20, marginTop: 10 }} />

      <View>
        <Text style={styles.caracteristicasTitle}>Avaliações</Text>
      </View>

      {loading ? (
        <Text>Carregando avaliações...</Text>
      ) : (
        <FlatList
          data={avaliacoes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}


    </View>
  );
}


