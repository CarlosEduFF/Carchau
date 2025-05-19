import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#022036',
      flex: 1,
      padding: 24,
    },
    scroll: {
        marginTop: 50
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
    title: {
      color: '#f2a51a',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    input: {
      marginBottom: 10,
      color: '#fff',
      fontSize: 16,
      borderRadius: 5,
      height: 45,
      width: '100%',
      padding: 10,
      borderWidth: 0.5,
      borderColor: '#fff',
    },
    button:{
      marginBottom: 10,
        color: '#fff',
        fontSize: 16,
        borderRadius: 10,
        height: 45,
        width: '75%',
        padding: 10,
        borderWidth: 1,
        backgroundColor: '#F2A51A', // Certifique-se da cor desejada
        display: 'flex',
        alignItems: 'center', // Centraliza horizontalmente
        justifyContent: 'center', // Centraliza verticalmente
    },
    textocampo: {
      color: '#F2A51A',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    textobox: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      top: 15,
    },
    buttonSave: {
      backgroundColor: '#F2A51A',
      width: '40%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginBottom: 20,
      marginTop: 30
    },
    header: {
      backgroundColor: '#022036',
  },
  iconUpl: {
      width: 25,
      height: 25,
      borderRadius: 10,
      borderColor: '#F2A51A',
      alignContent: 'space-between',
  }
  });

  export default styles