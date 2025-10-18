import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
  pageview: {
    width: '100%',
    height: 250,
    borderRadius: 20,
  },
  page: {
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%', 
    height: '100%', 
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
  ViewCarac: {
    flexDirection: 'row', 
    justifyContent: 'space-around'
  },
  Divisor:{
    marginBottom: 20, 
    marginTop: 10 
  },
});

export default styles;