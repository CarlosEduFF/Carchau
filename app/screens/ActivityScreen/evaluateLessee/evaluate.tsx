import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Animated, Modal, Pressable } from 'react-native';
import { AirbnbRating } from '@rneui/themed';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../utils/firebase';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import styles from './StylesEvaluateLessee';

export default function AvaliacaoLocatario() {
  const soliciIdParam = useLocalSearchParams()?.soliciId;
  const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
  const locadorIdParam = useLocalSearchParams()?.locadorId;
  const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
  const locatarioIdParam = useLocalSearchParams()?.locatarioId;
  const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
  const carroIdParam = useLocalSearchParams()?.carroId;
  const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState<string | null>(null);
  const [perfilImage, setPerfilImage] = useState<string | null>(null);
  const defaultProfileImage = require('../../../../assets/icons/Profile-Icon.png');
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState(''); // Mensagem do usuário
  const [rating, setRating] = useState(0);
  const [loading2, setLoading2] = useState<boolean | null>(null);
  // Definir significados para cada valor de estrelas
  const starMeanings = ['Péssimo', 'Ruim', 'OK', 'Bom', 'Ótimo']; // Padrão diretamente
  // Valor padrão da avaliação (estrelas)
  const [estadoavaliLT, setestadoavaliLT] = useState("Avaliado");

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const uid = await AsyncStorage.getItem('userId');
          if (uid) {
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

  // Função para salvar a avaliação, mensagem e outros dados
  const handleSave = async () => {
    try {
      const uid = await AsyncStorage.getItem('userId');
      if (!uid) {
        throw new Error("Usuário não encontrado. Faça login novamente.");
      }
      console.log(locadorId, locatarioId);
      console.log(carroId);
      const soliciRef = firebase.firestore().collection('Locatarios').doc(locatarioId).collection('solicitacoes').doc(soliciId);

      // Define o objeto para atualização sem fotoPerfil
      const dataToUpdate: {
        estadoavaliLT: string;
      } = {
        estadoavaliLT: estadoavaliLT,
        
      };

      // Adiciona a avaliação com a imagem de perfil (se houver)
      let fotoPerfilURL: string | null = null;

      if (perfilImage) {
        // Apenas faz upload da imagem no momento da adição da avaliação
        const response = await fetch(perfilImage);
        const blob = await response.blob();
        const storageRef = firebase.storage().ref().child(`imagemPerfil/${uid}`);
        const snapshot = await storageRef.put(blob);
        fotoPerfilURL = await snapshot.ref.getDownloadURL();
      }

      // Adiciona a avaliação no Firestore
      await firebase.firestore().collection('Locatarios').doc(locadorId).collection('carros').doc(carroId).collection('avaliacoes').add({
        nome,
        avaliacao: text,
        estrelas: rating,
        fotoPerfil: fotoPerfilURL || null, // Adiciona a fotoPerfil ou null
      });

      // Atualiza apenas o estado da solicitação (sem imagem de perfil)
      await soliciRef.update(dataToUpdate);
      setLoading2(false);
      setModalVisible(true)
      console.log('Avaliação enviada com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar avaliação: ", error);
      setModalVisible2(true);
      setLoading2(false);
    }
  };
  const translateX = useRef(new Animated.Value(-100)).current; // Inicia fora da tela à esquerda

  useEffect(() => {
    const animation = Animated.loop(
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
    );

    if (loading || loading2) {
      animation.start();
    }

    // Para parar a animação quando os carregamentos não estiverem ativos
    return () => animation.stop();
  }, [loading, loading2, translateX]);

  if (loading || loading2) {
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
    <ScrollView style={styles.container}>
        <View style={styles.Topo}></View>
      <Text style={styles.header}>Locação concluída com sucesso !!!</Text>
      <Text style={styles.text}>
        Parabéns, sua locação foi concluída com sucesso. Não deixe de avaliar como foi o seu período de aluguel.
      </Text>
      <View style={{ alignItems: 'center' }}>
        <Image style={styles.avatar} source={perfilImage ? { uri: perfilImage } : defaultProfileImage} />
      </View>

      <Text style={styles.nomelocador}> {nome} </Text>

      {/* Captura a avaliação de estrelas */}
      <View style={styles.starContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
            <FontAwesome
              name={index < rating ? 'star' : 'star-o'} // Preenche a estrela ou deixa vazia
              size={30}
              color="#FFD700" // Cor dourada para as estrelas preenchidas
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
      {/* Exibe o significado correspondente */}
      <View style={styles.starContainer}>
        {rating > 0 && <Text style={styles.meaning}>{starMeanings[rating - 1]}</Text>}
      </View>

      <Text style={styles.textocampo}> Deixe sua mensagem aqui: </Text>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <TextInput
          style={styles.textArea}
          placeholder="Escreva aqui..."
          placeholderTextColor="gray"
          multiline={true}
          numberOfLines={4}
          value={text}
          onChangeText={setText}
        />


        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.foco}>Avaliação realizada com Sucesso!</Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  router.push('/(tabs)/activity');
                }}>
                <Text style={styles.textStyle}>Entendi!</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalVisible2}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible2(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.foco}>Ocorreu algum erro, por favor, tente novamente!</Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible2(!modalVisible2);
                }}>
                <Text style={styles.textStyle}>Entendi!</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => { handleSave(), setLoading2(true) }}>
          <Text style={styles.textStyle}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView >
  );
}

