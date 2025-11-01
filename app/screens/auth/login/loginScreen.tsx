import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import styles from './StylesLogin';
import images from '~/constants/images';
import { routes } from '~/constants/routes';
import { Services } from '~/services';
import { Components } from '~/components';
import Validators from '~/utils/Validators/index';
import colors from '~/constants/colors';


export default function Login() {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [senhaError, setSenhaError] = useState('');
  const [error, setError] = useState('');
  const [resu, setResu] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    if (Validators.isValidEmail(text)) {
      setError("");
    } else {
      setError("Email inválido");
    }
  };

  const showMessage = (msg: string) => {
    setResu(msg);
    setModalVisible(true);
  };


  const handleLogin = async () => {
    setLoading(true);
    if (!email || !senha) {
      showMessage("Por favor, preencha todos os campos.");
      return;
    }
    if (!Validators.isValidPassword(senha)) {
      setResu("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, números e símbolos.");
      setModalVisible(true)
      return;
    }
    try {
      const userId = await Services.loginUser(email, senha);
      router.replace(routes.home);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setResu(error.message);
      setModalVisible(true);
    }finally{
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const message = await Services.ResetPassword(email);
      setResu(message);
      setModalVisible(true);
      setLoading(false);
    } catch (error: any) {
      setResu(error.message);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          {(loading || loading2) && <Components.LoadingCarAnimation loading={loading} loading2={loading2} />}
          <View>
            <Image style={styles.circuloam} source={images.circuloAmarelo} />
            <Image style={styles.segundocirculo} source={images.circuloAmarelo} />
          </View>
          <View style={styles.caixalogin}>
            <Text style={styles.title}>Acessar minha conta</Text>
            <View style={styles.form}>
              <Text style={styles.textocampo}>Email</Text>
              <TextInput
                style={[styles.input, error ? { borderColor: 'red', borderWidth: 1 } : null]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={text => validateEmail(text)}
                value={email}
                numberOfLines={1}
                multiline={false} />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Text style={styles.textocampo}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  textContentType="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  onChangeText={text => setSenha(text)}
                  value={senha}
                  numberOfLines={1}
                  multiline={false} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Image
                    source={showPassword ? images.hideImage : images.showImage}
                    style={{ width: 22, height: 22, tintColor: colors.amareloClaro }} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={handlePasswordReset} style={{ marginBottom: 50, marginLeft: 80 }}>
              <Text style={{ color: colors.amareloClaro, textAlign: 'center', textDecorationLine: 'underline' }}>Esqueci senha</Text>
            </TouchableOpacity>
            {senhaError ? <Text style={{ color: 'red' }}>{senhaError}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={{ fontWeight: 'bold', margin: 10, color: 'white' }}>Acessar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Components.CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={resu}
          confirmText="Entendi"
          onConfirm={() => setModalVisible(false)} />
      </ScrollView >
    </>
  );
}