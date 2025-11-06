import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './StylesCnh';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import { routes } from '~/constants/routes';
import colors from '~/constants/colors';
import { fetchLatestTermo } from '~/services/termsServices';
import { fetchCnhData } from '~/services/CnhService/CnhService';
import firebase from '~/config/firebase'; // usado apenas para fallback storage

type CnhStatus = 'valido' | 'invalido' | 'pendente' | null;

const CnhStatusBadge: React.FC<{ cnhvalida: CnhStatus }> = ({ cnhvalida }) => {
  let text = 'Não enviada';
  let bg = '#9ca3af'; // cinza
  let textColor = '#fff';

  if (cnhvalida === 'valido') {
    text = 'Válido';
    bg = '#16a34a'; // verde
  } else if (cnhvalida === 'invalido') {
    text = 'Inválido';
    bg = '#dc2626'; // vermelho
  } else if (cnhvalida === 'pendente' || cnhvalida === null) {
    text = 'Pendente';
    bg = '#9ca3af';
  }

  return (
    <View style={[styles.containerBadge]}>
      <View style={[styles.dotBadge, { backgroundColor: bg }]} />
      <Text style={[styles.textBadge, { color: textColor }]}>{text}</Text>
    </View>
  );
};

export default function CNH() {
  const [frontCNH, setFrontCNH] = useState<string>('');
  const [backCNH, setBackCNH] = useState<string>('');
  const [existingImages, setExistingImages] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });
  const [cnhvalida, setCNHValida] = useState<CnhStatus>(null);
  const [termoAceito, setTermoAceito] = useState(false);
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);

  // tenta pegar downloadURL do storage caso a URL armazenada seja inválida
  const tryFetchFromStorage = async (uid: string | null, side: 'front' | 'back') => {
    if (!uid) return null;
    try {
      if (firebase && typeof firebase.storage === 'function') {
        const storageRef = firebase.storage().ref();
        // tenta alguns caminhos comuns (ajuste conforme sua organização)
        const candidates = [
          `cnh/${uid}/${side}`,
          `cnh/${uid}/${side}.jpg`,
          `cnh/${uid}/${side}.png`,
          `locatarios/${uid}/cnh/${side}`,
        ];
        for (const path of candidates) {
          try {
            const url = await storageRef.child(path).getDownloadURL();
            if (url) return url;
          } catch (e) {
            // ignora se não existir; tenta próximo
          }
        }
      }
    } catch (err) {
      console.warn('Storage fallback falhou', err);
    }
    return null;
  };

  // resolve URL: se já começa com http -> retorna; se não, tenta fallback storage
  const resolveImageUrl = async (maybeUrl: string | null, side: 'front' | 'back') => {
    if (!maybeUrl) return null;
    if (maybeUrl.startsWith('http://') || maybeUrl.startsWith('https://')) return maybeUrl;
    // se for gs:// ou apenas um path, tenta obter via storage
    const uid = await AsyncStorage.getItem('userId');
    const url = await tryFetchFromStorage(uid, side);
    return url;
  };

  useEffect(() => {
    // transforma em async para aguardar os loads
    const bootstrap = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        await carregarTermo();
        await loadCnhData();
      } finally {
        setLoading2(false);
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const carregarTermo = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (!id) return;
    try {
      const data = await fetchLatestTermo(id);
      if (data) {
        setTermoAceito(data.termoAceito);
        setIsCheckboxDisabled(data.termoAceito);
      }
    } catch (error) {
      console.error('Erro ao carregar termo:', error);
    }
  };

  const loadCnhData = async () => {
    try {
      const data = await fetchCnhData();
      if (data) {
        // resolve URLs com fallback caso necessário
        const resolvedFront = await resolveImageUrl(data.fotoFront, 'front');
        const resolvedBack = await resolveImageUrl(data.fotoBack, 'back');

        setExistingImages({ front: resolvedFront ?? data.fotoFront, back: resolvedBack ?? data.fotoBack });
        // se a API retorna null -> pendente
        setCNHValida(data.cnhvalida ?? 'pendente');
        console.log(data.cnhvalida);
      } else {
        setExistingImages({ front: null, back: null });
        setCNHValida('pendente');
      }
    } catch (err) {
      console.error('Erro ao carregar CNH:', err);
      setExistingImages({ front: null, back: null });
      setCNHValida('pendente');
    }
  };

  // handler de erro das imagens: log claro e tenta fallback de storage (se não tentou ainda)
  const handleImageError = async (which: 'front' | 'back', nativeEvent: any) => {
    console.warn(`Erro ao carregar imagem (${which}):`, nativeEvent?.error || nativeEvent);
    const uid = await AsyncStorage.getItem('userId');
    const fallback = await tryFetchFromStorage(uid, which);
    if (fallback) {
      setExistingImages((p) => ({ ...p, [which]: fallback }));
    } else {
      // evita tentativas infinitas
      setExistingImages((p) => ({ ...p, [which]: null }));
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
        <Text style={styles.text}>Visualize ou Cadastre sua CNH</Text>
        <Text style={styles.textocampo}>
          Para maior segurança, e conforme ordena Art. 141 do CTB, cadastre as imagens da sua CNH.
        </Text>

        <View style={{ marginTop: 8, marginBottom: 16, alignItems: 'center' }}>
          <CnhStatusBadge cnhvalida={cnhvalida} />
        </View>

        {/* Imagem da frente da CNH */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.textocampo}>Frente da CNH:</Text>
          {frontCNH || existingImages?.front ? (
            <Image
              style={styles.image}
              source={{ uri: (frontCNH || existingImages?.front) ?? '' }}
              onError={({ nativeEvent }) => handleImageError('front', nativeEvent)}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome style={styles.icon} name="id-card-o" size={220} color={colors.amareloClaro} />
          )}
        </View>

        {/* Imagem do verso da CNH */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.textocampo}>Verso da CNH:</Text>
          {backCNH || existingImages?.back ? (
            <Image
              style={styles.image}
              source={{ uri: (backCNH || existingImages?.back) ?? '' }}
              onError={({ nativeEvent }) => handleImageError('back', nativeEvent)}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome style={styles.icon} name="id-card-o" size={220} color={colors.amareloClaro} />
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 35, marginBottom: 5 }}>
          <CheckBox
            checked={termoAceito}
            checkedColor="#F2A51A"
            disabled={isCheckboxDisabled}
            containerStyle={{ backgroundColor: 'transparent', width: 0, paddingRight: 0, left: -20 }}
          />
          <Text style={{ color: '#fff', fontSize: 10, textAlign: 'justify' }}>
            Autorizo o uso da minha CNH e assinatura digitalizada no ato do meu cadastro, via site, aplicativo, de
            acordo com os Termos de Uso e da Política de Privacidade, para formalizar a abertura do meu contrato junto
            a carchau e para os demais documentos inerentes ao aluguel.
            {'\n'}
            <TouchableOpacity onPress={() => { router.replace(routes.termos); }}>
              <Text style={{ color: '#F2A51A', fontSize: 10 }}> Acessar termos de uso</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
          <TouchableOpacity style={styles.button} onPress={() => router.replace(routes.editCnh)}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Tirar foto da CNH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
