import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from './StylesMessage';
import images from '~/constants/images';
import { Message } from '~/types/';
import { Components } from '~/components';
import { Services } from '~/services';
import { changeValue } from '~/utils/navigations';

export default function Chat() {
    const [perfilImage, setPerfilImage] = useState<string | null>(null);
    const [nome, setNome] = useState<string | null>(null);
    const [UserImage, setUserImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const ContatoIdParam = useLocalSearchParams()?.id;
    const ContatoId = Array.isArray(ContatoIdParam) ? ContatoIdParam[0] : ContatoIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [recipientId, setRecipientId] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<Message[]>([]);
    const flatListRef = useRef<FlatList>(null);
    const [messageText, setMessageText] = useState('');
    const previousContactId = useRef<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let isUnmount = false;
            Services.loadChatUserData({
                locadorId,
                locatarioId,
                ContatoId,
                recipientId,
                userId,
                setUserId,
                setRecipientId,
                setNome,
                setPerfilImage,
                setUserImage,
                setLoading,
                previousContactId,
            });


            return () => {
                isUnmount = true;
            };
        }, [locadorId, locatarioId, ContatoId, recipientId])
    );

    useEffect(() => {
        const unsubscribe = Services.GetMessage({
            userId,
            recipientId,
            onMessagesUpdate: setMessages,
            flatListRef,
        });
        return () => unsubscribe && unsubscribe();
    }, [userId, recipientId]);


    return (
        <View style={styles.container}>
            {(loading || loading2) && <Components.LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View style={styles.Topo}></View>
            <View style={styles.header}>
                <Text style={styles.headerText}>{nome ? nome : 'Carregando...'}</Text>
                <Image
                    style={styles.userIcon}
                    source={typeof perfilImage === 'string' ? { uri: perfilImage } : images.defaultProfileImage}
                />
            </View>
            <View style={styles.Solicita}>
                <TouchableOpacity style={styles.SolButton} onPress={() => changeValue(locadorId, locatarioId)}>
                    <Text style={{ color: 'white' }}>Alterar solicitações</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Components.MessageItem
                        item={item}
                        userId={userId}
                        UserImage={UserImage}
                        perfilImage={perfilImage}
                    />
                )}
                inverted={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Digite sua mensagem..."
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholderTextColor={'white'}
                />
                <TouchableOpacity onPress={() => {
                    Services.sendMessageToChat({
                        userId,
                        recipientId,
                        text: messageText,
                        nome, // opcional
                    });
                    setMessageText('');
                }}>
                    <Ionicons name="send" size={34} color="#F2A51A" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

