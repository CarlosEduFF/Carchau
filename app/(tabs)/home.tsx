import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../../config/firebase';
import { router } from 'expo-router';
import { AntDesign, Foundation } from '@expo/vector-icons';
import styles from '../Styles/StylesHome';
import CarCard from '~/components/CarCard';
import { routes } from '~/constants/routes';
import { fetchLocatariosDetails } from '~/services/userAllService';
import { fetchCarrosByLocatario } from '~/services/subscribeToAllCarsService';
import { Car } from '~/types/CarAds';
import HeaderBrands from '~/components/HeaderBrands';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import CustomModal from '~/components/CustomModal';

export default function HomeScreen() {
  const [carros, setCarros] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [carrosF, setCarrosF] = useState(carros);
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [situ, setSitu] = useState('');

  useEffect(() => {
    const unsubscribe = fetchRealTimeCars();
    return () => unsubscribe && unsubscribe();
  }, []);

  const fetchRealTimeCars = () => {
    try {
      const unsubscribe = firebase.firestore()
        .collection('Locatarios')
        .onSnapshot(async () => {
          try {
            const locatariosDetails = await fetchLocatariosDetails();

            const carrosPorLocatario = await Promise.all(
              locatariosDetails.map(async (locatario) => {
                const carros = await fetchCarrosByLocatario(locatario);

                return carros.map(carro => ({
                  ...carro,
                  owner: locatario.nome,
                  fotoLoca: locatario.fotoPerfil,
                  address: locatario.endereco,
                  LocaId: locatario.id,
                }));
              })
            );

            const allCars = carrosPorLocatario.flat();



            setCarros(allCars);



            setLoading(false);

          } catch (error) {
            console.error('Erro ao processar locatários e carros:', error);
            setLoading(false);
          }
        });

      return unsubscribe; // ✅ Correto retornar unsubscribe direto

    } catch (error) {
      console.error('Erro ao iniciar listener dos locatários:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = carros;

    if (selectedBrand) {
      filtered = filtered.filter((carro) => carro.marca === selectedBrand);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((carro) =>
        carro.modelo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setCarrosF(filtered);
  }, [selectedBrand, searchQuery, carros]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  function Veiculo(carroId: string, LocadorId: string | undefined) {
    router.push({
      pathname: routes.viewAds,
      params: { carroId: carroId, LocadorId: LocadorId },
    });
  }

  const footer = () => (
    <View style={{ margin: 90 }}>
    </View>
  );





  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      setSitu('Permissão negada para acessar as notificações.');
      setModalVisible(true);
      return;
    }
    setNotificationsAllowed(status === 'granted');
  };

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setSitu('Permissão negada para acessar a localização.');
      setModalVisible(true);
      return;
    }
  };

  useEffect(() => {
  if (!loading) {
    requestPermissions();
    startLocationTracking();
  }
}, [loading]);

  return (

    <View style={styles.container}>
      {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
      <View style={{ padding: 10, marginTop: 50 }}>
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
        </View>

        <FlatList
          data={carrosF}  // <-- usa a lista filtrada
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <HeaderBrands selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} />
          }
          ListFooterComponent={footer}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CarCard
              carro={item}
              type="view"
              onPress={() => Veiculo(item.id, item.LocaId)}
            />
          )}
        />

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={situ}
          confirmText="Entendi"
          onConfirm={() => {
            setModalVisible(false);
          }}
        />
      </View>
    </View>
  );
}
