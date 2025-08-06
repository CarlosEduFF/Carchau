import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { Divider } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './StylesProfile';
import { Avaliacao } from '~/types/Evalue';
import { fetchUserData } from '~/services/userService';
import { fetchEndereco } from '~/services/addressService';
import { fetchAvaliacoes } from '~/services/evalueServices';
import AvaliacaoItem from '~/components/EvalueItem';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import images from '~/constants/images';
import { useLocalSearchParams } from 'expo-router';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]); // Estado para armazenar as avaliações
  const [userId, setUserId] = useState<string | null>(null); // Definição do estado para userId
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const locatarioIdParam = useLocalSearchParams()?.locatarioId;
  const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const loadUser = async () => {
    const userData = await fetchUserData(locatarioId);
    if (userData) {
      setNome(userData.nome);
      setNacionalidade(userData.nacionalidade);
      setTelefone(userData.telefone);
      setEmail(userData.email);
      setProfissao(userData.profissao);
      setIndex(userData.sexo === 'Masculino' ? 0 : 1);
      setPerfilImage(userData.fotoPerfil);
    }
    setLoading(false);
  };

  const loadEndereco = async () => {
    setLoading(true);
    const endereco = await fetchEndereco(locatarioId);
    if (endereco) {
      setCidade(endereco.cidade);
      setEstado(endereco.estado);
    }

    setLoading(false);
  };

  const carregarAvaliacoes = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (!id) return; // Checa o id, não o estado
    setUserId(id); // Atualiza o estado se quiser usar em outros lugares
    try {
      const data = await fetchAvaliacoes(locatarioId);
      setAvaliacoes(data);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    loadEndereco();
    carregarAvaliacoes();
  }, []);

  { (loading) && <LoadingCarAnimation loading={true} /> }

  return (
    <View style={styles.container}>
      <View style={styles.Topo}></View>
      <View style={{ alignItems: 'center' }}>
        {/* Verifica se há uma imagem selecionada, caso contrário usa a imagem padrão */}
        <Image
          style={styles.profileImage}
          source={perfilImage ? { uri: perfilImage } : images.defaultProfileImage}
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
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AvaliacaoItem
              item={item}
              expanded={expandedId === item.id}
              onToggleExpand={toggleExpand}
            />
          )}
        />
      )}
    </View>
  );
}


