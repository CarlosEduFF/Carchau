import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022036',
    padding: 20,
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
  // Modal
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
  bottonEmpty: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: 90,
    marginTop: 10
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'justify',
  },
  header: {
    color: '#f2a51a',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 80,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    alignItems: 'center',
  },
  viewProfileButton: {
    backgroundColor: '#f2a51a',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: 90,
    marginTop: 10
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  description: {
    color: 'white',
    fontSize: 18,
    textAlign: 'justify',
    marginBottom: 30,
  },
  price: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    backgroundColor: 'red',
    borderWidth: 3,
    borderColor: 'red',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginBottom: 40,
    width: '40%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  foco: {
    color: '#f2a51a'
  },
  Topo: {
    marginTop: 70
  }
});

export default styles;