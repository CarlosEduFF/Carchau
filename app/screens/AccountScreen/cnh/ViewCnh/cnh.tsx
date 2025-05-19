import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { CheckBox } from '@rneui/themed';
import firebase from '../../../../../utils/firebase';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './StylesCnh';

export default function CNH() {
  const [frontCNH, setFrontCNH] = useState<string | null>(null);
  const [backCNH, setBackCNH] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<{ front: string, back: string } | null>(null);
  const [termoAceito, setTermoAceito] = useState(false);
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(false);

  const [loading, setLoading] = useState(true);
  // Buscar dados do usuário e verificar se ele já aceitou o termo de privacidade
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = await AsyncStorage.getItem('userId');
        if (uid) {
          const doc = await firebase.firestore().collection('Locatarios').doc(uid).collection('documentos').doc('cnh').get();
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              setExistingImages({ front: data.fotoFront, back: data.fotoBack });
            }
          }
        
          // Buscar a subcoleção "termos" dentro do documento do Locatario
          const termosSnapshot = await firebase.firestore()
            .collection('Locatarios')
            .doc(uid)
            .collection('termos')
            .orderBy('dataAceitacao', 'desc') // Ordena pelos termos mais recentes
            .limit(1) // Obtém o termo mais recente
            .get();

          if (!termosSnapshot.empty) {
            const termoData = termosSnapshot.docs[0].data();
            setTermoAceito(termoData.termoAceito || false);
            setIsCheckboxDisabled(termoData.termoAceito || false);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados da CNH: ", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleAcceptTerm = async () => {
    try {
      const uid = await AsyncStorage.getItem('userId');
      if (!uid) throw new Error("Usuário não encontrado. Faça login novamente.");

      await firebase.firestore().collection('Locatarios').doc(uid).update({
        termoPrivacidadeAceito: true,
      });

      setTermoAceito(true);
      setIsCheckboxDisabled(true);
      alert('Termo de privacidade aceito!');
    } catch (error) {
      console.error("Erro ao aceitar termo de privacidade: ", error);
      alert('Erro ao salvar aceitação do termo. Tente novamente.');
    }
  };

  

  const goToCNHPhoto = () => {
    router.replace('/screens/AccountScreen/cnh/EditCnh/editcnh');
  };

  const Privacy = () => {
    router.replace('../profile/privacy');
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
        <Image style={styles.carlogo} source={require('../../../../../assets/icons/Car-Logo.png')} />
      </Animated.View>
      <Text style={{ color: 'white' }}>Carregando...</Text>
    </View>
    );
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>Visualize ou Cadastre sua CNH</Text>
        <Text style={styles.textocampo}>Para maior segurança, e conforme ordena  Art. 141 do CTB,
           cadastre as imagens da sua CNH.</Text>
        {/* Imagem da frente da CNH */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.textocampo}>Frente da CNH:</Text>
          {frontCNH || existingImages?.front ? (
            <Image
              style={styles.image}
              source={{ uri: frontCNH || existingImages?.front }}
              onError={(error) => console.log("Erro ao carregar imagem:", error)}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome style={styles.icon} name="id-card-o" size={220} color="#f2a51a" />
          )}
        </View>

        {/* Imagem do verso da CNH */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.textocampo}>Verso da CNH:</Text>
          {backCNH || existingImages?.back ? (
            <Image
              style={styles.image}
              source={{ uri: backCNH || existingImages?.back }}
              onError={(error) => console.log("Erro ao carregar imagem:", error)}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome style={styles.icon} name="id-card-o" size={220} color="#f2a51a" />
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 35, marginBottom: 5 }}>
          <CheckBox
            checked={termoAceito}
            checkedColor='#F2A51A'
            disabled={isCheckboxDisabled}
            onPress={() => handleAcceptTerm()}
            containerStyle={{ backgroundColor: 'transparent', width: 0, paddingRight: 0, left: -20 }}
          />
          <Text style={{ color: '#fff', fontSize: 10, textAlign: 'justify' }}>Autorizo o uso da minha CNH e assinatura digitalizada no ato
            do meu cadastro, via site, aplicativo, de acordo com os Termos de Uso e da Política de Privacidade, para
            formalizar a abertura do meu contrato junto a carchau e para os demais documentos inerentes ao aluguel.{'\n'}
            <TouchableOpacity>
              <Text style={{ color: '#F2A51A', fontSize: 10, }}> Acessar termos de uso</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
          <TouchableOpacity style={styles.button} onPress={goToCNHPhoto}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Tirar foto da CNH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

