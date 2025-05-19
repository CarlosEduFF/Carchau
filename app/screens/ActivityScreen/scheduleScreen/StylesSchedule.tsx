import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
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
    picker: {
      color: '#fff',
  
    },
    pickerContainer: {
      borderWidth: 1,
      justifyContent: 'center',
      borderColor: '#f2a51a',
      overflow: 'hidden',
      borderRadius: 5,
      width: '100%',
      height: 45,
      top: 5,
      marginBottom: 5,
    },
  
    dateText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    valorTotal: {
      color: '#d9d7d7',
      fontSize: 16,
      marginBottom: 20,
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
  
    textocampo: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      top: 20,
      marginBottom: 20,
    },
    datePicker: {
      marginBottom: 10,
      color: '#fff',
      fontSize: 16,
      borderRadius: 5,
      height: 45,
      width: '100%',
      padding: 10,
      top: 5,
      borderWidth: 1,
      borderColor: '#f2a51a',
    },
    Topo: {
        marginTop: 80
    }
  });

  export default styles;