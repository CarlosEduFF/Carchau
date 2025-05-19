import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Keyboard, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../utils/firebase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { AntDesign, Foundation } from '@expo/vector-icons';
import styles from '../Styles/StylesHome';

// Car brands data
const carBrands = [

  { id: '1', name: 'BMW', image: require('../../assets/brands/BMW.png') },
  { id: '2', name: 'Chevrolet', image: require('../../assets/brands/Chevrolet.png') },
  { id: '3', name: 'Dodge', image: require('../../assets/brands/Dodge.png') },
  { id: '4', name: 'Fiat', image: require('../../assets/brands/Fiat.png') },
  { id: '5', name: 'Ford', image: require('../../assets/brands/Ford.png') },
  { id: '6', name: 'Honda', image: require('../../assets/brands/Honda.png') },
  { id: '7', name: 'Hyundai', image: require('../../assets/brands/Hyundai.png') },
  { id: '8', name: 'Jaguar', image: require('../../assets/brands/Jaguar.png') },
  { id: '9', name: 'Jeep', image: require('../../assets/brands/Jeep.png') },
  { id: '10', name: 'Nissan', image: require('../../assets/brands/Nissan.png') },
  { id: '11', name: 'Peugeot', image: require('../../assets/brands/Peugeot.png') },
  { id: '12', name: 'Renault', image: require('../../assets/brands/Renault.png') },
  { id: '13', name: 'Tesla', image: require('../../assets/brands/Tesla.png') },
  { id: '14', name: 'Toyota', image: require('../../assets/brands/Toyota.png') },
  { id: '15', name: 'VolksWagen', image: require('../../assets/brands/Volkswagen.png') },

];

interface Car {
  id: string;
  modelo: string;
  image: string;
  location: string;
  address: string;
  seats: number;
  rating: number;
  owner: string;
  precoDia?: string; // O preço por dia (opcional)
  precoSemana?: string; // O preço por semana (opcional)
  precoMes?: string; // O preço por mês (opcional)
  fotoLoca?: string; // Adiciona esta propriedade
  LocaId?: string;
  marca: string;
}


