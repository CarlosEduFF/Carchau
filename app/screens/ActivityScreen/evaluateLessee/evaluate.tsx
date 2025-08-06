import React, { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import styles from './StylesEvaluateLessee';
import CustomModal from '~/components/CustomModal';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { saveAvaliacaoLocatario } from '~/services/evalueServices';
import AvaliacaoLocacao from '~/components/Evalue';
import { fetchUserData } from '~/services/userService';

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

  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading2, setLoading2] = useState<boolean | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [perfilImage, setPerfilImage] = useState<string | null>(null);
  const [estadoavaliLT, setestadoavaliLT] = useState("Avaliado");

  const loadUser = async () => {
      const userData = await fetchUserData(locadorId);
      if (userData) {
        setNome(userData.nome);
        setPerfilImage(userData.fotoPerfil);
      }
      setLoading(false);
    };

  useFocusEffect(
    React.useCallback(() => {
      loadUser();
    }, [])
  );




  return (
    <ScrollView style={styles.container}>
      {(loading || loading2) && <LoadingCarAnimation loading={loading} />}
      <View style={styles.Topo}></View>

      <AvaliacaoLocacao
        nome={nome}
        perfilImage={perfilImage} // Usando a primeira imagem do array
        loading={loading2}
        setLoading={setLoading2}
        onSubmit={(rating, text) => {
          saveAvaliacaoLocatario({
            locadorId,
            locatarioId,
            soliciId,
            carroId,
            nome,
            text,
            rating,
            estadoavaliLT,
            perfilImage,
            setLoading: setLoading2,
            setModalSucesso: setModalVisible,
            setModalErro: setModalVisible2,
          });
        }}
      />


      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message="Avaliação realizada com Sucesso!"
        confirmText="Entendi"
        onConfirm={() => { setModalVisible(false), router.push('/(tabs)/activity'); }}
      />

      <CustomModal
        visible={modalVisible2}
        onClose={() => setModalVisible2(false)}
        message="Ocorreu algum erro, por favor, tente novamente!"
        confirmText="Entendi"
        onConfirm={() => { setModalVisible2(false), router.push('/(tabs)/activity'); }}
      />

    </ScrollView >
  );
}

