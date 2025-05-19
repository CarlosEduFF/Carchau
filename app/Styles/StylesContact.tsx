import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
      paddingTop: 20,
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
    header: {
      borderBottomColor: '#2A4559',
      borderBottomWidth: 2,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      width: '100%',
    },
  
    solicitacaoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      width: '100%',
      height: 60,
      backgroundColor: '#022036',
      borderBottomWidth: 1,
      borderColor: '#888888',
  
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 10,
  
  
    },
    text: {
      fontSize: 16,
      color: 'white'
    },
    Topo: {
      marginTop: 65
    }
  });
  export default styles;