export default function HomeScreen() {
  const [nome, setNome] = useState<string | null>(null);
  const [perfilImage, setPerfilImage] = useState<string | null>(null);
  const [carros, setCarros] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // Termo de busca
  const defaultProfileImage = require('../../assets/icons/Profile-Icon.png');
  const defaultCarroImage = require('../../assets/icons/Car-Icon.png');
  const lupaImage = require('../../assets/icons/Search-Icon.png');
  const navigation = useNavigation();


  const [loading, setLoading] = useState(true);  // Estado de loading

  useEffect(() => {
    const fetchRealTimeCars = () => {
      try {
        // Inscreve-se para ouvir mudanças em 'Locatarios'
        const unsubscribeLocatarios = firebase.firestore().collection('Locatarios').onSnapshot(async (locatariosSnapshot) => {
          let allCars: any[] = [];

          const locatarioPromises = locatariosSnapshot.docs.map(async (locatarioDoc) => {
            // Busca os detalhes do locatário (endereço, por exemplo)
            const detalhesSnapshot = await locatarioDoc.ref.collection('endereco').get();
            const detalhesData = detalhesSnapshot.docs.length > 0 ? detalhesSnapshot.docs[0].data() : {};

            // Inscreve-se para ouvir mudanças em 'carros' para cada locatário
            const carrosSnapshot = await locatarioDoc.ref.collection('carros').get();

            const carrosData = await Promise.all(carrosSnapshot.docs.map(async (carroDoc) => {
              const carroData = carroDoc.data();
              // Define a imagem do carro ou usa uma padrão
              const fotosCarro = carroData.fotosCarro || [defaultCarroImage];
              const image = (typeof fotosCarro[0] === 'string') ? fotosCarro[0] : Image.resolveAssetSource(defaultCarroImage).uri;

              // Busca as avaliações do carro e calcula a média de estrelas
              const avaliacoesSnapshot = await carroDoc.ref.collection('avaliacoes').get();
              const avaliacoes = avaliacoesSnapshot.docs.map((doc) => doc.data().estrelas || 0);

              let total = 0;
              let rating = 0;

              if (avaliacoes.length > 0) {
                total = avaliacoes.reduce((a, b) => a + b, 0);
                rating = total / avaliacoes.length;
              }

              return {
                id: carroDoc.id,
                modelo: carroData.modelo || '',
                image: image,
                location: carroData.pontoencontro || '',
                address: detalhesData.endereco || 'Endereço não disponível', // Pegando o endereço da subcoleção
                marca: carroData.marca || '',
                seats: carroData.quantidadeLugares || 0,
                rating: rating,
                owner: locatarioDoc.data().nome || '',
                precoDia: carroData.precoDia || null,
                precoSemana: carroData.precoSemana || null,
                precoMes: carroData.precoMes || null,
                fotoLoca: locatarioDoc.data().fotoPerfil,
                LocaId: locatarioDoc.id,
              };
            }));

            // Filtra os carros com os dados necessários
            return carrosData.filter((carro) =>
              carro.modelo && carro.image && carro.address && carro.seats > 0 && carro.owner
            );
          });

          const allCarsArrays = await Promise.all(locatarioPromises);
          allCars = allCarsArrays.flat();

          // Atualiza o estado com os carros em tempo real
          setCarros(allCars);
          setLoading(false);
        });

        // Função de limpeza para desinscrever o listener quando o componente for desmontado
        return () => {
          unsubscribeLocatarios();
        };
      } catch (error) {
        console.error("Erro ao buscar carros em tempo real: ", error);
        setLoading(false);
      }
    };

    fetchRealTimeCars();
  }, []);





  // Função para limpar o campo de busca
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Função que lida com a ação de buscar (simulada aqui)
  const handleSearch = () => {
    console.log("Buscando por:", searchQuery);
    Keyboard.dismiss();
    const filteredCars = carros.filter((car) =>
      car.modelo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("Carros filtrados:", filteredCars);
  };


  // Fetch user data for profile
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




  // Função para abrir a tela do veículo
  function Veiculo(carroId: string, LocadorId: string | undefined) {

    router.push({
      pathname: '/screens/ActivityScreen/adsScreen/ads', // Caminho da tela que mostra os detalhes do veículo
      params: { carroId: carroId, LocadorId: LocadorId },   // Passa o carroId como parâmetro
    });
  }

  const renderCarItem = ({ item }: { item: Car }) => (
    <Pressable style={styles.carCard} onPress={() => Veiculo(item.id, item.LocaId)}>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.carName}>{item.marca} {item.modelo} </Text>
        <Text style={styles.carSeats}>{item.seats} Lugares</Text>
      </View>
      <Text style={styles.carLocation}>{item.location}</Text>
      <Image source={item.image && typeof item.image === 'string' ? { uri: item.image } : defaultCarroImage} style={styles.carImage} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', }}>


        {/* Exibir preço por Dia se disponível */}
        {item.precoDia && (
          <Text style={styles.preco}>R$ {item.precoDia} /dia</Text>
        )}

        {/* Exibir preço por Semana se disponível */}
        {item.precoSemana && (
          <Text style={styles.preco} >R$ {item.precoSemana} /semana</Text>
        )}

        {/* Exibir preço por Mês se disponível */}
        {item.precoMes && (
          <Text style={styles.preco}>R$ {item.precoMes} /mês</Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Exibir a foto do locatário */}
          <Image
            source={item.fotoLoca ? { uri: item.fotoLoca } : defaultProfileImage}
            style={styles.avatar}
          />
          <Text style={styles.carOwner}>{item.owner}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="star" style={{ marginTop: 5 }} size={18} color="#F2A50A" />
          <Text style={styles.carRating}>{item.rating}</Text>
        </View>
      </View>
    </Pressable>
  );




  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Função para filtrar os carros com base no termo de busca e na marca selecionada
  const filteredCarsBrand = carros.filter((car) => {
    const matchesSearchQuery = car.modelo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand ? car.marca.toLowerCase() === selectedBrand.toLowerCase() : true;  // Verifica se a marca corresponde à marca selecionada
    return matchesSearchQuery && matchesBrand;  // Retorna carros que atendem ambos os critérios
  });

  // Função para renderizar a marca no carrossel
  const renderBrandItem = ({ item }: { item: { id: string; name: string; image: any } }) => (
    <Pressable
      onPress={() => {
        if (selectedBrand === item.name) {
          setSelectedBrand(null);  // Desfaz a seleção se a mesma marca for pressionada novamente
        } else {
          setSelectedBrand(item.name);  // Atualiza a marca selecionada
        }
      }}
      style={[
        styles.brandContainer,
        selectedBrand === item.name && {
          width: 70,
          height: 70,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: '#a40101',
          padding: 20,
        }  // Destaque a marca selecionada
      ]}
    >
      <Image source={item.image} style={styles.brandImage} />
    </Pressable>
  );


  // Função para renderizar o cabeçalho
  const renderHeader = () => (
    <View>
      {/* Car Brands Carousel */}
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.title}>Marcas mais procuradas:</Text>
        <FlatList
          data={carBrands}
          renderItem={renderBrandItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.brandsCarousel}
        />
      </View>

      <Text style={styles.title}>Veículos Disponíveis</Text>
    </View>
  );

  const footer = () => (
    <View style={{ margin: 90 }}>
    </View>
  );

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
          <Image style={styles.carlogo} source={require('../../assets/icons/Car-Logo.png')} />
        </Animated.View>
        <Text style={{ color: 'white' }}>Carregando...</Text>
      </View>
    );
  }
  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.userIcon} source={perfilImage ? { uri: perfilImage } : defaultProfileImage} />
        <Text style={styles.headerText}>{nome ? nome : 'Carregando...'}</Text>
      </View>

      <View style={{ padding: 10, }}>
        <View style={styles.navigation}>
          <View style={styles.containerInput}>
            <TextInput
              placeholder="Buscar pelo modelo"
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}  // Atualiza o valor em tempo real
            />
            {/* Ícone "X" para limpar o campo de busca */}
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <AntDesign name="closecircle" size={20} color="#888" style={{ paddingRight: 3 }} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleSearch} style={styles.pressable}>
            <Foundation name="magnifying-glass" size={33} color="#b3bbbd" />
          </TouchableOpacity>
        </View>



        <FlatList
          data={filteredCarsBrand}  // Usar carros filtrados pela marca e termo de busca
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}  // Colocar o carrossel no cabeçalho
          ListFooterComponent={footer}
        />

      </View>
    </View>

  );
}
