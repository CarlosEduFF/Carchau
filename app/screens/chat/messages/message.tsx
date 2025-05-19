import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, FlatList, TextInput } from 'react-native';
import firebase from '../../../../utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from './StylesMessage';

interface Message {
    _id: string;
    text: string;
    createdAt: Date;
    user: {
        _id: string;
        name: string;
    };
}



export default function Chat() {
    const [perfilImage, setPerfilImage] = useState<string | null>(null);
    const [nome, setNome] = useState<string | null>(null);
    const [UserImage, setUserImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState<boolean | null>(null);
    const defaultProfileImage = require('../../../../assets/icons/Profile-Icon.png');

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



    const Troca = async () => {
        console.log(locadorId);
        router.push({
            pathname: '/screens/chat/changeValue/change',
            params: {
                locadorId: locadorId,
                locatarioId: locatarioId,
            }
        });


    };



    const previousContactId = useRef<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            const fetchUserData = async () => {
                try {
                    const uid = await AsyncStorage.getItem('userId');
                    if (!uid) return;

                    setUserId((prev) => (prev !== uid ? uid : prev));

                    // Determinar o ID do destinatário corretamente
                    let newRecipientId = recipientId;
                    if (!recipientId) {
                        newRecipientId = uid === locadorId ? locatarioId : locadorId;
                        setRecipientId(newRecipientId);
                    }

                    let recipientProfileImage = null;
                    let userProfileImage = null;
                    let recipientName = "Usuário";

                    // Buscar informações do destinatário (quem está recebendo a mensagem)
                    if (newRecipientId) {
                        
                        const recipientDoc = await firebase.firestore().collection('Locatarios').doc(newRecipientId).get();

                        if (recipientDoc.exists) {
                            const recipientData = recipientDoc.data();
                            recipientName = recipientData?.nome || "Usuário";
                            recipientProfileImage = recipientData?.fotoPerfil || null;
                        }

                        if (isMounted) {
                            setNome(recipientName);
                            setPerfilImage(recipientProfileImage);
                        }
                    }

                    // Buscar informações do usuário logado (quem está enviando a mensagem)
                    if (uid) {
                        
                        const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();

                        if (userDoc.exists) {
                            const userData = userDoc.data();
                            userProfileImage = userData?.fotoPerfil || null;
                        }

                        if (isMounted) {
                            setUserImage(userProfileImage);
                        }
                    }

                    // Atualizar Firestore apenas se ContatoId mudou e as imagens forem diferentes
                    if (ContatoId && previousContactId.current !== ContatoId) {
                        const contatoRef = firebase.firestore().collection('Contatos').doc(ContatoId);
                        const contatoDoc = await contatoRef.get();

                        if (contatoDoc.exists) {
                            const contatoData = contatoDoc.data();
                            const locadorPerfilAtual = contatoData?.locadorperfilImage || null;
                            const locatarioPerfilAtual = contatoData?.locatarioperfilImage || null;

                            if (locadorPerfilAtual !== userProfileImage || locatarioPerfilAtual !== recipientProfileImage) {
                                console.log("Atualizando Firestore para ContatoId:", ContatoId);
                                await contatoRef.update({
                                    locadorperfilImage: uid === locadorId ? userProfileImage : recipientProfileImage,
                                    locatarioperfilImage: uid === locatarioId ? userProfileImage : recipientProfileImage,
                                });
                            } else {
                                console.log("As imagens são as mesmas, não será feita atualização.");
                            }
                        } else {
                            console.log("Contato não encontrado no Firestore.");
                        }

                        previousContactId.current = ContatoId;
                    }

                    if (isMounted) setLoading(false);
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error);
                    if (isMounted) setLoading(false);
                }
            };

            fetchUserData();
            return () => { isMounted = false; };

        }, [locadorId, locatarioId, ContatoId, recipientId])
    );





    const onSend = (newMessageText: string) => {
        if (!userId || !recipientId) return;

        const chatRoomId = userId < recipientId ? `${userId}_${recipientId}` : `${recipientId}_${userId}`;
        const newMessage = {
            _id: `${userId}_${Date.now()}`,  // Garante um ID único combinando userId com a hora atual
            text: newMessageText,
            createdAt: new Date(),
            user: {
                _id: userId,
                name: nome || 'Usuário',
            },
        };


        setMessages(prevMessages => [newMessage, ...prevMessages]);

        firebase.firestore()
            .collection('ChatRooms')
            .doc(chatRoomId)
            .collection('messages')
            .add({
                ...newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Firestore precisa do timestamp próprio
            });
    };


    useEffect(() => {
        if (!userId || !recipientId) return;

        const chatRoomId = userId < recipientId ? `${userId}_${recipientId}` : `${recipientId}_${userId}`;

        const unsubscribe = firebase.firestore()
            .collection('ChatRooms')
            .doc(chatRoomId)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                const fetchedMessages: Message[] = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        _id: doc.id,
                        text: data.text,
                        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
                        user: {
                            _id: data.user._id,
                            name: data.user.name || 'Usuário',
                        },
                    };
                });

                setMessages(fetchedMessages.reverse()); // ✅ Inverte a ordem antes de atualizar o estado

                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 300);
            });

        return () => unsubscribe();
    }, [userId, recipientId]);


    const renderMessageItem = ({ item }: { item: Message }) => {
        const isMyMessage = item.user._id === userId;

        return (
            <View style={isMyMessage ? styles.myMessageContainer : styles.messageContainer}>
                {isMyMessage ? (
                    <View style={styles.myMessageContent}>
                        <View style={styles.messageTextContainer}>
                            <Text style={styles.messageText}>{item.text}</Text>
                        </View>
                        <Image
                            style={styles.userIcon}
                            source={UserImage ? { uri: UserImage } : defaultProfileImage}
                        />
                    </View>
                ) : (
                    <View style={styles.messageContent}>
                        <Image
                            style={styles.userIcon}
                            source={perfilImage ? { uri: perfilImage } : defaultProfileImage}
                        />
                        <View style={styles.messageTextContainer}>
                            <Text style={styles.messageText}>{item.text}</Text>
                        </View>
                    </View>
                )}
            </View>
        );
    };




    const translateX = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 100,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: -100,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );

        if (loading || loading2) {
            animation.start();
        }

        return () => animation.stop();
    }, [loading, loading2, translateX]);

    if (loading || loading2) {
        return (
            <View style={styles.loadingContainer}>
                <Animated.View style={{ transform: [{ translateX }] }}>
                    <Image style={styles.carlogo} source={require('../../../../assets/icons/Car-Logo.png')} />
                </Animated.View>
                <Text style={{ color: 'white' }}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.Topo}></View>
            <View style={styles.header}>
                <Text style={styles.headerText}>{nome ? nome : 'Carregando...'}</Text>
                <Image
                    style={styles.userIcon}
                    source={typeof perfilImage === 'string' ? { uri: perfilImage } : defaultProfileImage}
                />
            </View>
            <View style={styles.Solicita}>
                <TouchableOpacity style={styles.SolButton} onPress={() => Troca()}>
                    <Text style={{ color: 'white' }}>Alterar solicitações</Text>
                </TouchableOpacity>
            </View>


            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id} // Certifique-se de que _id é único
                renderItem={renderMessageItem}
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
                    onSend(messageText);
                    setMessageText('');
                }}>
                    <Ionicons name="send" size={34} color="#F2A51A" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

