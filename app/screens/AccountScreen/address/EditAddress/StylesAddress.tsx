import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#022036',
      flex: 1,
      padding: 24,
      alignItems: 'center',
      marginTop: 30
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
    pickerContainer: {
      borderWidth: 1,
      justifyContent: 'center',
      borderColor: '#ffffff',
      overflow: 'hidden',
      borderRadius: 5,
      width: '100%',
      height: 45,
      top: 5,
    },
    picker: {
      color: '#000',
    },
    title: {
      color: '#FFCD1B',
      fontSize: 20,
      fontWeight: 'bold',
      top: 10,
      bottom: 20,
    },
  
    input: {
      marginBottom: 10,
      color: '#fff',
      fontSize: 16,
      borderRadius: 5,
      height: 40,
      padding: 5,
      top: 8,
      borderWidth: 0.5,
      borderColor: '#fff',
    },
  
    textocampo: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      top: 10,
      marginBottom: 5,
    },
  
    button: {
      backgroundColor: '#F2A51A',
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
  
    header: {
      backgroundColor: '#022036',
    },
  
  }); 
  export default styles;