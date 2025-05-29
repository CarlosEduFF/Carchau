import { View, Text, Image, Button, StyleSheet, Alert, Modal, Pressable, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import correto
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import PagerView from 'react-native-pager-view';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
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



export default function Veiculo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [situ, setSitu] = useState('');
  const [modelo, setModelo] = useState('Não disponível');
  const [marca, setMarca] = useState('Não disponível');
  const [ano, setAno] = useState('Não disponível');
  const [placa, setPlaca] = useState('Não disponível');
  const [combustivel, setCombustivel] = useState('Não disponível');
  const [QuantidadeLugares, setQuantidadeLugares] = useState(0);
  const [selectedAr, setSelectedAr] = useState('Não disponível');
  const [selectedCambio, setSelectedCambio] = useState('Não disponível');
  const [selectedStep, setSelectedStep] = useState('Não disponível');
  const [selectedAirbags, setSelectedAirbags] = useState('Não disponível');
  const [pontoencontro, setPontoEncontro] = useState('Não disponível');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Inicializando como true para mostrar carregamento

  const [fotosCarro, setFotosCarro] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [precoDia, setPrecoDia] = useState(0);
  const [precoSemana, setPrecoSemana] = useState(0);
  const [precoMes, setPrecoMes] = useState(0);
  const [caucao, setCaucao] = useState(0);

  const [nomeLocatario, setNomeLocatario] = useState<string | null>(null);
  const [perfilImageLocatario, setPerfilImageLocatario] = useState<string | null>(null);
  const [nomeLocador, setNomeLocador] = useState<string | null>(null);
  const [perfilImageLocador, setPerfilImageLocador] = useState<string | null>(null);

  const carroIdParam = useLocalSearchParams()?.carroId;
  const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;
  const LocadorIdParam = useLocalSearchParams()?.LocadorId;
  const LocadorId = Array.isArray(LocadorIdParam) ? LocadorIdParam[0] : LocadorIdParam;


  const [nome, setNome] = useState('');
  const [cpf, setCPF] = useState('');
  const [profissao, setProfissao] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [index, setIndex] = useState(0);

  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const [existingImages, setExistingImages] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });

  const [LocadorID, setLocadorID] = useState("Não disponível");
  const [carroID, setCarroID] = useState("Não disponível");
  const [LocatarioId, setLocatarioId] = useState("Não disponível");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]); // Estado para armazenar as avaliações

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

  const loadCnhData = async () => {
    const data = await fetchCnhData();
    if (data) {
      setExistingImages({ front: data.fotoFront, back: data.fotoBack });
    }
    setLoading(false);
  };

  const loadUser = async () => {
    const userData = await fetchUserData();
    if (userData) {
      setNome(userData.nome);
      setNacionalidade(userData.nacionalidade);
      setTelefone(userData.telefone);
      setEmail(userData.email);
      setCPF(userData.cpf);
      setProfissao(userData.profissao);
      setIndex(userData.sexo === 'Masculino' ? 0 : 1);
    }
    setLoading(false);
  };

  const loadLocadorUser = async () => {
    const userData = await fetchUserData();
    if (userData) {
      setNomeLocador(userData.nome || 'Usuário');
      setPerfilImageLocador(userData.fotoPerfil || null);
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

  const fetchCarroData = async () => {
          try {
              if (carroId) {
                  const carro = await fetchCarroById(carroId);
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
              setIsUploading(false);
              setLoading(false);
          }
      };

  useEffect(() => {
    setLoading2(true);
    fetchCarroData();
    loadLocadorUser();
    loadUser();
    loadEndereco();
    loadCnhData();
    loadAvaliacoes();
    
    setLoading2(false);
  }, []);

  

  const Escolher = (CarroID: string, LocadorID: string) => {
    if (LocatarioId != LocadorId) {
      console.log("Carro:", CarroID, "Locador:", LocadorID);
      router.push({
        pathname: routes.viewSchedule, 
        params: { carroId: carroId, LocadorId: LocadorId },   
      });
    } else {
      setModalVisible2(true);
    }
  }

  const PerfilLocador = (LocadorID: string) => {
    if (LocatarioId != LocadorId) {
      console.log("Locador:", LocadorID);
      router.push({
        pathname: routes.viewOtherProfile, 
        params: { locatarioId: LocadorId },   
      });
    } else {
      setModalVisible2(true);
    }
  }

  const GerarChat = async () => {
    const chatId = [LocadorId, LocatarioId].sort().join('_'); // usado para redirecionar

    try {
      console.log(`Verificando contato para Locador ID: ${LocadorId}, Locatario ID: ${LocatarioId}`);

      const contatoId = chatId;
      const contatoRef = firebase.firestore().collection('Contatos').doc(contatoId);

      await firebase.firestore().runTransaction(async (transaction) => {
        const contatoDoc = await transaction.get(contatoRef);

        if (!contatoDoc.exists) {
          console.log('Contato não encontrado, criando novo contato...');
          transaction.set(contatoRef, {
            id: contatoId,
            locadorId: LocadorId,
            locatarioId: LocatarioId,
            locadornome: nomeLocador,
            locadorperfilImage: perfilImageLocador,
            locatarionome: nomeLocatario,
            locatarioperfilImage: perfilImageLocatario,
          });
          console.log('Contato criado com sucesso:', contatoId);
        } else {
          console.log('Contato já existe para essa solicitação');
          transaction.set(contatoRef, {}, { merge: true });
        }
      });
    } catch (error) {
      console.error('Erro ao criar/verificar contato: ', error);
      alert('Erro ao criar/verificar contato.');
    } finally {
      router.push({
        pathname: '/screens/chat/messages/message', // Caminho da tela que mostra os detalhes do veículo
        params: { id: chatId, locadorId: LocadorId, locatarioId: LocatarioId },   // Passa o carroId como parâmetro
      });
    }
  };
  const translateX = useRef(new Animated.Value(-100)).current; // Inicia fora da tela à esquerda
  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, [translateX]);

  if (loading) {
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
    <>
      <View style={styles.Topo}></View>
      <ScrollView style={styles.container}>

        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center',
          marginLeft: 10,
          marginTop: 60
        }} onPress={() => PerfilLocador(LocadorId)}>
          {/* Exibir a foto do locatário */}
          <Image
            source={perfilImageLocador ? { uri: perfilImageLocador } : images.defaultProfileImage}
            style={styles.avatar}
          />
          <Text style={{ color: 'white' }}>{nomeLocador}</Text>
        </TouchableOpacity>
        <Divider style={{ marginBottom: 20, marginTop: 10 }} />
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
        <Divider style={{ marginBottom: 20, marginTop: 10 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
            <Text style={[styles.caracteristicaTexto, { color: '#f2a51a' }]}>Modalidade: </Text>
            <View>
              {/* Exibir preço por Dia se disponível */}
              {precoDia && (
                <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]}>Dia: R$ {precoDia}</Text>
              )}

              {/* Exibir preço por Semana se disponível */}
              {precoSemana && (
                <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]} >Semana: R$ {precoSemana} </Text>
              )}

              {/* Exibir preço por Mês se disponível */}
              {precoMes && (
                <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]} >Mês: R$ {precoMes}</Text>
              )}
            </View>
          </View>
        </View>
        <Divider style={{ marginBottom: 20, marginTop: 10 }} />

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message='O aluguel só pode ser efetivado após
                todos os campos do perfil serem preenchidos
                corretamente!'
          confirmText="Entendi"
          onConfirm={() => {
            setModalVisible(!modalVisible);
          }}
        />

        <CustomModal
          visible={modalVisible2}
          onClose={() => setModalVisible2(false)}
          message='O locatário não pode alugar seu próprio veículo!'
          confirmText="Entendi"
          onConfirm={() => {
            setModalVisible2(!modalVisible2);
          }}
        />

        <View>
          <Text style={styles.caracteristicasTitle}>Avaliações</Text>
        </View>

        {/* Renderizar avaliações usando .map() */}
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
                      color='#FFCD1B'
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
        <View style={{ height: 80 }}></View>

      </ScrollView>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button]}
          onPress={() => {
            if (
              nomeLocatario === '' || nacionalidade === '' || telefone === '' ||
              email === '' || endereco === '' || !existingImages?.front || !existingImages?.back
            ) {
              setModalVisible(true);
            } else {
              Escolher(LocadorID, carroID);
            }
          }}>
          <Text style={styles.textStyle}>Alugar Carro</Text>
        </Pressable>

        <Pressable
          style={[styles.button]}
          onPress={() => {
            if (
              nomeLocatario === '' || nacionalidade === '' || telefone === '' ||
              email === '' || endereco === '' || !existingImages?.front || !existingImages?.back
            ) {
              setModalVisible(true);
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



