import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from './StylesDeleteCard';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { deleteCard } from '~/services/cardDeleteService';
import CustomModal from '~/components/CustomModal';
import { routes } from '~/constants/routes';
import { fetchCards } from '~/services/cardService';
import { formatCardNumber } from '~/utils/validators';

export default function VisualCards() {
    const [cards, setCards] = useState<{ id: string; cartaoNumero: string; cartaoData: string; cardNome: string, cvv: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const cardIdParam = useLocalSearchParams()?.cardId;
    const cardId = (Array.isArray(cardIdParam) ? cardIdParam[0] : cardIdParam) as string;
    const router = useRouter();
    const [loading2, setLoading2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState("");

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        setLoading2(true);
        const result = await fetchCards();
        if (result) {
            setCards(result);
            console.log(cards);
        }
        setLoading2(false);
    };


    const handleDelete = async (cardId: string) => {
        setLoading2(true);
        const success = await deleteCard(cardId);
        if (success) {
            setModalVisible(true); // sucesso
        } else {
            setSitu('Erro ao deletar o cartão.');
            setModalVisible2(true);
        }
        setLoading2(false);
    };

    return (
        <View style={styles.container}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Cartão */}
                <View style={styles.cartaocontainer}>
                    <Svg height="200" width="100%" style={styles.card}>
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#1a1a1a" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#111111" stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width="100%" height="100%" rx="20" fill="url(#grad)" />
                    </Svg>

                    {/* Exibindo os detalhes do cartão */}
                    <View style={styles.cardDetails}>
                        <View>
                            <Text style={styles.cardNumber}>{cards[0]?.cartaoNumero ? formatCardNumber(cards[0]?.cartaoNumero) : 'XXXX XXXX XXXX XXXX'}</Text>
                        </View>
                        <Text style={styles.name}>{cards[0]?.cardNome || 'XXXXXXXXXXXX'}</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Validade</Text>
                            <Text style={styles.expiry}>{cards[0]?.cartaoData || 'XX/XX'}</Text>
                            <View style={styles.separacao}></View>

                            <Text style={styles.label}>CVV</Text>
                            <Text style={styles.cvv}>{cards[0]?.cvv || 'XXX'}</Text>
                        </View>
                    </View>

                    <View style={styles.logo}>
                        <ImageBackground
                            // source={require('./path_to_your_mastercard_logo.png')}
                            style={{ width: 50, height: 30 }}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <View style={{ width: '100%', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => handleDelete(cardId)}>
                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>Excluir</Text>
                    </TouchableOpacity>
                </View>

                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    message="Cartão deletado com Sucesso!"
                    onConfirm={() => {
                        setModalVisible(!modalVisible);
                        router.replace(routes.viewCard);

                    }}
                />
                <CustomModal
                    visible={modalVisible2}
                    onClose={() => setModalVisible2(false)}
                    message={situ}
                    onConfirm={() => {
                        setModalVisible2(!modalVisible2)
                    }}
                />
            </ScrollView>
        </View>
    );
}


