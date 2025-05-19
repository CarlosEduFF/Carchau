import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
      padding: 20,
    },
    vehicleView: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
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
      fontSize: 18
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
    section: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    label: {
      color: '#d9d7d7',
      fontSize: 20,
    },
    price: {
      color: '#d9d7d7',
      fontSize: 20,
    },
  
  
    button: {
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      marginBottom: 40,
      backgroundColor: '#f2a51a',
      width: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    buttonClose: {
      backgroundColor: '#f2a51a',
    },
  
    header: {
      color: '#f2a51a',
      fontSize: 26,
      textAlign: 'center',
      marginBottom: 10,
      marginTop: 25
    },
    date: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 50,
    },
  
    vehicleImage: {
      width: 350,
      height: 200,
      borderRadius: 10,
      marginBottom: 20,
    },
    description: {
      color: 'white',
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'justify',
    },
  
    containerprice: {
      marginBottom: 20,
    },
  
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    acceptButton: {
      backgroundColor: '#41b20f',
      borderWidth: 3,
      borderColor: '#5fcb2f',
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      marginBottom: 40,
      width: '40%',
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
    },
    declineButton: {
      backgroundColor: '#cd3737',
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      marginBottom: 40,
      width: '37%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
  
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  Topo:{
    marginTop: 40
  }
  });

  export default styles;