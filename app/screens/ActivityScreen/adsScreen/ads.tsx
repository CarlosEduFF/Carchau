import { View, Text, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Divider } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import styles from './StyleAds';
import images from '~/constants/images';
import { Services } from '~/services/';
import { PerfilLocador } from '~/services/navigationService';
import { Components } from '~/components';
import { Navigations } from '~/utils/navigations';
import Validators from '~/utils/Validators/index';

export default function Veiculo() {
  //modais
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [situ, setSitu] = useState('');

  // Variaveis Parametro
  const carroIdParam = useLocalSearchParams()?.carroId;
  const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;
  const LocadorIdParam = useLocalSearchParams()?.LocadorId;
  const LocadorId = Array.isArray(LocadorIdParam) ? LocadorIdParam[0] : LocadorIdParam;

  //Dados locatário
  const [LocatarioId, setLocatarioId] = useState('');
  const [nomeLocatario, setNomeLocatario] = useState('');
  const [perfilImageLocatario, setPerfilImageLocatario] = useState<string | null>(null);
  const [cpf, setCPF] = useState('');
  const [profissao, setProfissao] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [index, setIndex] = useState(0);

  //Endereço locatário
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  //CNH Locátario
  const [existingImages, setExistingImages] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });
  const [cnhvalida, setCNHValida] = useState<boolean | null>(null);
  //Dados Locador
  const [nomeLocador, setNomeLocador] = useState<string>('');
  const [perfilImageLocador, setPerfilImageLocador] = useState<string | null>(null);

  //Avaliações
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  //Loading
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);



  const loadLocadorUser = async () => {
    const userData = await Services.fetchUserData(LocadorId);
    if (userData) {
      setNomeLocador(userData.nome || 'Usuário');
      setPerfilImageLocador(userData.fotoPerfil || null);
    }
    setLoading(false);
  };

  const loadUser = async () => {
    const userData = await Services.fetchUserData();
    if (userData) {
      setNomeLocatario(userData.nome);
      setNacionalidade(userData.nacionalidade);
      setTelefone(userData.telefone);
      setEmail(userData.email);
      setCPF(userData.cpf);
      setProfissao(userData.profissao);
      setIndex(userData.sexo === 'Masculino' ? 0 : 1);
    }
    setLoading(false);
  };

  const loadEndereco = async () => {
    setLoading(true);
    const endereco = await Services.fetchAddress();
    if (endereco) {
      setCep(endereco.cep);
      setEndereco(endereco.endereco);
      setNumero(endereco.numero);
      setComplemento(endereco.complemento);
      setBairro(endereco.bairro);
      setCidade(endereco.cidade);
      setEstado(endereco.estado);
    }
    setLoading(false);
  };

  const loadCnhData = async () => {
    const data = await Services.fetchCnhData();
    if (data) {
      setExistingImages({ front: data.fotoFront, back: data.fotoBack });
      setCNHValida(data.cnhvalida); 
    }
    setLoading(false);
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading2(true);
        const uid = await Services.StorageService.getUserId();
        setLocatarioId(uid ?? '');
        await loadLocadorUser();
        await loadUser();
        await loadEndereco();
        await loadCnhData();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading2(false);
      }
    };
    carregarDados();
  }, []);


  return (
    <>
      <View style={styles.Topo}></View>
      <ScrollView style={styles.container}>

        {(loading || loading2) && <Components.LoadingCarAnimation loading={loading} loading2={loading2} />}
        <TouchableOpacity style={styles.LocadorProfile} onPress={() => PerfilLocador(LocadorId, LocatarioId)}>
          <Image
            source={perfilImageLocador ? { uri: perfilImageLocador } : images.defaultProfileImage}
            style={styles.avatar}
          />
          <Text style={styles.TextBranco}>{nomeLocador}</Text>
        </TouchableOpacity>

        <Divider style={styles.Divisor} />

        <Components.AdsCar carroId={carroId} LocadorId={LocadorId} />

        <Divider style={styles.Divisor} />

        <View>
          <Text style={styles.caracteristicasTitle}>Avaliações</Text>
        </View>

        <Components.AdsEvalue carroId={carroId} LocadorId={LocadorId} />

        <View style={{ height: 80 }} />

      </ScrollView>

      <Components.CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message='O aluguel só pode ser efetivado após todos os campos do perfil serem preenchidos corretamente!'
        confirmText="Entendi"
        onConfirm={() => {
          setModalVisible(!modalVisible);
        }}
      />

      <Components.CustomModal
        visible={modalVisible2}
        onClose={() => setModalVisible2(false)}
        message={situ}
        confirmText="Entendi"
        onConfirm={() => {
          setModalVisible2(!modalVisible2);
        }}
      />

      <Components.FloatingButton carroId={carroId} LocadorId={LocadorId} />
    </>
  );
}



