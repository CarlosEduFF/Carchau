import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './StylesCnh';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import { routes } from '~/constants/routes';
import colors from '~/constants/colors';
import { fetchLatestTermo } from '~/services/termsServices';
import { fetchCnhData } from '~/services/CnhService/CnhService';

export default function CNH() {
  const [frontCNH, setFrontCNH] = useState<string>('');
  const [backCNH, setBackCNH] = useState<string>('');
  const [existingImages, setExistingImages] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });
  const [termoAceito, setTermoAceito] = useState(false);
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);


  useEffect(() => {
    setLoading2(true);
    carregarTermo();
    loadCnhData();
    setLoading2(false);
  }, []);

  const loadCnhData = async () => {
    const data = await fetchCnhData();
    if (data) {
      setExistingImages({ front: data.fotoFront, back: data.fotoBack });
    }
    setLoading(false);
  };
  const carregarTermo = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (!id) return;

    try {
      const data = await fetchLatestTermo(id);
      if (data) {
        setTermoAceito(data.termoAceito);
        setIsCheckboxDisabled(data.termoAceito);
      }
    } catch (error) {
      console.error('Erro ao carregar termo:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView>
      <View style={styles.container}>
        {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
        <Text style={styles.text}>Visualize ou Cadastre sua CNH</Text>
        <Text style={styles.textocampo}>Para maior segurança, e conforme ordena  Art. 141 do CTB,
          cadastre as imagens da sua CNH.</Text>
        {/* Imagem da frente da CNH */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.textocampo}>Frente da CNH:</Text>
          {frontCNH || existingImages?.front ? (
            <Image
              style={styles.image}
              source={{ uri: (frontCNH || existingImages?.front) ?? '' }}
              onError={(error) => console.log("Erro ao carregar imagem:", error)}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome style={styles.icon} name="id-card-o" size={220} color={colors.amareloClaro} />
          )}
        </View>

        {/* Imagem do verso da CNH */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.textocampo}>Verso da CNH:</Text>
          {backCNH || existingImages?.back ? (
            <Image
              style={styles.image}
              source={{ uri: (backCNH || existingImages?.back) ?? '' }}
              onError={(error) => console.log("Erro ao carregar imagem:", error)}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome style={styles.icon} name="id-card-o" size={220} color={colors.amareloClaro} />
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 35, marginBottom: 5 }}>
          <CheckBox
            checked={termoAceito}
            checkedColor='#F2A51A'
            disabled={isCheckboxDisabled}
            containerStyle={{ backgroundColor: 'transparent', width: 0, paddingRight: 0, left: -20 }}
          />
          <Text style={{ color: '#fff', fontSize: 10, textAlign: 'justify' }}>Autorizo o uso da minha CNH e assinatura digitalizada no ato
            do meu cadastro, via site, aplicativo, de acordo com os Termos de Uso e da Política de Privacidade, para
            formalizar a abertura do meu contrato junto a carchau e para os demais documentos inerentes ao aluguel.{'\n'}
            <TouchableOpacity onPress={() => { router.replace(routes.termos) }}>
              <Text style={{ color: '#F2A51A', fontSize: 10, }}> Acessar termos de uso</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
          <TouchableOpacity style={styles.button} onPress={() => router.replace(routes.editCnh)}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Tirar foto da CNH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

