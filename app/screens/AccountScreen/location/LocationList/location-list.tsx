import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './StylesLocationList';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import { subscribeToCarros } from '~/services/subscribeToMyCarsService';
import { routes } from '~/constants/routes';
import CustomModal from '~/components/CustomModal/CustomModal';
import { Car } from '~/types/';

import deleteCarById from '~/services/carDeleteService';
import { ViewCars } from '~/services/navigationService';
import { Components } from '~/components';

export default function LocacaoList() {

    const [loading, setLoading] = useState(true);
    const [carros, setCarros] = useState<Car[]>([]);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        let unsubscribe: (() => void) | undefined;
        fetch().then(fn => {
            unsubscribe = fn;
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const fetch = async () => {
        const unsubscribe = await subscribeToCarros(
            (carrosAtualizados) => {
                setCarros(carrosAtualizados);
                setLoading(false);
            },
            (error) => {
                console.error('Erro ao buscar carros:', error);
                setLoading(false);
                setSitu('Erro ao buscar carros');
                setModalVisible2(true);
            }
        );
        return unsubscribe;
    };

    const handleDelete = async (carroId: string) => {
        try {
            await deleteCarById(carroId);
            setModalVisible(true);
        } catch (error: any) {
            console.error('Erro ao deletar o carro: ', error);
            setSitu(error.message || 'Erro ao deletar o carro.');
            setModalVisible2(true);
        }
    };

    function Adicionar() {
        router.push(routes.addLocation);
    }




    return (
        <View style={{ flex: 1 }}>
            <Components.BackButton />
            {loading && <LoadingCarAnimation loading={loading} />}
            <ScrollView style={styles.container}>

                <View style={styles.Addbutton}>
                    <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 20 }} onPress={Adicionar}>
                        <FontAwesome6 name="square-plus" size={28} color="white" />
                        <Text style={styles.text}>Adicionar um Carro</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    {carros.map(carro => (
                        <Components.CarCard
                            key={carro.id}
                            carro={carro}
                            type="edit"
                            onEdit={(id: any) => ViewCars({ id })}
                            onDelete={(id: string) => handleDelete(id)}
                        />
                    ))}
                </View>

                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    message="Locação Excluída com sucesso!"
                    onConfirm={() => {
                        setModalVisible(!modalVisible);
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

            </ScrollView >
        </View>

    );
}

