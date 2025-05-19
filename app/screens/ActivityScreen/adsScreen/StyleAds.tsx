import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#022036',
  },
  foco: {
    color: '#f2a51a'
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
  /* modalidadeContainer: {
    marginTop: 20, // Espaçamento acima da seção
    padding: 10,   // Padding interno para a seção
    backgroundColor: '#022036', // Fundo para destacar a seção
    borderRadius: 8, // Borda arredondada
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Para Android
  }, */
  modalidadeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  pageview: {
    width: '100%',
    height: 250, // Ajusta a altura do PagerView para acomodar a imagem maior
    borderRadius: 20,
  },
  page: {
    justifyContent: 'center', // Centralizando verticalmente
    alignItems: 'center', // Centralizando horizontalmente
    width: '100%', // Garante que a view ocupe toda a largura disponível
    height: '100%', // Garante que a view ocupe toda a altura disponível
  },

  vehicleImage: {
    width: 350,
    height: 200,
    borderRadius: 10,
  },
  page2: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '20%',
  },
  vehicleImage2: {
    width: '52%',
    height: 200,
    borderRadius: 10,
  },
  localizacao1: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  header: {
    borderBottomColor: '#2A4559',
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 35
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  dot: {
    height: 7,
    width: 7,
    borderRadius: 4,
    marginHorizontal: 4
  },
  userIcon: {
    width: '10%',
    height: '100%',
    justifyContent: 'flex-start',
    borderRadius: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    height: '100%',
    alignItems: 'center',
    marginLeft: 5
  },
  title2: {
    color: '#F2A51A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  carTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carModel: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  carImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  features: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
  },
  featureValue: {
    color: 'yellow',
    fontSize: 16,
    fontWeight: 'bold',
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
    width: '55%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F2A51A',
    borderRadius: 10,
    top: 20,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 5,
  },

  button: {
    borderRadius: 5,
    padding: 15,
    backgroundColor: '#F2A51A',
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonClose: {
    backgroundColor: '#F2A51A',
  },

  perfilIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    margin: 10,

  },
  nomeLocador: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  modeloCarro: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 60
  },
  anoCarro: {
    color: '#f2a51a',
    fontSize: 16,
    marginLeft: 10,
  },
  caracteristicasTitle: {
    color: '#f2a51a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },

  caracteristicaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  caracteristicaTexto: {
    color: 'white',
    marginLeft: 10,
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  reviewItem: {
    backgroundColor: '#022036',
    borderRadius: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
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
  Topo: {
    marginTop: 30,

  }
});

export default styles;