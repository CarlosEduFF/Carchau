import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
      padding: 20,
      justifyContent: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    foco: {
      color: '#f2a51a',
      fontSize: 15
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'justify',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    input: {
      marginBottom: 10,
      color: '#fff',
      fontSize: 16,
      borderRadius: 5,
      height: 45,
      width: '90%',
      padding: 10,
      top: 15,
      borderWidth: 1,
      borderColor: '#fff',
    },
    textocampo: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      top: 20,
      marginBottom: 5,
    },
  
    button: {
      backgroundColor: '#f2a51a',
      width: '50%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#F2A51A',
      borderRadius: 10,
      top: 20,
      marginBottom: 50,
    },
    modalButton: {
      backgroundColor: '#f2a51a',
      width: 75,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#F2A51A',
      borderRadius: 10,
      top: 20,
      marginBottom: 50,
    },
  
    cartaocontainer: {
      width: 350,
      height: 200,
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
      marginTop: 65
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#022036', // Altere para a cor de fundo desejada
    },
    carlogo: {
      width: 50, // Altere para o tamanho desejado
      height: 50, // Altere para o tamanho desejado
    },
    card: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    cardDetails: {
      padding: 20,
      justifyContent: 'space-between',
    },
    label: {
      color: '#fff',
      fontSize: 13,
      marginBottom: 5,
    },
    cardNumber: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 50,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    name: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 20,
    },
    expiry: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    separacao: {
      fontSize: 16,
      fontWeight: 'bold',
      borderRightWidth: 2,
      borderColor: '#888888'
    },
    cvv: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    logo: {
      position: 'absolute',
      top: 20,
      right: 20,
    },
  });
  export default styles