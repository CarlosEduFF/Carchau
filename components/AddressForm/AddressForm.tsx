import React from "react";
import { View, Text, TextInput, TouchableOpacity, Linking, ScrollView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";
import styles from "./styles";
import CustomModal from "../CustomModal/CustomModal";
import LoadingCarAnimation from "../LoadingCarAnimation/LoadingCarAnimation";

interface AddressFormProps {
  cep: string;
  setCep: (value: string) => void;
  endereco: string;
  setEndereco: (value: string) => void;
  numero: string;
  setNumero: (value: string) => void;
  complemento: string;
  setComplemento: (value: string) => void;
  bairro: string;
  setBairro: (value: string) => void;
  cidade: string;
  setCidade: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  handleBuscarCep: (cep: string) => void;
  handleSave: () => void;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  modalVisible2: boolean;
  setModalVisible2: (value: boolean) => void;
  situ: string;
  loading: boolean;
  loading2: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  cep,
  setCep,
  endereco,
  setEndereco,
  numero,
  setNumero,
  complemento,
  setComplemento,
  bairro,
  setBairro,
  cidade,
  setCidade,
  estado,
  setEstado,
  handleBuscarCep,
  handleSave,
  modalVisible,
  setModalVisible,
  modalVisible2,
  setModalVisible2,
  situ,
  loading,
  loading2,

}) => {
  const pickerStyle = Platform.select({
    android: {
      color: '#fff',
    },
  });
  return (
    <View style={styles.container}>
      {(loading || loading2) && (
        <LoadingCarAnimation loading={loading} loading2={loading2} />
      )}
      <View style={{ width: "100%", marginTop: 25 }}>
        <ScrollView>
          {/* Campo Cep */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textocampo}>Cep:</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://buscacepinter.correios.com.br")
              }
            >
              <Text
                style={{
                  color: "blue",
                  textDecorationLine: "underline",
                  fontSize: 14,
                }}
              >
                Não sabe seu CEP?
              </Text>
            </TouchableOpacity>
          </View>

          <MaskedTextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setCep}
            onBlur={() => handleBuscarCep(cep)}
            value={cep}
            mask="99999-999"
            placeholder="Ex:12345-678"
            placeholderTextColor="gray"
            keyboardType="numeric"
          />

          {/* Demais campos */}
          <Text style={styles.textocampo}>Endereço:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex:Rua Araúcaria"
            placeholderTextColor="#888888"
            value={endereco}
            onChangeText={setEndereco}
          />

          <Text style={styles.textocampo}>Número:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex:837"
            placeholderTextColor="#888888"
            keyboardType="numeric"
            value={numero}
            onChangeText={setNumero}
          />

          <Text style={styles.textocampo}>Complemento:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Próximo ao condomínio flores"
            placeholderTextColor="#888888"
            value={complemento}
            onChangeText={setComplemento}
          />

          <Text style={styles.textocampo}>Bairro:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Morumbi"
            placeholderTextColor="#888888"
            value={bairro}
            onChangeText={setBairro}
          />

          <Text style={styles.textocampo}>Cidade:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: São Paulo"
            placeholderTextColor="#888888"
            value={cidade}
            onChangeText={setCidade}
          />

          <Text style={styles.textocampo}>Estado:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={estado}
              onValueChange={setEstado}
              dropdownIconColor="#fff"
              style={pickerStyle}
            >
              <Picker.Item label="Selecione..." value="Selecione..." />
              {[
                "AC", "AL", "AP", "AM", "BA", "CE", "ES", "GO", "MA", "MT", "MS",
                "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR",
                "SC", "SP", "SE", "TO", "DF"
              ].map((uf) => (
                <Picker.Item key={uf} label={uf} value={uf} />
              ))}
            </Picker>
          </View>

          {/* Modais */}
          <CustomModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            message="Endereço atualizado com Sucesso!"
            confirmText="Entendi"
            onConfirm={() => setModalVisible(false)}
          />

          <CustomModal
            visible={modalVisible2}
            onClose={() => setModalVisible2(false)}
            message={situ}
            confirmText="Entendi"
            onConfirm={() => setModalVisible2(false)}
          />

          {/* Botão */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "white" }}
              >
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddressForm;