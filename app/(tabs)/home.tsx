import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from '../Styles/StylesHome';
import { requestPermissions, Services } from '~/services/index';
import { Car } from '~/types/Ads/CarAds';
import { viewAds } from '~/utils/navigations/';
import { Components } from '~/components';

export default function HomeScreen() {
  const [carros, setCarros] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [carrosF, setCarrosF] = useState(carros);
  const [modalVisible, setModalVisible] = useState(false);
  const [situ, setSitu] = useState('');

  useEffect(() => {
    const unsubscribe = Services.listenRealTimeCars(
      (sortedCars) => {
        setCarros(sortedCars);
        setLoading(false);
      },
      (error) => {
        console.error('Erro no listener:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, []);

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

  useEffect(() => {
    if (!loading) {
      requestPermissions();
    }
  }, [loading]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const footer = () => (
    <View style={{ margin: 90 }}>
    </View>
  );


  return (

    <View style={styles.container}>
      {(loading || loading2) && <Components.LoadingCarAnimation loading={loading} loading2={loading2} />}
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
            <Components.HeaderBrands selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} />
          }
          ListFooterComponent={footer}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Components.CarCard
              carro={item}
              type="view"
              onPress={() => viewAds(item.id, item.LocaId)}
            />
          )}
        />

        <Components.CustomModal
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
