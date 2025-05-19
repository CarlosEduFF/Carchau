import { View, Image, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { router } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef, useState } from 'react';
import firebase from '../../utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import styles from '../Styles/StylesAccount';

export default function Account() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [sexoIndex, setIndex] = useState(0);
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const [frontCNH, setFrontCNH] = useState<string | null>(null);
  const [backCNH, setBackCNH] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<{ front: string, back: string } | null>(null);

  const [loading, setLoading] = useState(true);
  const AlertaImagem = require('../../assets/icons/Exclamation-Icon.png');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = await AsyncStorage.getItem('userId');
        if (uid) {
          const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData) {
              setNome(userData.nome || '');
              setNacionalidade(userData.nacionalidade || '');
              setTelefone(userData.telefone || '');
              setEmail(userData.email || '');
              setIndex(userData.sexo === 'Masculino' ? 0 : 1);
            }
          }
          const doc = await firebase.firestore().collection('Locatarios').doc(uid).collection('documentos').doc('cnh').get();
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              setExistingImages({ front: data.fotoFront, back: data.fotoBack });
            }
          }
          const useDocSnapshot = await firebase.firestore()
            .collection('Locatarios')
            .doc(uid)
            .collection('endereco')
            .get();

          if (!useDocSnapshot.empty) {
            // Obter o primeiro documento do snapshot
            const useDoc = useDocSnapshot.docs[0];
            const userData = useDoc.data();

            if (userData) {
              setEndereco(userData.endereco || '');
              setCep(userData.cep || '');
              setNumero(userData.numero || '');
              setComplemento(userData.complemento || '');
              setBairro(userData.bairro || '');
              setCidade(userData.cidade || '');
              setEstado(userData.estado || '');
            }
          } else {
            console.log('Nenhum registro encontrado na subcoleção endereco.');
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


  function handleImageClick() {
    setModalVisible(true);
  }

  function handleModalClose() {
    setModalVisible(false);
  }

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
      <TouchableOpacity style={styles.opcao} onPress={() => router.replace('/screens/AccountScreen/profile/ViewProfile/profile')}>
        <FontAwesome6 style={{ padding: 4 }} name="user-pen" size={20} color="#F2A51A" />
        <Text style={styles.text}>Dados Pessoais</Text>
        {(nome === '' || nacionalidade === '' || telefone === '' || email === '') && (
          <TouchableOpacity onPress={handleImageClick} style={styles.imageRight}>
            <Image style={styles.imageRight} source={AlertaImagem} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.opcao} onPress={() => router.replace('/screens/AccountScreen/address/ViewAddress/address')}>
        <Entypo style={{ padding: 4 }} name="location" size={24} color="#F2A51A" />
        <Text style={styles.text}>Endereço</Text>
        {(endereco === '' || cep === '' || telefone === '' || email === '') && (
          <TouchableOpacity onPress={handleImageClick} style={styles.imageRight}>
            <Image style={styles.imageRight} source={AlertaImagem} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace('/screens/AccountScreen/cnh/ViewCnh/cnh')}>
        <FontAwesome style={{ padding: 4 }} name="id-card" size={24} color="#F2A51A" />
        <Text style={styles.text}>CNH</Text>
        {(!existingImages?.front || !existingImages?.back) && (
          <TouchableOpacity onPress={handleImageClick} style={styles.imageRight}>
            <Image style={styles.imageRight} source={AlertaImagem} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace('/screens/AccountScreen/payment/ViewCardList/card-list')}>
        <MaterialIcons style={{ padding: 4 }} name="add-card" size={28} color="#F2A51A" />
        <Text style={styles.text}>Cartão de crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace('/screens/AccountScreen/location/LocationList/location-list')}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="car-multiple" size={24} color="#F2A51A" />
        <Text style={styles.text}>Minhas locações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace('/screens/AccountScreen/report/reportProblem')}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="wrench-outline" size={24} color="#F2A51A" />
        <Text style={styles.text}>Relatar Problema</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace('/screens/AccountScreen/terms/acept-terms')}>
        <MaterialIcons style={{ padding: 4 }} name="private-connectivity" size={26} color="#F2A51A" />
        <Text style={styles.text}>Termos e Condições</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace('/screens/AccountScreen/config/config-screen')}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="cogs" size={24} color="#F2A51A" />
        <Text style={styles.text}>Configurações</Text>
      </TouchableOpacity>



      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ color: 'red', fontSize: 20 }}>Aviso!</Text>
            <Text style={styles.textPriva}>
              Antes de começar a usufruir do Aplicativo e de{"\n"} nossos serviços, regularize sua conta!
            </Text>
            <TouchableOpacity style={styles.buttonPriva} onPress={handleModalClose}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

