import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Pressable, Modal } from 'react-native';
import firebase from '../../../../utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import styles from './StylesLogin';

export default function Login() {

  const showImage = require('../../../../assets/icons/Eye-Show.png');
  const hideImage = require('../../../../assets/icons/Eye-Hide.png');
  const BackImage = require('../../../../assets/icons/Back-Arrow.png');


  const [email, setEmail] = useState(""); // Mudou de CPF para email
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const [senhaError, setSenhaError] = useState('');
  const [error, setError] = useState('');
  const [resu, setResu] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Função para validar o formato do email
  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expressão regular para email
    if (emailRegex.test(text)) {
      setError(''); // Limpa o erro se o email for válido
    } else {
      setError('Email inválido');
    }
    setEmail(text);
  };

  const isValidPassword = (senha: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(senha);
  };
  const validateSenha = (text: string) => {
    if (isValidPassword(text)) {
      setSenhaError('');
    } else {
      setSenhaError('A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, números e símbolos.');
    }
    setSenha(text);
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      setResu("Por favor, preencha todos os campos.");
      setModalVisible(true);
      return;
    }
    if (!isValidPassword(senha)) {
      setResu("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, números e símbolos.");
      setModalVisible(true)
      return;
    }
    try {

      // Autenticar com o Firebase Auth (se o email estiver na forma de CPF)
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, senha);
      if (!userCredential.user) {
        throw new Error("Usuário não foi criado. Tente novamente.");
      }
      const userId = userCredential.user.uid;


      // Salvar dados do usuário no AsyncStorage
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userName', userCredential.user.displayName || 'Nome não disponível');

      router.replace('../../../(tabs)/home');
    } catch (error) {
      setResu("Erro ao autenticar usuário: Senha Incorreta.");
      setModalVisible(true);
      console.error("Erro ao autenticar usuário: ", error);

    }
  };


  const handlePasswordReset = async () => {
    if (!email) {
      setResu("Por favor, insira seu e-mail para recuperar a senha.");
      setModalVisible(true);
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setResu("Um link de recuperação de senha foi enviado para o seu email.");
      setModalVisible(true);
    } catch (error) {
      console.error("Erro ao enviar email de redefinição: ", error);
      setResu("Erro ao enviar email de redefinição. Verifique se o email está correto.");
      setModalVisible(true);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Image style={styles.circuloam} source={require('../../../../assets/ideia/circulo-amarelo.png')} />
          <Image style={styles.segundocirculo} source={require('../../../../assets/ideia/circulo-amarelo.png')} />
        </View>
        <View style={styles.caixalogin}>
          <Text style={styles.title}>Acessar minha conta</Text>
          <View style={styles.form}>
            <Text style={styles.textocampo}>Email</Text>
            <TextInput
              style={[styles.input, error ? { borderColor: 'red', borderWidth: 1 } : null]} // Destaca o campo se houver erro
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={text => validateEmail(text)} // Chama a função de validação ao digitar
              value={email}
              numberOfLines={1} // Adiciona esta linha
              multiline={false} // Adiciona esta linha
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Text style={styles.textocampo}>Senha</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={styles.input}
                textContentType="password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword} // Alterna a visibilidade da senha
                onChangeText={text => setSenha(text)}
                value={senha}
                numberOfLines={1} // Adiciona esta linha
                multiline={false} // Adiciona esta linha
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 10, marginTop: 40 }}>

                <Image
                  source={showPassword ? hideImage : showImage}
                  style={{ width: 24, height: 24 }} // Ajuste o tamanho conforme necessário
                />
              </TouchableOpacity>

            </View>
            <TouchableOpacity onPress={handlePasswordReset} style={{ marginTop: 20, marginLeft: 80 }}>
              <Text style={{ color: 'white', textAlign: 'center', textDecorationLine: 'underline' }}>Esqueci senha</Text>
            </TouchableOpacity>

            {senhaError ? <Text style={{ color: 'red' }}>{senhaError}</Text> : null}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={{ fontWeight: 'bold', margin: 10, color: 'white' }}>Acessar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.foco}>Atenção</Text>
            <Text style={styles.modalText}>
              {resu}
            </Text>
            <Pressable
              style={[styles.modalButton]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Entendi!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
