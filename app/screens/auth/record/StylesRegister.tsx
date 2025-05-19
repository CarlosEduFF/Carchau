import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#022036',
      flex: 1,
      padding: 24,
      alignItems: 'center',
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
    modalbutton: {
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
    }, foco: {
      color: '#f2a51a'
    },
    circuloam: {
      width: 300,
      height: 300,
      marginTop: 10,
      left: 180,
      bottom: 90,
    },
    segundocirculo: {
      width: 300,
      height: 300,
      marginTop: 10,
      top: 200,
      right: 170,
    },
    caixalogin: {
      backgroundColor: '#022036',
      borderRadius: 15,
      borderWidth: 5,
      borderColor: '#FFCD1B',
      width: '90%',
      height: 500,
      bottom: 460,
      alignItems: 'center',
    },
    form: {
      flex: 1,
      alignItems: "flex-start",
      width: '90%',
      top: 20,
    },
    input: {
      backgroundColor: '#022036',
      width: '80%',
      marginBottom: 20,
      color: '#fff',
      fontSize: 14,
      borderRadius: 7,
      padding: 5,
      top: 30,
      borderWidth: 2,
      borderColor: '#fff',
      height: 40, // Defina uma altura fixa
    },
    title: {
      color: '#FFCD1B',
      fontSize: 22,
      fontWeight: 'bold',
      top: 10,
      bottom: 20,
    },
    textocampo: {
      color: '#FFCD1B',
      fontSize: 16,
      fontWeight: 'bold',
      top: 20,
    },
    button: {
      backgroundColor: '#F2A51A',
      width: '60%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      bottom: 15,
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
      width: '40%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginBottom: 50,
      borderWidth: 2,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',  // Centraliza o modal verticalmente
      alignItems: 'center',      // Centraliza o modal horizontalmente
      backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Fundo transparente escuro
    },
    modalContent: {
      backgroundColor: '#022036',
      padding: 20,
      borderRadius: 10,
      width: '90%',
      maxHeight: '80%',  // Limita a altura do modal
      alignItems: 'center',
    },
    
  
  });

  export default styles;