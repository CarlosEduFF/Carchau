import React, { } from 'react';
import { View, Image, Text, TouchableOpacity } from "react-native";

import images from "~/constants/images";
import { router } from "expo-router";
import { routes } from "~/constants/routes";
import styles from './StylesApp';
const App = () => {
    return (<View style={styles.container}>
        <Image style={styles.formaAM}
            source={images.formAmarela}
        />
        <View >
            <Image style={styles.carlogo}
                source={images.carLogo}
            />
        </View>
        <View>
            <Text style={styles.titulo}>
                Bem vindos a carchau
            </Text>
            <Text style={styles.texto}>
                Inovando o sistema de aluguel de automóveis {"\n"}
                de forma rápida e acessível
            </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/screens/auth/login/loginScreen")}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>Já tenho uma conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttoncriar} onPress={() => router.push(routes.viewRegister)}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>Criar nova conta!</Text>
        </TouchableOpacity>

    </View>
    );
}
export default App;