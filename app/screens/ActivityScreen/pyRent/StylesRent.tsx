import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#022036', // Altere para a cor de fundo desejada
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
    carlogo: {
      width: 50, // Altere para o tamanho desejado
      height: 50, // Altere para o tamanho desejado
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
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'justify',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
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
    textocampo: {
      fontWeight: 'bold',
      color: '#fff',
      fontSize: 16,
    },
  
    text: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      left: 10,
      paddingBottom: 10,
    },
  
    header: {
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    section: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop:30
    },
    label: {
      color: '#f2a51a',
      fontSize: 20,
      fontWeight: 'bold',
    },
    value: {
      color: 'white',
      fontSize: 20,
    },
    label2: {
      color: '#fff',
      fontSize: 18,
    },
    value2: {
      color: 'white',
      fontSize: 18,
    },
    subheader: {
      color: '#f2a51a',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    opcao: {
      borderBottomWidth: 1,
      borderColor: 'gray',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#022036',
    },
  
    hiddenText: {
      backgroundColor: '#0E3B4A',
      color: '#0E3B4A',
      fontSize: 18,
      letterSpacing: 2,
    },
    cardInfo: {
      flex: 2,
      justifyContent: 'center',
    },
    cardLabel: {
      color: 'orange',
      fontSize: 12,
    },
    cardText: {
      color: '#0E3B4A',
      fontSize: 14,
      marginBottom: 5,
    },
    cardLogo: {
      flex: 1,
      width: 50,
      height: 30,
    },
    foco: {
      color: '#f2a51a'
    },
    Topo: {
        marginTop:50
    }
  });

  export default styles;