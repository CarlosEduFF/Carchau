import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022036',
    padding: 20,
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
  header: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  starContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center'
  },
  star: {
    marginHorizontal: 5,
  },
  meaning: {
    marginTop: 10,
    fontSize: 16,
    color: '#f2a51a',
    fontWeight: 'bold',
  },
  text: {
    color: '#f2a51a',
    fontSize: 15,
    textAlign: 'justify',
    marginBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,

  },
  textArea: {
    height: 150,
    width: '90%',
    borderColor: '#f2a51a',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    alignContent: 'center',
    textAlignVertical: 'top', // Alinha o texto no topo da área de texto
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 200,

  },
  nomelocador: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  textocampo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    top: 20,
    textAlign: 'left',
    marginBottom: 20,
    marginLeft: 20,
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
  Topo: {
    marginTop: 70
  },

  map: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.4,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 8,
  },

});

export default styles;