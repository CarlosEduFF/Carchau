import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Switch } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../utils/firebase';
import 'firebase/firestore';
import styles from './StylesConfig';

const SwitchComponent = () => {

  function Deslogar() {
    router.replace('/');
  }

  const [checked, setChecked] = useState(false);

  // Função para buscar as preferências do usuário no Firestore
  const fetchUserData = async () => {
    try {
      const uid = await AsyncStorage.getItem('userId');
      if (uid) {
        const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          // Verifica se o campo 'notificacoesAtivadas' existe no Firestore e atualiza o estado
          if (userData && userData.notificacoesAtivadas !== undefined) {
            setChecked(userData.notificacoesAtivadas);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário: ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Função para salvar a preferência de notificações no Firestore
  const handleToggleNotifications = async (value: boolean | ((prevState: boolean) => boolean)) => {
    try {
      const uid = await AsyncStorage.getItem('userId');
      if (!uid) {
        throw new Error("Usuário não encontrado. Faça login novamente.");
      }

      // Atualiza o estado do switch localmente
      setChecked(value);

      // Atualiza a preferência de notificações no Firestore
      await firebase.firestore().collection('Locatarios').doc(uid).update({
        notificacoesAtivadas: value,
      });

      console.log('Preferências de notificações atualizadas.');
    } catch (error) {
      console.error("Erro ao atualizar preferências de notificações: ", error);
      alert('Erro ao atualizar preferências de notificações. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
<View
 style={styles.Topo}></View>
      <View style={styles.opcao}>
        <Text style={styles.text}>Permitir Notificações</Text>
        <Switch
          value={checked}
          onValueChange={handleToggleNotifications}
          thumbColor={checked ? '#ffffff' : '#ffffff'}
          trackColor={{ false: '#888888', true: '#FFCD1B' }}
        />
      </View>

      <TouchableOpacity style={styles.opcao} onPress={Deslogar}>
        <Text style={{ color: 'white' }}>Sair da conta</Text>
      </TouchableOpacity>

    </View>
  );
};



export default SwitchComponent;
