import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#022036',
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
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },  
    section: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 30
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
    cardText: {
      color: '#f2a51a',
      fontSize: 14,
      marginBottom: 5,
    },
    Topo:{
        marginTop: 50
    }
  });

  export default styles;