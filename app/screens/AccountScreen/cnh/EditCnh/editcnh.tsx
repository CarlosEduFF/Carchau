import { router } from 'expo-router';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import styles from './StylesEditcnh';
import images from '~/constants/images';
import CustomModal from '~/components/CustomModal/CustomModal';
import { routes } from '~/constants/routes';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import { pickImageFromCamera } from '~/utils/handleMediaManager';
import { fetchCnhData } from '~/services/CnhService/CnhService';
import { validateCNHImages } from '~/utils/validators';
import { uploadAndSaveCNH } from '~/services/cnhUpdateService';

export default function CNH() {
    const [frontCNH, setFrontCNH] = useState<string | null>(null);
    const [backCNH, setBackCNH] = useState<string | null>(null);
    const [existingImages, setExistingImages] = useState<{ front: string | null; back: string | null }>({
        front: null,
        back: null,
    });
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        loadCnhData();
    }, []);

    const handleSave = async () => {
        const isValid = validateCNHImages(frontCNH, backCNH, setSitu, setModalVisible2);
        if (!isValid) return;

        setLoading2(true);

        const result = await uploadAndSaveCNH(frontCNH, backCNH);

        if (result.success) {
            setModalVisible(true);
        } else {
            setSitu(result.message);
            setModalVisible2(true);
        }

        setLoading2(false);
    };

    const handlePickCamera = async (setImage: (uri: string) => void) => {
        const uri = await pickImageFromCamera();
        if (uri) {
            setImage(uri);
        }
    };

    const loadCnhData = async () => {
        const data = await fetchCnhData();
        if (data) {
            setExistingImages({ front: data.fotoFront, back: data.fotoBack });
        }
        setLoading(false);
    };




    return (
        <ScrollView>
            <View style={styles.container}>
                {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
                <Text style={styles.text}>Cadastre ou Edite sua CNH</Text>
                <Text style={styles.textocampo}>Para maior segurança, e conforme ordena  Art. 141 do CTB,
                    cadastre as imagens da sua CNH.</Text>

                {/* Imagem da frente da CNH */}
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.textocampo}>Frente da CNH:</Text>
                    {frontCNH || existingImages?.front ? (
                        <Image
                            style={styles.profileImage}
                            source={{ uri: (frontCNH || existingImages?.front) ?? '' }}
                            onError={(error) => console.log("Erro ao carregar imagem:", error)}
                        />
                    ) : (
                        <FontAwesome style={styles.icondelet} name="id-card-o" size={220} color="#f2a51a" />
                    )}
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => handlePickCamera(setFrontCNH)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>
                                Tirar foto da Frente
                            </Text>
                            <Image style={styles.iconUpl} source={images.uploadIcon} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Imagem do verso da CNH */}
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.textocampo}>Verso da CNH:</Text>
                    {backCNH || existingImages?.back ? (
                        <Image
                            style={styles.profileImage}
                            source={{ uri: (backCNH || existingImages?.back) ?? '' }}
                            onError={(error) => console.log("Erro ao carregar imagem:", error)}
                        />
                    ) : (
                        <FontAwesome style={styles.icondelet} name="id-card-o" size={220} color="#f2a51a" />
                    )}
                    <TouchableOpacity style={styles.input} onPress={() => handlePickCamera(setBackCNH)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>
                                Tirar foto do Verso
                            </Text>
                            <Image style={styles.iconUpl} source={images.uploadIcon} />
                        </View>
                    </TouchableOpacity>
                </View>

                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    message="CNH atualizada com Sucesso!"
                    onConfirm={() => {
                        setModalVisible(!modalVisible);
                        router.replace(routes.viewCnh);
                    }}
                />

                <CustomModal
                    visible={modalVisible2}
                    onClose={() => setModalVisible2(false)}
                    message={situ}
                    onConfirm={() => {
                        setModalVisible2(!modalVisible2);
                    }}
                />

                {/* Botão de salvar */}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => { handleSave(); }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Concluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
