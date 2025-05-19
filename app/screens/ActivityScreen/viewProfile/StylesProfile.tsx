import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#022036',
      flex: 1,
      padding: 24,
    },
    caracteristicaLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    caracteristicasTitle: {
      color: '#f2a51a',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      alignSelf: 'center',
    },
    caracteristicaTexto: {
      color: 'white',
      marginLeft: 10,
      marginTop: 10,
      fontSize: 16,
    },
    reviewDetails: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#022036',
      borderRadius: 8,
    },
    detailsText: {
      color: '#fff',
      fontSize: 14,
    },
    name: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rating: {
      color: '#fff',
      fontSize: 14,
      marginLeft: 5,
    },
    reviewItem: {
      backgroundColor: '#022036',
      borderRadius: 8,
      marginBottom: 10,
      borderBottomWidth: 2,
      borderColor: '#888888',
      padding: 10,
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    reviewInfo: {
      flex: 1,
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
      color: '#FFCD1B',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
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
    textocampo: {
      color: '#f2a51a',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    textoexi: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      marginLeft: 20
    },
    textobox: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      top: 15,
    },
    button: {
      backgroundColor: '#F2A51A',
      width: '60%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginBottom: 20,
      marginTop: 30
    },
    Topo:{
        marginTop: 70
    }
  });

  export default styles;