import React, { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import styles from './StylesEvaluateLessor';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal';
import { fetchUserData } from '~/services/userService';
import { salvarAvaliacaoPLocador } from '~/services/evalueServices';
import AvaliacaoLocacao from '~/components/Evalue';

export default function AvaliacaoLocador() {
  const soliciIdParam = useLocalSearchParams()?.soliciId;
  const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
  const locadorIdParam = useLocalSearchParams()?.locadorId;
  const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
  const locatarioIdParam = useLocalSearchParams()?.locatarioId;
  const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState<boolean | null>(null);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [situ, setSitu] = useState('');
  const [nome, setNome] = useState<string | null>(null);
  const [perfilImage, setPerfilImage] = useState<string | null>(null);
  const [estadoavaliLD, setestadoavaliLD] = useState("Avaliado");
  const [text, setText] = useState(''); // Mensagem do usuário
  const [rating, setRating] = useState(0);


  const loadUserLocatario = async () => {
    const userData = await fetchUserData(locatarioId);
    if (userData) {
      setNome(userData.nome);
      setPerfilImage(userData.fotoPerfil);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserLocatario();
    }, [])
  );

  

  return (
    <ScrollView style={styles.container}>
      {(loading || loading2) && <LoadingCarAnimation loading={loading} />}
      <View style={styles.Topo}></View>

      <AvaliacaoLocacao
        nome={nome}
        perfilImage={perfilImage}
        loading={loading2}
        setLoading={setLoading2}
        onSubmit={(rating, text) => {
          salvarAvaliacaoPLocador({
            locatarioId,
            soliciId,
            nome,
            text,
            rating,
            estadoavaliLD,
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


