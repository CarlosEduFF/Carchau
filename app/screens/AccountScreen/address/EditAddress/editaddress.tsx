import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import styles from './StylesAddress';
import { findAddressbyCep } from '~/utils/cep';
import { Services } from '~/services';
import Validators from '~/utils/Validators/index';
import { Components } from '~/components';

export default function Endereco() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [loading2, setLoading2] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    

    useEffect(() => {
        loadEndereco();
    }, []);

    const loadEndereco = async () => {
        setLoading(true);
        const endereco = await Services.fetchAddress();
        if (endereco) {
            setCep(endereco.cep);
            setEndereco(endereco.endereco);
            setNumero(endereco.numero);
            setComplemento(endereco.complemento);
            setBairro(endereco.bairro);
            setCidade(endereco.cidade);
            setEstado(endereco.estado);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            const enderecoData = {
                cep,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
            };
            const isValid = Validators.validateAddress(enderecoData, setSitu, setModalVisible2);
            if (!isValid) return;
            setLoading2(true);
            await Services.saveOrUpdateAddress(enderecoData);
            setModalVisible(true);
        } catch (error) {
            console.error("Erro ao salvar os dados do usuário: ", error);
            setSitu('Erro ao salvar os dados. Tente novamente.');
            setModalVisible2(true);
        } finally {
            setLoading2(false);
        }
    };

    const handleBuscarCep = async (cep: string) => {
        try {
            const dados = await findAddressbyCep(cep);
            setEndereco(dados.endereco);
            setBairro(dados.bairro);
            setCidade(dados.cidade);
            setEstado(dados.estado);
        } catch (error) {
            setSitu('Erro ao buscar CEP');
            setModalVisible2(true);
        }
    };




    return (
        <>
            <View style={styles.container}>
                <Components.AddressForm
                    cep={cep} setCep={setCep}
                    endereco={endereco} setEndereco={setEndereco}
                    numero={numero} setNumero={setNumero}
                    complemento={complemento} setComplemento={setComplemento}
                    bairro={bairro} setBairro={setBairro}
                    cidade={cidade} setCidade={setCidade}
                    estado={estado} setEstado={setEstado}
                    handleBuscarCep={handleBuscarCep}
                    handleSave={handleSave}
                    modalVisible={modalVisible} setModalVisible={setModalVisible}
                    modalVisible2={modalVisible2} setModalVisible2={setModalVisible2}
                    situ={situ}
                    loading={loading} loading2={loading2}
                />

            </View>

        </>
    );
}

