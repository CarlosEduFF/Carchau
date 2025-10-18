import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#022036',
    gap: 8,
  },

  formaAM: {
    width: 400,
    height: 400,
    marginTop: 10,

  },

  carlogo: {
    width: 250,
    height: 230,
    marginTop: -350,
    bottom: 0,
    left: 0,
  },


  titulo: {
    color: '#F2A51A',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,

  },

  texto: {
    color: '#F2A51A',
    fontSize: 16,
    marginTop: 2,
    marginBottom: 50,

  },

  button: {
    backgroundColor: '#F2A51A',
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBlockColor: 'white',
    borderRadius: 10,

  },

  buttoncriar: {
    backgroundColor: '#022036',
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderBottomWidth: 2,
    borderRadius: 10,

  },

});
export default styles;