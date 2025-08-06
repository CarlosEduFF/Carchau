import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


type AvaliacaoLocacaoProps = {
    nome: string | null;
    perfilImage?: string | null;
    onSubmit: (rating: number, text: string) => void;
    loading: boolean | null;
    setLoading: (value: boolean) => void;
};

const AvaliacaoLocacao: React.FC<AvaliacaoLocacaoProps> = ({
    nome,
    perfilImage,
    onSubmit,
    loading,
    setLoading
}) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');

    const handlePress = () => {
        setLoading(true);
        onSubmit(rating, text);
    };

    return (
        <View>
            <Text style={styles.header}>Locação concluída com sucesso !!!</Text>
            <Text style={styles.text}>
                Parabéns, sua locação foi concluída com sucesso. Não deixe de avaliar como foi o seu período de aluguel.
            </Text>

            <View style={{ alignItems: 'center' }}>
                <Image
                    style={styles.avatar}
                    source={perfilImage ? { uri: perfilImage } : images.defaultProfileImage}
                />
            </View>

            <Text style={styles.nomelocador}>{nome}</Text>

            {/* Avaliação por estrelas */}
            <View style={styles.starContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                        <FontAwesome
                            name={index < rating ? 'star' : 'star-o'}
                            size={30}
                            color="#FFD700"
                            style={styles.star}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Significado da avaliação */}
            <View style={styles.starContainer}>
                {rating > 0 && <Text style={styles.meaning}>{starMeanings[rating - 1]}</Text>}
            </View>

            <Text style={styles.textocampo}>Deixe sua mensagem aqui:</Text>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <TextInput
                    style={styles.textArea}
                    placeholder="Escreva aqui..."
                    placeholderTextColor="gray"
                    multiline
                    numberOfLines={4}
                    value={text}
                    onChangeText={setText}
                />
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity style={styles.button} onPress={handlePress} disabled={!!loading}>
                    <Text style={styles.textStyle}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

import { StyleSheet } from "react-native";
import images from '~/constants/images';
import { starMeanings } from '~/types/StarMean';

const styles = StyleSheet.create({
    
    
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    header: {
        color: '#fff',
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },

    starContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center'
    },
    star: {
        marginHorizontal: 5,
    },
    meaning: {
        marginTop: 10,
        fontSize: 16,
        color: '#f2a51a',
        fontWeight: 'bold',
    },
    text: {
        color: '#f2a51a',
        fontSize: 15,
        textAlign: 'justify',
        marginBottom: 40,
        paddingLeft: 20,
        paddingRight: 20,

    },
    textArea: {
        height: 150,
        width: '90%',
        borderColor: '#f2a51a',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        color: '#fff',
        alignContent: 'center',
        textAlignVertical: 'top', // Alinha o texto no topo da área de texto
    },
    avatar: {
        width: 180,
        height: 180,
        borderRadius: 200,

    },
    nomelocador: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    textocampo: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        top: 20,
        textAlign: 'left',
        marginBottom: 20,
        marginLeft: 20,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 40,
        backgroundColor: '#F2A51A',
        width: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AvaliacaoLocacao;
