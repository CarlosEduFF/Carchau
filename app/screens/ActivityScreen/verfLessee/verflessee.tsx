import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView, Animated, Image } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesVerfLessee';

export default function VerificacaoLocatario() {
    const [verificationCode, setVerificationCode] = useState(''); // Para armazenar o código que o usuário insere
    const [generatedCode, setGeneratedCode] = useState(''); // Código gerado automaticamente
    const [timer, setTimer] = useState(120); // Timer de 2 minutos
    const [situ, setSitu] = useState('');
    const [loading, setLoading] = useState(false); // Inicializando como true para mostrar carregamento
    const [loading2, setLoading2] = useState(false);
    const [RepLoca, setRepLoca] = useState('');
    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [confiPosse, setConfiPosse] = useState('Veículo recebido');
    const [codVerf, setCodVerf] = useState(0);
    // Gera um código ao carregar a tela
    useEffect(() => {
        generateCode();
    }, []);

    // Função para gerar um código aleatório de 4 dígitos
    const generateCode = () => {
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(newCode);

    };

    // Salva o código gerado no Firestore
    const saveCodeToFirestore = async () => {
        try {
            const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);
            await docRef.set({
                locatarioId: locatarioId,
                locadorId: locadorId,
                locatarioCode: generatedCode, // Código gerado

            }, { merge: true });
        } catch (error) {
            console.error("Erro ao salvar o código no Firestore: ", error);
        }
    };

    // Salva o código sempre que ele for gerado
    useEffect(() => {
        if (generatedCode) {
            saveCodeToFirestore();
        }
    }, [generatedCode]);

    // Atualiza o timer a cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer > 0) {
                    return prevTimer - 1;
                } else {
                    generateCode();
                    return 120; // Reseta o timer para 120 segundos
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Verifica se o código inserido pelo usuário é o corret


    const findCodVerf = async () => {
            try {
                const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);
                // Obtém os dados do documento
                const docSnapshot = await docRef.get();
                const data = docSnapshot.data();
                
                // Se o documento existe e `codVerf` não está definido, define para 0
                if (data && data.codVerf === undefined) {
                    await docRef.set({ codVerf: 0 }, { merge: true });
                } 
            } catch (error) {
                console.error("Erro ao atualizar codVerf:", error);
            }
        };
        
        const catchCodVerf = async () => {
            try {
                const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);
                // Obtém os dados do documento
                const docSnapshot = await docRef.get();
                const data = docSnapshot.data();
    
                // Se o documento existe e `codVerf` não está definido, define para 0
                if (data) {
                    setCodVerf(data?.codVerf || 0);
                }
            } catch (error) {
                console.error("Erro ao atualizar codVerf:", error);
            }
        }
        
        const exeCodVerf = async () => {
            try {
                await saveCodeToFirestore(); // Aguarda salvar o código antes de continuar
                await findCodVerf();
                await catchCodVerf();
            } catch (error) {
                console.error("Erro ao atualizar codVerf:", error);
            }
        };
        
        
        useEffect(() => {
            if (generatedCode) {
                exeCodVerf();
            }
        }, [generatedCode]);


    const verifyCodeEn = async () => {
        setLoading(true); // Ativa o estado de carregamento
        const maxDelay = 10000; // Tempo máximo de espera (10 segundos)
        const intervalCheck = 1000; // Intervalo de verificação (1 segundo)

        let elapsedTime = 0; // Tempo decorrido

        try {
            const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);

            // Função para verificar e atualizar o estado do documento
            const checkAndUpdate = async () => {
                const docSnapshot = await docRef.get();
                const data = docSnapshot.data();

                if (data) {
                    const locadorCode = data.locadorCode;

                    if (verificationCode === locadorCode) {
                        // Atualiza para "Veículo entregue" na subcoleção carrosRef
                        
                        const carrosRef = firebase.firestore()
                            .collection('Locatarios')
                            .doc(locatarioId)
                            .collection('solicitacoes')
                            .doc(soliciId);

                        await carrosRef.update({
                            confirRecepLocata: "Veículo recebido",
                            codVerf: 1
                        });
                        setLoading(false);
                        setLoading2(false);
                        // Obtém o documento atualizado da subcoleção carrosRef
                        const carrosSnapshot = await carrosRef.get();
                        const carrosData = carrosSnapshot.data();

                        // Verifica se o veículo foi recebido pelo locatário
                        if (carrosData?.confirEntregaLocador === "Veículo entregue") {
                            setLoading(false);
                            setLoading2(false);
                            setModalVisible(true); // Mostra modal de sucesso
                            return true; // Finaliza a verificação com sucesso
                        }
                    }
                }

                return false; // Não foi possível verificar ou atualizar ainda
            }
            const verifyWithTimeout = async () => {
                while (elapsedTime < maxDelay) {
                    const isUpdated = await checkAndUpdate();

                    if (isUpdated) return; // Sai do loop se a verificação for concluída com sucesso

                    await new Promise((resolve) => setTimeout(resolve, intervalCheck)); // Aguarda o intervalo
                    elapsedTime += intervalCheck;
                }

                // Se o tempo esgotar, atualiza para "Veículo não entregue" na subcoleção carrosRef
                const carrosRef = firebase.firestore()
                    .collection('Locatarios')
                    .doc(locatarioId)
                    .collection('solicitacoes')
                    .doc(soliciId);

                await carrosRef.update({
                    confirRecepLocata: "Veículo não recebido",
                });

                throw new Error("Tempo esgotado. Campo não foi atualizado para 'Veículo entregue'.");
            };

            await verifyWithTimeout();
        } catch (error) {
            console.error("Erro na verificação:", error);
            setLoading(false);
            setLoading2(false);
            setModalVisible2(true); // Mostra modal de falha
        }
    };

    const verifyCodeDe = async () => {
        setLoading(true); // Ativa o estado de carregamento
        const maxDelay = 10000; // Tempo máximo de espera (10 segundos)
        const intervalCheck = 1000; // Intervalo de verificação (1 segundo)

        let elapsedTime = 0; // Tempo decorrido

        try {
            const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);

            // Função para verificar e atualizar o estado do documento
            const checkAndUpdate = async () => {
                const docSnapshot = await docRef.get();
                const data = docSnapshot.data();

                if (data) {
                    const locadorCode = data.locadorCode;
                    const codVerf = data.codVerf;


                    if (verificationCode === locadorCode) {
                        // Atualiza para "Veículo entregue" na subcoleção carrosRef
             
                        const carrosRef = firebase.firestore()
                            .collection('Locatarios')
                            .doc(locatarioId)
                            .collection('solicitacoes')
                            .doc(soliciId);

                        await carrosRef.update({
                            confirDevoLocata: "Veículo devolvido",
                        });

                        // Obtém o documento atualizado da subcoleção carrosRef
                        const carrosSnapshot = await carrosRef.get();
                        const carrosData = carrosSnapshot.data();

                        // Verifica se o veículo foi recebido pelo locatário
                        if (carrosData?.confirRecepLocador === "Veículo recebido") {
                            setLoading(false);
                            setLoading2(false);
                            setModalVisible(true); // Mostra modal de sucesso
                            return true; // Finaliza a verificação com sucesso
                        }

                    }
                }
                setLoading(false);
                setLoading2(false);
                return false; // Não foi possível verificar ou atualizar ainda
            };

            // Função para verificar continuamente dentro do tempo limite
            const verifyWithTimeout = async () => {
                while (elapsedTime < maxDelay) {
                    const isUpdated = await checkAndUpdate();

                    if (isUpdated) return; // Sai do loop se a verificação for concluída com sucesso

                    await new Promise((resolve) => setTimeout(resolve, intervalCheck)); // Aguarda o intervalo
                    elapsedTime += intervalCheck;
                }

                // Se o tempo esgotar, atualiza para "Veículo não entregue" na subcoleção carrosRef
                const carrosRef = firebase.firestore()
                    .collection('Locatarios')
                    .doc(locatarioId)
                    .collection('solicitacoes')
                    .doc(soliciId);

                await carrosRef.update({
                    confirRecepLocata: "Veículo não recebido",
                });

                throw new Error("Tempo esgotado. Campo não foi atualizado para 'Veículo entregue'.");
            };

            await verifyWithTimeout();
        } catch (error) {
            console.error("Erro na verificação:", error);
            setLoading(false);
            setLoading2(false);
            setModalVisible2(true); // Mostra modal de falha
        }
    };

    const handleNumberPress = (num: string) => {
        if (verificationCode.length < 4) {
            setVerificationCode(verificationCode + num);
        }
    };

    const handleDelete = () => {
        setVerificationCode(verificationCode.slice(0, -1));
    };




    const translateX = useRef(new Animated.Value(-100)).current; // Inicia fora da tela à esquerda

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 100, // Mova 100 pixels para a direita
                    duration: 1000, // Duração da animação
                    useNativeDriver: true, // Usa a API nativa para melhor performance
                }),
                Animated.timing(translateX, {
                    toValue: -100, // Retorna à posição inicial
                    duration: 0, // Sem duração para retornar
                    useNativeDriver: true,
                }),
            ])
        );

        if (loading || loading2) {
            animation.start();
        }

        // Para parar a animação quando os carregamentos não estiverem ativos
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
        <ScrollView style={styles.containerScroll}>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <SimpleLineIcons name="envelope-letter" style={styles.icon} size={50} />
                </View>

                <Text style={styles.instructionText}>
                    Coloque o código de verificação do locador aqui e forneça o seu código para ele:
                    <Text style={styles.codeText}>{generatedCode}</Text>
                </Text>

                <View style={styles.codeDisplayContainer}>
                    {Array(4).fill('').map((_, index) => (
                        <View key={index} style={styles.codeCircle}>
                            <Text style={styles.codeDigit}>{verificationCode[index] || ''}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.timerText}>
                    {Math.floor(timer / 60).toString().padStart(2, '0')}:
                    {(timer % 60).toString().padStart(2, '0')}
                </Text>

                <View style={styles.numberPad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={styles.numberButton}
                            onPress={() => handleNumberPress(num.toString())}
                        >
                            <Text style={styles.numberText}>{num}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.numberButton}>
                        {/* Botão vazio para alinhamento */}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.numberButton} onPress={() => handleNumberPress('0')}>
                        <Text style={styles.numberText}>0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.numberButton} onPress={handleDelete}>
                        <Text style={styles.numberText}>⌫</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => {
                     if (codVerf == 0) {
                        verifyCodeEn();
                        setLoading2(true);
                    } else if (codVerf == 1) {
                        verifyCodeDe();
                        setLoading2(true);
                    }
                    setLoading2(true);
                }}>
                    <Text style={{ color: 'white' }}>Verificar Código</Text>
                </TouchableOpacity>

                <Modal
                    visible={modalVisible2}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible2(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Confirmação de posse não realizada</Text>
                            <Text style={styles.modalText}>
                                A confirmação de posse não foi realizada, tente novamente, após a geração
                                do novo código.
                            </Text>
                            <Pressable
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible2(!modalVisible2);
                                }}>
                                <Text style={styles.textStyle}>Entendi!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={modalVisible3}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible3(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Confirmação de posse realizada com sucesso</Text>
                            <Text style={styles.modalText}>
                                A confirmação de posse foi realizada pelo locador envolvido na locação.
                            </Text>
                            <Pressable
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible3(!modalVisible3), router.replace('/(tabs)/activity')
                                }}>
                                <Text style={styles.textStyle}>Entendi!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Confirmação de posse realizada com sucesso</Text>
                            <Text style={styles.modalText}>
                                A confirmação de posse foi realizada, o veiculo pode ser transferido de posse
                                para o locatário com segurança.
                            </Text>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    router.replace('/(tabs)/activity');
                                }}>
                                <Text style={styles.textStyle}>Entendi!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

            </View>
        </ScrollView>
    );
}


