import { useEffect, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, Text, Image } from "react-native";
import images from "~/constants/images";

import { Evalue } from "~/types";
import { Services } from "~/services";
import styles from "./styles";
import LoadingCarAnimation from "../LoadingCarAnimation/LoadingCarAnimation";

interface AdsEvalueProps {
    carroId: string;
    LocadorId: string;
}

const AdsEvalue: React.FC<AdsEvalueProps> = ({ carroId, LocadorId }) => {
    const [avaliacoes, setAvaliacoes] = useState<Evalue[]>([]); // Estado para armazenar as avaliações

    //Loading
    const [loading, setLoading] = useState(false);

    const loadAvaliacoes = async () => {
        if (!LocadorId || !carroId) return;
        setLoading(true);
        try {
          const resultado = await Services.fetchEvalueByCar(LocadorId, carroId);
          setAvaliacoes(resultado);
        } catch (error) {
          alert(error);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        setLoading(true);
        loadAvaliacoes();
    }, [carroId, LocadorId]);

    return (
        <View style={{ flex: 1 }}>
            {(loading) && <LoadingCarAnimation loading={loading} />}
            {avaliacoes.map((item) => (
                <View key={item.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                        <Image
                            source={
                                item.fotoPerfil && item.fotoPerfil.startsWith('http')
                                    ? { uri: item.fotoPerfil }
                                    : images.defaultProfileImage
                            }
                            style={styles.avatar}
                        />
                        <View style={styles.reviewInfo}>
                            <Text style={styles.name}>{item.nome}</Text>
                            <View style={styles.ratingRow}>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <FontAwesome
                                        key={index}
                                        name={index < Math.floor(item.estrelas) ? 'star' : 'star-o'}
                                        size={16}
                                        color="#FFCD1B"
                                    />
                                ))}
                                <Text style={styles.rating}>{item.estrelas}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.reviewDetails}>
                        <Text style={styles.detailsText}>{item.avaliacao}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

export default AdsEvalue;