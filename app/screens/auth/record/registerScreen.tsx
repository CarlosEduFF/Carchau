import { View, Image, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { CheckBox } from '@rneui/themed';
import React from 'react';
import { MaskedTextInput } from 'react-native-mask-text';
import styles from './StylesRegister';
import images from '~/constants/images';
import { routes } from '~/constants/routes';
import { Services } from '~/services';
import Validators from '~/utils/Validators/index';
import { Components } from '~/components';
import colors from '~/constants/colors';

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [errocpf, setErroCPF] = useState("");
  const [erroemail, setErroEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [situ, setSitu] = useState("");
  const [termoAceito, setTermoAceito] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);


  const handleOpenModal = () => {
    if (!email || !senha || !nome) {
      alert("Por favor, preencha todos os campos para realizar o cadastro."); return;
    } setModalVisible(true);
  };

  const [modalMessage, setModalMessage] = useState(""); // Novo estado para mensagem do modal de erro

  const handleCadastro = async () => {
    try {
      if (!Validators.isValidTerms(termoAceito)) return;

      // Validação da senha
      if (!Validators.isValidPassword(senha)) {
        setModalMessage("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, números e símbolos.");
        setModalVisible2(true);
        return;
      }

      // Validação do CPF e Email
      let mensagemErro = "";
      if (!Validators.isValidCPF(cpf)) {
        mensagemErro += "CPF inválido! ";
        setErroCPF("CPF inválido!");
      } else {
        setErroCPF("");
      }

      if (!Validators.isValidEmail(email)) {
        mensagemErro += "Email inválido!";
        setErroEmail("Email inválido!");
      } else {
        setErroEmail("");
      }

      if (mensagemErro) {
        setModalMessage(mensagemErro);
        setModalVisible2(true);
        return;
      }

      // Verifica duplicidade
      const isUnique = await Services.Duplicity(email, cpf);
      if (!isUnique) {
        setModalMessage("Email ou CPF já cadastrado!");
        setModalVisible2(true);
        return;
      }

      // Cadastro
      const userId = await Services.RegisterUserAuth(email, senha);
      await Services.TermsAcepted(userId, { nome, email, cpf });
      await Services.StorageService.setUserId(userId);


      setNome("");
      setEmail("");
      setSenha("");
      setModalVisible(false);
      router.replace(routes.home);

    } catch (error) {
      console.error("Erro ao criar usuário: ", error);
      setModalMessage("Erro ao cadastrar o usuário: " + error);
      setModalVisible2(true);
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
            <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Cadastrar</Text>
            </TouchableOpacity>
          </View>




          <Components.CustomModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            hideDefaultButton

          >
            <ScrollView>
              <Components.Terms />
              <View style={styles.termoRow}>
                <CheckBox
                  checked={termoAceito}
                  checkedColor="#F2A51A"
                  onPress={() => setTermoAceito(!termoAceito)}
                  containerStyle={styles.checkBoxContainer}
                />
                <Text style={styles.termoText}>
                  Li e concordo com os termos de Privacidade, Uso e Coleta de informações.
                </Text>
              </View>

              <View style={styles.termoButtonWrapper}>
                <TouchableOpacity
                  style={[
                    styles.buttonPriva, termoAceito ? styles.buttonPrivaEnabled : styles.buttonPrivaDisabled,
                  ]}
                  disabled={!termoAceito}
                  onPress={handleCadastro}
                >
                  <Text
                    style={[
                      styles.buttonPrivaText, termoAceito ? styles.buttonPrivaTextEnabled : styles.buttonPrivaTextDisabled,
                    ]}
                  >
                    Concordo e Cadastrar
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Components.CustomModal>


          <Components.CustomModal
            visible={modalVisible2}
            onClose={() => setModalVisible2(false)}
            message={modalMessage} // <-- agora vai mostrar corretamente
            confirmText="Entendi"
            onConfirm={() => setModalVisible2(false)}
          />


        </View>
      </ScrollView>
    </>
  );
}

