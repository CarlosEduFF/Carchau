import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
      padding: 20,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 40,
      marginBottom: 8, // Espaçamento entre a imagem e o botão
    },
    viewProfileButton: {
      backgroundColor: '#f2a51a',
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      alignItems: 'center',
      width: 90,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
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
    // Modal
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
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginBottom: 40,
      backgroundColor: '#F2A51A',
      width: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    buttonClose: {
      backgroundColor: '#2196F3',
    },
  
    modalText: {
      marginBottom: 15,
      textAlign: 'justify',
    },
    header: {
      color: '#f2a51a',
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    date: {
      color: 'orange',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 80,
    },
  
  
    price: {
      color: 'white',
      fontSize: 20,
      textAlign: 'left',
      marginBottom: 10,
    },
    Conftext:{
    height:'30%'
    },
    description: {
      color: 'white',
      fontSize: 18,
      flex: 1,
      textAlign: 'justify',
      marginBottom: 10, // Diminua este valor para reduzir o espaço
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10, // Ajuste esse valor conforme necessário
    },
    acceptButton: {
      backgroundColor: '#f2a51a',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 5,
    },
    declineButton: {
      backgroundColor: 'red',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    foco: {
      color: '#f2a51a'
    },
    Topo: {
        marginTop: 70
    }
  
  });
  
  export default styles;