import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#022036',
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
  modeloCarro: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
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
  },
  LocadorProfile: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 60
  },
  TextBranco:{
    color: 'white'
  },
  Divisor:{
    marginBottom: 20, 
    marginTop: 10 
  },
  ViewCarac: {
    flexDirection: 'row', 
    justifyContent: 'space-around'
  }
});

export default styles;