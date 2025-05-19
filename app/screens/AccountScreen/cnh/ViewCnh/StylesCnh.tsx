import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#022036',
      flex: 1,
      paddingTop: 20,
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
    image: {
      width: 320,
      height: 240,
    },
    icon: {
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#F2A51A',
      width: 230,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#F2A51A',
      borderRadius: 10,
      marginBottom: 20,
  
    },
  
    textocampo: {
      fontWeight: 'bold',
      color: '#fff',
      fontSize: 16,
      width: '90%',
      textAlign: 'justify'
    },
  
    text: {
      alignSelf: 'baseline',
      color: '#f2a51a',
      fontSize: 18,
      fontWeight: 'bold',
      paddingBottom: 10,
      paddingLeft: 20,
      marginTop: 65
    },
  
    icondelet: {
      top: '8%',
      marginBottom: '12%',
      backgroundColor: '#022036',
      alignContent: 'space-between',
    },
  
    header: {
      backgroundColor: '#022036',
    },
  
  });
  export default styles;