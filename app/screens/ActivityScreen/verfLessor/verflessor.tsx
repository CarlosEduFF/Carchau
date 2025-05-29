import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView, Animated, Image } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase'; // Importação do Firebase Firestore
import { router, useLocalSearchParams } from 'expo-router'; // Para pegar os parâmetros passados na navegação
import styles from './StylesVerflessor';

export default function VerificacaoLocador() {
    // Estados para armazenar código de verificação do usuário e o código gerado
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [RepLoca, setRepLoca] = useState('');
    const [timer, setTimer] = useState(120); // Timer de 2 minutos para expiração do código
    const [loading, setLoading] = useState(false); // Inicializando como true para mostrar carregamento
    const [loading2, setLoading2] = useState(false);
    // Parâmetros passados via navegação
    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [confiPosse, setConfiPosse] = useState('Veículo entregue');
    const [codVerf, setCodVerf] = useState(0);
    // Gera o código de 4 dígitos e salva no Firestore
    
    useEffect(() => {
        generateCode(); // Gera o código quando a tela carrega
    }, []);
    
    // Temporizador de 120 segundos, resetando ao final do ciclo
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 120));
            if (timer === 0) {
                generateCode(); // Gera um novo código quando o tempo expira
            }
        }, 1000);
        
        return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
    }, [timer]);
    
    // Salva o código gerado no Firestore
    const saveCodeToFirestore = async () => {
        try {
            const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);
            await docRef.set({
                locadorId: locadorId,
                locatarioId: locatarioId,
                locadorCode: generatedCode, // Código gerado do locador
            }, { merge: true });
        } catch (error) {
            console.error("Erro ao salvar o código no Firestore: ", error);
        }
    };
    
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
    
    const generateCode = () => {
        const newCode = Math.floor(1000 + Math.random() * 9000).toString(); // Código aleatório de 4 dígitos
        setGeneratedCode(newCode);
    };
    // Adiciona número ao código inserido pelo usuário
    const handleNumberPress = (num: string) => {
        if (verificationCode.length < 4) {
            setVerificationCode(verificationCode + num); // Limita o código a 4 dígitos
        }
    };
    
    // Apaga o último número inserido
    const handleDelete = () => {
        setVerificationCode(verificationCode.slice(0, -1));
    };

    // Verifica o código do locatário
    const verifyCodeEn = async () => {
        setLoading(true); // Ativa o estado de carregamento
        const maxDelay = 5000; // Tempo máximo de espera (10 segundos)
        const intervalCheck = 1000; // Intervalo de verificação (1 segundo)

        let elapsedTime = 0; // Tempo decorrido

        try {
            const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);

            // Função para verificar e atualizar o estado do documento
            const checkAndUpdate = async () => {
                const docSnapshot = await docRef.get();
                const data = docSnapshot.data();

                if (data) {
                    const locatarioCode = data.locatarioCode;

                    if (verificationCode === locatarioCode) {
                        // Atualiza para "Veículo entregue" na subcoleção carrosRef
                        const carrosRef = firebase.firestore()
                            .collection('Locatarios')
                            .doc(locatarioId)
                            .collection('solicitacoes')
                            .doc(soliciId);

                        await carrosRef.update({
                            confirEntregaLocador: "Veículo entregue",
                        });

                        // Obtém o documento atualizado da subcoleção carrosRef
                        const carrosSnapshot = await carrosRef.get();
                        const carrosData = carrosSnapshot.data();

                        // Verifica se o veículo foi recebido pelo locatário
                        if (carrosData?.confirRecepLocata === "Veículo recebido") {
                            setLoading(false);
                            setLoading2(false);
                            setModalVisible(true); // Mostra modal de sucesso
                            return true; // Finaliza a verificação com sucesso
                        }
                    }

                    await docRef.update({
                        codVerf: 1,
                    });
                    
                }

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
                    confirEntregaLocador: "Veículo não entregue",
                });

                throw new Error("Tempo esgotado. Campo não foi atualizado para 'Veículo recebido'.");
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
        const maxDelay = 5000; // Tempo máximo de espera (10 segundos)
        const intervalCheck = 1000; // Intervalo de verificação (1 segundo)

        let elapsedTime = 0; // Tempo decorrido

        try {
            const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);

            // Função para verificar e atualizar o estado do documento
            const checkAndUpdate = async () => {
                const docSnapshot = await docRef.get();
                const data = docSnapshot.data();

                if (data) {
                    const locatarioCode = data.locatarioCode;

                    if (verificationCode === locatarioCode) {
                        // Atualiza para "Veículo entregue" na subcoleção carrosRef
                        const carrosRef = firebase.firestore()
                            .collection('Locatarios')
                            .doc(locatarioId)
                            .collection('solicitacoes')
                            .doc(soliciId);

                        await carrosRef.update({
                            confirRecepLocador: "Veículo recebido",
                        });

                        // Obtém o documento atualizado da subcoleção carrosRef
                        const carrosSnapshot = await carrosRef.get();
                        const carrosData = carrosSnapshot.data();

                        // Verifica se o veículo foi recebido pelo locatário
                        if (carrosData?.confirDevoLocata === "Veículo devolvido") {
                            setLoading(false);
                            setLoading2(false);
                            setModalVisible(true); // Mostra modal de sucesso
                            return true; // Finaliza a verificação com sucesso
                        }
                    }
                }

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
                    confirRecepLocador: "Veículo não recebido",
                });

                throw new Error("Tempo esgotado. Campo não foi atualizado para 'Veículo recebido'.");
            };

            await verifyWithTimeout();
        } catch (error) {
            console.error("Erro na verificação:", error);
            setLoading(false);
            setLoading2(false);
            setModalVisible2(true); // Mostra modal de falha
        }
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
                    Coloque o código de verificação do locatário aqui e forneça o seu código para ele:
                    <Text style={styles.codeText}> {generatedCode}</Text>
                </Text>

                {/* Exibição dos dígitos inseridos */}
                <View style={styles.codeDisplayContainer}>
                    {Array(4).fill('').map((_, index) => (
                        <View key={index} style={styles.codeCircle}>
                            <Text style={styles.codeDigit}>{verificationCode[index] || ''}</Text>
                        </View>
                    ))}
                </View>

                {/* Timer para exibição */}
                <Text style={styles.timerText}>
                    {Math.floor(timer / 60).toString().padStart(2, '0')}:
                    {(timer % 60).toString().padStart(2, '0')}
                </Text>

                {/* Teclado numérico */}
                <View style={styles.numberPad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num.toString())}>
                            <Text style={styles.numberText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.numberButton}></TouchableOpacity>
                    <TouchableOpacity style={styles.numberButton} onPress={() => handleNumberPress('0')}>
                        <Text style={styles.numberText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.numberButton} onPress={handleDelete}>
                        <Text style={styles.numberText}>⌫</Text>
                    </TouchableOpacity>
                </View>


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

                <Modal
                    visible={modalVisible3}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible3(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Confirmação de posse realizada com sucesso</Text>
                            <Text style={styles.modalText}>
                                A confirmação de posse foi realizada pelo locatário envolvido na locação.
                            </Text>
                            <Pressable
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible2(!modalVisible3), router.replace('/(tabs)/activity')
                                }}>
                                <Text style={styles.textStyle}>Entendi!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity style={styles.button} onPress={() => {
                    if (codVerf == 0) {
                        verifyCodeEn();
                        console.log('0');
                        setLoading2(true);
                    } else if (codVerf == 1) {
                        verifyCodeDe();
                        setLoading2(true);
                        console.log('1');
                    }
                }}>
                    <Text style={{ color: 'white' }}>Verificar Código</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

