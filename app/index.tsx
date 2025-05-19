import { router, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button } from '~/components/Button';

 const index = () => {
  function irparalogin() {
    router.replace('../screens/auth/login/loginScreen');
  }

   function irparacadastro() {
    router.replace ('../screens/auth/record/register');
  } 

  return (
    <>
    <SafeAreaProvider>
      <View style={styles.container}>
        <Image style={styles.formaAM}
          source={require('../assets/ideia/formaAmarela.png')}
          />
        <View >
         <Image style={styles.carlogo}
          source={require('../assets/ideia/logo-car.png')}
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

        <TouchableOpacity style={styles.button}  onPress={irparalogin}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>Já tenho uma conta</Text>
        </TouchableOpacity>  

        <TouchableOpacity style={styles.buttoncriar}  onPress={irparacadastro}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>Criar nova conta!</Text>
        </TouchableOpacity>  
        
      </View>
      </SafeAreaProvider>
    </>
  );
}

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#022036',
    gap: 8,
  },

  formaAM:{
    width: 400,
    height: 400,
    marginTop: 10,
        
  },

  carlogo:{
    width: 250,
    height: 230,
    marginTop: -350,
    bottom: 0,
    left: 0,  
  },


  titulo:{
    color: '#F2A51A',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,

  },

  texto:{
    color: '#F2A51A',
    fontSize: 16,
    marginTop: 2,
    marginBottom: 50,

  },

  button: {
    backgroundColor: '#F2A51A',
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBlockColor: 'white',
    borderRadius: 10,

  },

  buttoncriar: {
    backgroundColor: '#022036',
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderBottomWidth: 2,
    borderRadius: 10,

  },

});

