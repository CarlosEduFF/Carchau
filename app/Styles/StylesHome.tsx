import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
    },
    loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
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
      marginTop: 30
    },
    loadingContainer: {
      backgroundColor: '#022036',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%'
    },
    userIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      margin: 10,
    },
    headerText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      width: '75%'
    },
    navigation: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    containerInput: {
      backgroundColor: 'white',
      borderRadius: 5,
      width: '85%',
      height: 35,
      flexDirection: 'row',
      paddingLeft: 3,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      paddingLeft: 10,
      height: 50
    },
    pressable: {
      width: '10%',
      height: 35,
      borderRadius: 5,
    },
    title: {
      color: '#F2A51A',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
      marginTop: 5,
    },
    favorito: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      color: 'white',
      alignSelf: 'flex-end',
    },
    brandsCarousel: {
      marginBottom: 20,
  
    },
    brandContainer: {
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    brandImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: '#f2a51a',
      padding: 20,
    },
    carCard: {
      backgroundColor: '#022036',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      borderColor: '#F2A51A',
      borderWidth: 3,
    },
    carImage: {
      width: '100%',
      height: 250,
      borderRadius: 10,
    },
    carName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      color: 'white',
    },
    carLocation: {
      color: '#fff',
      marginTop: 5,
      paddingBottom: 5,
    },
    preco: {
      color: '#fff',
      marginTop: 5,
      paddingBottom: 5,
    },
    carSeats: {
      marginTop: 5,
      color: 'white',
    },
    carRating: {
      marginTop: 5,
      color: 'white',
      marginLeft: 5,
    },
    carOwner: {
      marginTop: 5,
      color: 'white',
    },
    lupaIcon: {
      width: 30,
      height: 30,
    },
  });

  export default styles;