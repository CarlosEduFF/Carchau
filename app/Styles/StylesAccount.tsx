import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
      alignItems: 'center',
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
    text: {
      fontWeight: 'bold',
      color: '#fff',
    },
    opcao: {
      top: '2%',
      borderBottomWidth: 2,
      borderColor: 'gray',
      width: '100%',
      padding: '4%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#022036',
    },
    opcao2: {
      top: '2%',
      borderBottomWidth: 6,
      borderColor: 'gray',
      width: '100%',
      padding: '4%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#022036',
    },
    imageRight: {
      position: 'absolute',
      right: 10, // Ajuste para posicionar no canto direito
      width: 30,
      height: 30,
    },
  
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      backgroundColor: '#F2A51A',
      padding: 10,
      borderRadius: 5,
      width: '45%',
      alignItems: 'center',
    },
    containerPriva: {
      backgroundColor: '#022036',
      flex: 1,
      padding: 16,
      alignItems: 'center',
    },
  
    buttonPriva: {
      backgroundColor: '#F2A51A',
      width: '60%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginBottom: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',  // Centraliza o modal verticalmente
      alignItems: 'center',      // Centraliza o modal horizontalmente
      backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Fundo transparente escuro
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '90%',
      maxHeight: '80%',
      alignItems: 'center',
      borderColor: 'red',
      borderWidth: 2
    },
    textPriva: {
      color: 'black',
      fontSize: 14,
      marginBottom: 20,
    },
  
  });
  
export default styles;  