import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    containerScroll: {
      flex: 1,
      backgroundColor: '#022036',
      paddingHorizontal: 20,
    },
    container: {
      flex: 1,
      backgroundColor: '#022036',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
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
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    foco: {
      color: '#f2a51a'
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
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'justify',
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
    iconContainer: {
      backgroundColor: '#2b4354',
      borderRadius: 80,
      padding: 20,
      marginBottom: 20,
      marginTop:90
    },
    icon: {
      color: '#f2a51a',
    },
    instructionText: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'justify',
      marginBottom: 20,
      display: 'flex'
    },
    codeText: {
      fontWeight: 'bold',
      color: '#f2a51a',
      fontSize: 18,
    },
    codeDisplayContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    codeCircle: {
      borderWidth: 2,
      borderColor: '#92acdf',
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    codeDigit: {
      fontSize: 24,
      color: '#fff',
    },
    timerText: {
      fontSize: 24,
      color: '#fff',
      marginBottom: 20,
    },
    numberPad: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '80%',
    },
    numberButton: {
      width: '30%',
      padding: 15,
      marginVertical: 10,
      backgroundColor: '#022036',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    numberText: {
      fontSize: 30,
      color: '#fff',
      fontWeight: 'bold',
    },
  });

  export default styles;