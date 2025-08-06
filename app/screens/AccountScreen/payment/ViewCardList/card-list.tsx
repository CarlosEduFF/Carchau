import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import styles from './StylesCardList';
import { routes } from '~/constants/routes';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { fetchCards } from '~/services/cardService';
import CustomModal from '~/components/CustomModal';
import { deleteCard } from '~/services/cardDeleteService';
import { CardsVisu } from '~/services/navigationService';

export default function Cards() {
    const [cards, setCards] = useState<{ id: string; cartaoNumero: string; cartaoData: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState("");

    const maskCardNumber = (number: string) => {
        if (number.length > 4) {
            return ` ${number.slice(-4)}`; // Máscara para exibir apenas os últimos 4 dígitos
        }
        return number;
    };


    const handleDelete = async (cardId: string) => {
        setLoading2(true);
        const success = await deleteCard(cardId);
        if (success) {
            setModalVisible(true); // sucesso
            // opcional: atualizar a lista após deletar
            fetchCards();
        } else {
            setSitu('Erro ao deletar o cartão.');
            setModalVisible2(true);
        }
        setLoading2(false);
    };


    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        setLoading(true);
        const result = await fetchCards();
        if (result) {
            setCards(result);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <TouchableOpacity style={styles.Button} onPress={() => router.replace(routes.addCard)}>
                <FontAwesome6 name="square-plus" size={28} color="white" />
                <Text style={styles.text}>Adicionar cartão de crédito</Text>
            </TouchableOpacity>

            <View style={{ width: '100%' }}>
                {cards.map(card => (
                    <View key={card.id} style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TouchableOpacity style={styles.opcao} onPress={() => CardsVisu(card.id)}>
                            <Text style={styles.textocampo}>
                                {maskCardNumber(card.cartaoNumero)} - {card.cartaoData} {/* Exibe a data como está */}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.opcao} onPress={() => handleDelete(card.id)}>
                            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#F2A51A" />
                        </TouchableOpacity>
                    </View>
                ))}
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
        </View>
    );
}
