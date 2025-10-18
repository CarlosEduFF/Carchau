import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#022036',
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
  caracteristicasTitle: {
    color: '#f2a51a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default styles;