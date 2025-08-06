import { View, Text, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Divider } from '@rneui/themed';
import Entypo from '@expo/vector-icons/Entypo';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import styles from './StyleAds';
import images from '~/constants/images';
import CustomModal from '~/components/CustomModal';
import { Avaliacao } from '~/types/Evalue';
import { fetchAvaliacoesByCar } from '~/services/evalueCarService';
import { fetchEndereco } from '~/services/addressService';
import { fetchUserData } from '~/services/userService';
import { fetchCnhData } from '~/services/cnhService';
import { fetchCarroById } from '~/services/carService';
import { routes } from '~/constants/routes';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import contactService from '~/services/contactService';
import { validarCampos } from '~/utils/validators';
import { ChatGerado, Escolher, PerfilLocador } from '~/services/navigationService';


export default function Veiculo() {
  //modais
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [situ, setSitu] = useState('');

  //Dados Carros
  const [carroID, setCarroID] = useState("Não disponível");
  const [modelo, setModelo] = useState('Não disponível');
  const [marca, setMarca] = useState('Não disponível');
  const [ano, setAno] = useState(0);
  const [placa, setPlaca] = useState('Não disponível');
  const [combustivel, setCombustivel] = useState('Não disponível');
  const [QuantidadeLugares, setQuantidadeLugares] = useState(0);
  const [selectedAr, setSelectedAr] = useState('Não disponível');
  const [selectedCambio, setSelectedCambio] = useState('Não disponível');
  const [selectedStep, setSelectedStep] = useState('Não disponível');
  const [selectedAirbags, setSelectedAirbags] = useState('Não disponível');
  const [pontoencontro, setPontoEncontro] = useState('Não disponível');
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [precoDia, setPrecoDia] = useState(0);
  const [precoSemana, setPrecoSemana] = useState(0);
  const [precoMes, setPrecoMes] = useState(0);
  const [caucao, setCaucao] = useState(0);
  const [fotosCarro, setFotosCarro] = useState<string[]>([]);

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

  //Dados Locador
  const [nomeLocador, setNomeLocador] = useState<string>('');
  const [perfilImageLocador, setPerfilImageLocador] = useState<string | null>(null);

  //Avaliações
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]); // Estado para armazenar as avaliações

  //Loading
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const fetchCarroData = async () => {
    try {
      if (carroId && LocadorId) {
        const carro = await fetchCarroById(LocadorId, carroId);
        if (carro) {
          setModelo(carro.modelo);
          setMarca(carro.marca);
          setAno(carro.ano);
          setPlaca(carro.placa);
          setCombustivel(carro.combustivel);
          setQuantidadeLugares(carro.quantidadeLugares);
          setSelectedAr(carro.arCondicionado);
          setSelectedStep(carro.step);
          setSelectedCambio(carro.cambio);
          setSelectedAirbags(carro.airbags);
          setPontoEncontro(carro.pontoencontro);
          setSelectedPeriods(carro.modalidadesAluguel);
          setPrecoDia(carro.precoDia);
          setPrecoSemana(carro.precoSemana);
          setPrecoMes(carro.precoMes);
          setCaucao(carro.caucao);
          if (carro.fotosCarro) setFotosCarro(carro.fotosCarro);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do carro: ", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocadorUser = async () => {
    const userData = await fetchUserData(LocadorId);
    if (userData) {
      setNomeLocador(userData.nome || 'Usuário');
      setPerfilImageLocador(userData.fotoPerfil || null);
    }
    setLoading(false);
  };

  const loadUser = async () => {
    const userData = await fetchUserData();
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
    const endereco = await fetchEndereco();

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
    const data = await fetchCnhData();
    if (data) {
      setExistingImages({ front: data.fotoFront, back: data.fotoBack });
    }
    setLoading(false);
  };

  const loadAvaliacoes = async () => {
    if (!LocadorId || !carroId) return;
    setLoading(true);
    try {
      const resultado = await fetchAvaliacoesByCar(LocadorId, carroId);
      setAvaliacoes(resultado);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading2(true);

        const uid = await AsyncStorage.getItem('userId');
        setLocatarioId(uid ?? '');

        await fetchCarroData();
        await loadLocadorUser();
        await loadUser();
        await loadEndereco();
        await loadCnhData();
        await loadAvaliacoes();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading2(false);
      }
    };

    carregarDados();
  }, []);


  const GerarChat = async () => {
    try {
      const chatId = await contactService.criarOuBuscarChat(
        LocadorId,
        LocatarioId,
        nomeLocador,
        perfilImageLocador,
        nomeLocatario,
        perfilImageLocatario
      );
      ChatGerado(chatId, LocadorId, LocatarioId);
    } catch (error) {
      console.error('Erro ao criar ou buscar chat:', error);
      setSitu('Erro ao criar ou buscar chat.');
      setModalVisible2(true);
    }
  };

  const { valido, camposVazios } = validarCampos(
    {
      nomeLocatario,
      nacionalidade,
      telefone,
      email,
      profissao,
      cpf,
      endereco,
      cep,
      numero,
      bairro,
      cidade,
      estado,
      frontImage: existingImages?.front,
      backImage: existingImages?.back,
    },
    [
      'nomeLocatario',
      'nacionalidade',
      'telefone',
      'email',
      'profissao',
      'cpf',
      'endereco',
      'cep',
      'numero',
      'bairro',
      'cidade',
      'estado',
      'frontImage',
      'backImage',
    ]
  );

  return (
    <>
      <View style={styles.Topo}></View>
      <ScrollView style={styles.container}>

        {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
        <TouchableOpacity style={styles.LocadorProfile} onPress={() => PerfilLocador(LocadorId, LocatarioId)}>
          <Image
            source={perfilImageLocador ? { uri: perfilImageLocador } : images.defaultProfileImage}
            style={styles.avatar}
          />
          <Text style={styles.TextBranco}>{nomeLocador}</Text>
        </TouchableOpacity>

        <Divider style={styles.Divisor} />

        <Text style={styles.modeloCarro}>{marca} {modelo}  </Text>
        <Text style={styles.anoCarro}>Ano {ano}</Text>

        {fotosCarro.length > 0 ? (
          <PagerView
            style={styles.pageview}
            initialPage={0}
            onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)} // Atualizando o índice ativo
          >
            {fotosCarro.map((fotoUri, index) => (
              <View key={index} style={styles.page}>
                <Image
                  ref={flatListRef}
                  key={index}
                  source={{ uri: fotoUri }}
                  style={styles.vehicleImage}
                />
              </View>
            ))}
          </PagerView>
        ) : (
          <View style={styles.page2}>
            <Image
              source={images.defaultVehicleImage} // Imagem padrão
              style={styles.vehicleImage2} // Estilo apropriado para a imagem padrão
            />
          </View>
        )}
        <View style={styles.pagination}>
          {fotosCarro.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? '#f2a51a' : '#888', width: index === activeIndex ? 9 : 7, height: index === activeIndex ? 9 : 7, marginBottom: 15, } // Amarelo para o ativo, cinza para os outros
              ]}
            />
          ))}
        </View>

        <Text style={styles.caracteristicasTitle}>Características</Text>
        <View style={styles.ViewCarac}>
          <View >
            <View style={styles.caracteristicaLinha}>
              <FontAwesome name="tachometer" size={30} color="#f2a51a" />
              <Text style={styles.caracteristicaTexto}>Combustível:{'\n'}{combustivel}</Text>
            </View>
            <View style={styles.caracteristicaLinha}>
              <MaterialCommunityIcons name="car-seat" size={30} color="#f2a51a" />
              <Text style={styles.caracteristicaTexto}>Lugares: {'\n'}{QuantidadeLugares}</Text>
            </View>
            <View style={styles.caracteristicaLinha}>
              <MaterialCommunityIcons name="airbag" size={30} color="#f2a51a" />
              <Text style={styles.caracteristicaTexto}>Airbags:{'\n'}{selectedAirbags}</Text>
            </View>
          </View>
          <View>
            <View style={styles.caracteristicaLinha}>
              <MaterialCommunityIcons name="car-shift-pattern" size={30} color="#f2a51a" />
              <Text style={styles.caracteristicaTexto}>Câmbio:{'\n'}{selectedCambio}</Text>
            </View>
            <View style={styles.caracteristicaLinha}>
              <FontAwesome name="snowflake-o" size={30} color="#f2a51a" />
              <Text style={styles.caracteristicaTexto}>Ar-condicionado:{'\n'}{selectedAr}</Text>
            </View>
            <View style={styles.caracteristicaLinha}>
              <MaterialCommunityIcons name="tire" size={30} color="#f2a51a" />
              <Text style={styles.caracteristicaTexto}>Estepe: {'\n'}{selectedStep}</Text>
            </View>
          </View>
        </View>

        <Divider style={styles.Divisor} />

        <View style={styles.ViewCarac}>
          <View >
            <View style={styles.caracteristicaLinha}>
              <FontAwesome6 name="money-bill-transfer" size={26} color="#f2a51a" />
              <Text style={styles.caracteristicaTexto}>Caução:{'\n'}R$ {caucao}</Text>
            </View>
          </View>
          <View>
            <View style={styles.caracteristicaLinha}>
              <Entypo name="location" size={30} color="#f2a51a" />
              <Text style={styles.caracteristicaTexto}>Ponto de Encontro:{'\n'}{pontoencontro}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.caracteristicaLinha, { justifyContent: 'center' }]}>
          <FontAwesome name="calendar" size={42} color="#f2a51a" />
          <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.caracteristicaTexto, { color: '#f2a51a' }]}>
              Modalidade:
            </Text>
            {precoDia ? (
              <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]}>
                Dia: R$ {precoDia}
              </Text>
            ) : null}
            {precoSemana ? (
              <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]}>
                Semana: R$ {precoSemana}
              </Text>
            ) : null}
            {precoMes ? (
              <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]}>
                Mês: R$ {precoMes}
              </Text>
            ) : null}
          </View>
        </View>

        <Divider style={styles.Divisor} />

        <View>
          <Text style={styles.caracteristicasTitle}>Avaliações</Text>
        </View>

        {avaliacoes.map((item) => (
          <View key={item.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image
                source={
                  item.fotoPerfil && item.fotoPerfil.startsWith('http')
                    ? { uri: item.fotoPerfil }
                    : images.defaultProfileImage
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
                      color="#FFCD1B"
                    />
                  ))}
                  <Text style={styles.rating}>{item.estrelas}</Text>
                </View>
              </View>
            </View>

            <View style={styles.reviewDetails}>
              <Text style={styles.detailsText}>{item.avaliacao}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 80 }} />

      </ScrollView>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message='O aluguel só pode ser efetivado após todos os campos do perfil serem preenchidos corretamente!'
        confirmText="Entendi"
        onConfirm={() => {
          setModalVisible(!modalVisible);
        }}
      />

      <CustomModal
        visible={modalVisible2}
        onClose={() => setModalVisible2(false)}
        message={situ}
        confirmText="Entendi"
        onConfirm={() => {
          setModalVisible2(!modalVisible2);
        }}
      />

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button]}
          onPress={() => {
            if (!valido) {
              setSitu('Campos vazios: ' + camposVazios.join(', '));
              setModalVisible2(true);
            } else {
              Escolher(carroId, LocadorId, LocatarioId);
            }
          }}
        >
          <Text style={styles.textStyle}>Alugar Carro</Text>
        </Pressable>

        <Pressable
          style={[styles.button]}
          onPress={() => {
            if (LocadorId === LocatarioId)  {
              setSitu("Você não pode criar um chat consigo mesmo.");
              setModalVisible2(true);
            } else {
              GerarChat();
            }
          }}>
          <Text style={styles.textStyle}>Chat</Text>
        </Pressable>
      </View>
    </>
  );
}



