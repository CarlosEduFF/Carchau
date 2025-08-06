import { View, Image, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import firebase from "../../../../config/firebase"; // Certifique-se de que firebase está corretamente configurado
import { router } from 'expo-router';
import { CheckBox } from '@rneui/themed';
import React from 'react';
import { MaskedTextInput } from 'react-native-mask-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './StylesRegister';
import { Terms } from '~/components/Terms';
import images from '~/constants/images';
import CustomModal from '~/components/CustomModal';
import { routes } from '~/constants/routes';

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(""); // Mudou de CPF para email
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [errocpf, setErroCPF] = useState("");
  const [erroemail, setErroEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [situ, setSitu] = useState("");
  const [termoAceito, setTermoAceito] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha



  const handleOpenModal = () => {
    if (!email || !senha || !nome) { // Verifica se todos os campos estão preenchidos
      alert("Por favor, preencha todos os campos para realizar o cadastro.");
      return;
    }
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const isValidPassword = (senha: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(senha);
  };




  const verificarTermosAceitos = () => {
    if (!termoAceito) {
      alert("Você deve aceitar os termos de privacidade e a coleta de dados.");
      return false;
    }
    return true;
  };

  const verificarSenha = () => {
    if (!isValidPassword(senha)) {
      setModalVisible2(true);
      setSitu("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, números e símbolos.");
      return false;
    }
    return true;
  };
  const verificarCPF = (cpf: string | string[]) => {
    // Certifique-se de que o CPF seja tratado como string
    if (Array.isArray(cpf)) {
      cpf = cpf[0]; // Use o primeiro elemento caso seja um array
    }

    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, "");

    // Verifica se o CPF tem 11 dígitos ou se todos os números são iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      setErroCPF("O CPF digitado é inválido");
      return false;
    }

    // Função auxiliar para calcular os dígitos verificadores
    const calcularDigito = (cpf: string, fatorInicial: number) => {
      let soma = 0;
      for (let i = 0; i < fatorInicial - 1; i++) {
        soma += parseInt(cpf[i]) * (fatorInicial - i);
      }
      let resto = (soma * 10) % 11;
      return resto === 10 || resto === 11 ? 0 : resto;
    };

    // Calcula os dois dígitos verificadores
    const primeiroDigito = calcularDigito(cpf, 10);
    const segundoDigito = calcularDigito(cpf, 11);

    // Verifica se os dígitos calculados são iguais aos dígitos fornecidos
    if (primeiroDigito !== parseInt(cpf[9]) || segundoDigito !== parseInt(cpf[10])) {
      setErroCPF("O CPF digitado é inválido");
      return false;
    }

    return true; // CPF é válido
  };




  const verificarDuplicidade = async () => {
    try {
      const emailExists = await firebase.firestore()
        .collection("Locatarios")
        .where("email", "==", email)
        .get();

      const cpfExists = await firebase.firestore()
        .collection("Locatarios")
        .where("cpf", "==", cpf)
        .get();

      if (!emailExists.empty) {
        setErroEmail("Este e-mail já está cadastrado.");
        return false;
      }

      if (!cpfExists.empty) {
        setErroCPF("Este CPF já está cadastrado.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao verificar duplicidade: ", error);
      throw new Error("Erro ao verificar duplicidade.");
    }
  };

  const cadastrarUsuarioNoAuth = async () => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);

      if (!userCredential.user) {
        throw new Error("Erro ao criar usuário. Tente novamente.");
      }

      return userCredential.user.uid;
    } catch (error) {
      console.error("Erro ao criar usuário no Auth: ", error);
      throw new Error("Erro ao criar usuário no Auth.");
    }
  };

  const salvarDadosNoFirestore = async (userId: string | undefined) => {
    try {
      await firebase.firestore().collection("Locatarios").doc(userId).set({
        nome,
        email,
        cpf,
      });

      const termosRef = firebase.firestore()
        .collection('Locatarios')
        .doc(userId)
        .collection('termos');

      await termosRef.add({
        termoAceito: true,
        dataAceitacao: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao salvar dados no Firestore: ", error);
      throw new Error("Erro ao salvar dados no Firestore.");
    }
  };

  const salvarUserIdNoAsyncStorage = async (userId: string) => {
    try {
      await AsyncStorage.setItem('userId', userId);
    } catch (error) {
      console.error("Erro ao salvar userId no AsyncStorage: ", error);
      throw new Error("Erro ao salvar userId no AsyncStorage.");
    }
  };

  const handleCadastro = async () => {
    try {
      if (!verificarTermosAceitos()) return;
      if (!verificarSenha()) return;
      if (verificarCPF(cpf)) {
        setErroCPF("CPF válido!");
      } else {
        setErroCPF("CPF inválido!");
        setModalVisible2(true);
      }

      const isUnique = await verificarDuplicidade();
      if (!isUnique) return;

      const userId = await cadastrarUsuarioNoAuth();

      await salvarDadosNoFirestore(userId);
      await salvarUserIdNoAsyncStorage(userId);

      alert("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setModalVisible(false);

      // Redireciona para a página Home
      router.replace(routes.home);
    } catch (error) {
      console.error("Erro ao criar usuário: ", error);
      alert("Erro ao cadastrar o usuário: " + error);
    }
  };



  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Image style={styles.circuloam} source={images.circuloAmarelo} />
          <Image style={styles.segundocirculo} source={images.circuloAmarelo} />
        </View>
        <View style={styles.caixalogin}>
          <Text style={styles.title}>Criar perfil</Text>
          <View style={styles.form}>
            <Text style={styles.textocampo}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={text => setNome(text)}
              value={nome}
              numberOfLines={1} // Adiciona esta linha
              multiline={false} // Adiciona esta linha
            />
            <Text style={styles.textocampo}>CPF</Text>
            <MaskedTextInput
              style={styles.input}
              mask="999.999.999-99"
              placeholderTextColor="gray"
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text: React.SetStateAction<string>) => setCpf(text)}
              placeholder='XXX.XXX.XXX-XX'
              value={cpf}
            />
            <Text style={styles.textocampo}>Email</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address" // Define o tipo do teclado como email
              onChangeText={text => setEmail(text)}
              value={email}
              numberOfLines={1} // Adiciona esta linha
              multiline={false} // Adiciona esta linha
            />

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
                {/* Alterado para usar o componente Image */}
                <Image
                  source={showPassword ? images.hideImage : images.showImage}
                  style={{ width: 24, height: 24 }} // Ajuste o tamanho conforme necessário
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', margin: 10 }}>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Image
                    source={images.BackImage}
                    style={{ width: 24, height: 24 }} // Ajuste o tamanho conforme necessário
                  />
                </TouchableOpacity>
              </View><ScrollView>

                <Terms></Terms>

                {/* CheckBox para aceitação do termo */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    checked={termoAceito}
                    checkedColor='#F2A51A'
                    onPress={() => setTermoAceito(!termoAceito)}  // Alterado para alternar o estado
                    containerStyle={{ backgroundColor: 'transparent', width: 0, paddingRight: 0, left: -20 }}
                  />
                  <Text style={{ color: '#fff', fontSize: 13 }}>Li e concordo com os termos de Privacidade, Uso e Coleta de informações.</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.buttonPriva, { backgroundColor: termoAceito ? '#F2A51A' : '#022036', borderColor: termoAceito ? '#F2A51A' : '#888888' }]}
                    disabled={!termoAceito}
                    onPress={handleCadastro}
                  >
                    <Text style={{ fontWeight: 'bold', color: termoAceito ? '#fff' : '#888888' }}>Concordo e Cadastrar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View >

      <CustomModal
        visible={modalVisible}
        onClose={handleCloseModal}
        showHeaderBack={true} // Suporte para botão de "voltar", se seu CustomModal permitir
        message={''}      >
        <ScrollView>
          <Terms />

          {/* CheckBox para aceitação do termo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <CheckBox
              checked={termoAceito}
              checkedColor="#F2A51A"
              onPress={() => setTermoAceito(!termoAceito)}
              containerStyle={{
                backgroundColor: 'transparent',
                width: 0,
                paddingRight: 0,
                left: -20,
              }}
            />
            <Text style={{ color: '#fff', fontSize: 13 }}>
              Li e concordo com os termos de Privacidade, Uso e Coleta de informações.
            </Text>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity
              style={[
                styles.buttonPriva,
                {
                  backgroundColor: termoAceito ? '#F2A51A' : '#022036',
                  borderColor: termoAceito ? '#F2A51A' : '#888888',
                },
              ]}
              disabled={!termoAceito}
              onPress={handleCadastro}
            >
              <Text style={{ fontWeight: 'bold', color: termoAceito ? '#fff' : '#888888' }}>
                Concordo e Cadastrar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </CustomModal>

      <CustomModal
        visible={modalVisible2}
        onClose={() => setModalVisible2(false)}
        message={errocpf && erroemail}
        confirmText="Entendi"
        onConfirm={() => setModalVisible2(false)}
      />

    </ScrollView>

  );
}

