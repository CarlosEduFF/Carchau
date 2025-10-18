import { useEffect, useRef, useState } from "react";
import { Services } from "~/services";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Divider } from '@rneui/themed';
import Entypo from '@expo/vector-icons/Entypo';
import styles  from "./styles";
import { View, Text, Image} from "react-native";
import PagerView from "react-native-pager-view";
import images from "~/constants/images";
import LoadingCarAnimation from "../LoadingCarAnimation/LoadingCarAnimation";


interface AdsCarProps {
    carroId: string;
    LocadorId: string;
}

const AdsCar: React.FC<AdsCarProps> = ({ carroId, LocadorId }) => {
    const [modelo, setModelo] = useState('Não disponível');
    const [marca, setMarca] = useState('Não disponível');
    const [ano, setAno] = useState(0);
    const [placa, setPlaca] = useState('Não disponível');
    const [combustivel, setCombustivel] = useState('Não disponível');
    const [QuantidadeLugares, setQuantidadeLugares] = useState(0);
    const [selectedAr, setSelectedAr] = useState('Não disponível');
    const [selectedCambio, setSelectedCambio] = useState('Não disponível');
    const [selectedStep, setSelectedStep] = useState('Não disponível');
    const [selectedAirbags, setSelectedAirbags] = useState('Não disponível');
    const [pontoencontro, setPontoEncontro] = useState('Não disponível');
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [precoDia, setPrecoDia] = useState(0);
    const [precoSemana, setPrecoSemana] = useState(0);
    const [precoMes, setPrecoMes] = useState(0);
    const [caucao, setCaucao] = useState(0);
    const [fotosCarro, setFotosCarro] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        fetchCarroData();
    }, [carroId, LocadorId]);

    const fetchCarroData = async () => {
        try {
            if (carroId && LocadorId) {
                const carro = await Services.fetchCarById(LocadorId, carroId);
                if (carro) {
                    setModelo(carro.modelo);
                    setMarca(carro.marca);
                    setAno(carro.ano);
                    setPlaca(carro.placa);
                    setCombustivel(carro.combustivel);
                    setQuantidadeLugares(carro.quantidadeLugares);
                    setSelectedAr(carro.arCondicionado);
                    setSelectedStep(carro.step);
                    setSelectedCambio(carro.cambio);
                    setSelectedAirbags(carro.airbags);
                    setPontoEncontro(carro.pontoencontro);
                    setSelectedPeriods(carro.modalidadesAluguel);
                    setPrecoDia(carro.precoDia);
                    setPrecoSemana(carro.precoSemana);
                    setPrecoMes(carro.precoMes);
                    setCaucao(carro.caucao);
                    if (carro.fotosCarro) setFotosCarro(carro.fotosCarro);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados do carro: ", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={{ flex: 1 }}>
            {(loading) && <LoadingCarAnimation loading={loading} />}
            <Text style={styles.modeloCarro}>{marca} {modelo}  </Text>
            <Text style={styles.anoCarro}>Ano {ano}</Text>
            {
                fotosCarro.length > 0 ? (
                    <PagerView
                        style={styles.pageview}
                        initialPage={0}
                        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)} 
                    >
                        {fotosCarro.map((fotoUri, index) => (
                            <View key={index} style={styles.page}>
                                <Image
                                    ref={flatListRef}
                                    key={index}
                                    source={{ uri: fotoUri }}
                                    style={styles.vehicleImage}
                                />
                            </View>
                        ))}
                    </PagerView>
                ) : (
                    <View style={styles.page2}>
                        <Image
                            source={images.defaultVehicleImage} 
                            style={styles.vehicleImage2} 
                        />
                    </View>
                )
            }
            <View style={styles.pagination}>
                {fotosCarro.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: index === activeIndex ? '#f2a51a' : '#888', width: index === activeIndex ? 9 : 7, height: index === activeIndex ? 9 : 7, marginBottom: 15, } // Amarelo para o ativo, cinza para os outros
                        ]}
                    />
                ))}
            </View>

            <Text style={styles.caracteristicasTitle}>Características</Text>
            <View style={styles.ViewCarac}>
                <View >
                    <View style={styles.caracteristicaLinha}>
                        <FontAwesome name="tachometer" size={30} color="#f2a51a" />
                        <Text style={styles.caracteristicaTexto}>Combustível:{'\n'}{combustivel}</Text>
                    </View>
                    <View style={styles.caracteristicaLinha}>
                        <MaterialCommunityIcons name="car-seat" size={30} color="#f2a51a" />
                        <Text style={styles.caracteristicaTexto}>Lugares: {'\n'}{QuantidadeLugares}</Text>
                    </View>
                    <View style={styles.caracteristicaLinha}>
                        <MaterialCommunityIcons name="airbag" size={30} color="#f2a51a" />
                        <Text style={styles.caracteristicaTexto}>Airbags:{'\n'}{selectedAirbags}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.caracteristicaLinha}>
                        <MaterialCommunityIcons name="car-shift-pattern" size={30} color="#f2a51a" />
                        <Text style={styles.caracteristicaTexto}>Câmbio:{'\n'}{selectedCambio}</Text>
                    </View>
                    <View style={styles.caracteristicaLinha}>
                        <FontAwesome name="snowflake-o" size={30} color="#f2a51a" />
                        <Text style={styles.caracteristicaTexto}>Ar-condicionado:{'\n'}{selectedAr}</Text>
                    </View>
                    <View style={styles.caracteristicaLinha}>
                        <MaterialCommunityIcons name="tire" size={30} color="#f2a51a" />
                        <Text style={styles.caracteristicaTexto}>Estepe: {'\n'}{selectedStep}</Text>
                    </View>
                </View>
            </View>

            <Divider style={styles.Divisor} />

            <View style={styles.ViewCarac}>
                <View >
                    <View style={styles.caracteristicaLinha}>
                        <FontAwesome6 name="money-bill-transfer" size={26} color="#f2a51a" />
                        <Text style={styles.caracteristicaTexto}>Caução:{'\n'}R$ {caucao}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.caracteristicaLinha}>
                        <Entypo name="location" size={30} color="#f2a51a" />
                        <Text style={styles.caracteristicaTexto}>Ponto de Encontro:{'\n'}{pontoencontro}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.caracteristicaLinha, { justifyContent: 'center' }]}>
                <FontAwesome name="calendar" size={42} color="#f2a51a" />
                <View style={{ flexDirection: 'column' }}>
                    <Text style={[styles.caracteristicaTexto, { color: '#f2a51a' }]}>
                        Modalidade:
                    </Text>
                    {precoDia ? (
                        <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]}>
                            Dia: R$ {precoDia}
                        </Text>
                    ) : null}
                    {precoSemana ? (
                        <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]}>
                            Semana: R$ {precoSemana}
                        </Text>
                    ) : null}
                    {precoMes ? (
                        <Text style={[styles.caracteristicaTexto, { marginTop: 0 }]}>
                            Mês: R$ {precoMes}
                        </Text>
                    ) : null}
                </View>
            </View>
        </View>
    );
}

export default AdsCar;