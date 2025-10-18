import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#022036',
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  circuloam: {
    width: 300,
    height: 300,
    marginTop: 10,
    left: 180,
    bottom: 90,
  },
  segundocirculo: {
    width: 300,
    height: 300,
    marginTop: 10,
    top: 200,
    right: 170,
  },
  caixalogin: {
    backgroundColor: '#022036',
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#FFCD1B',
    width: '90%',
    height: 500,
    bottom: 460,
    alignItems: 'center',
  },
  textocampo: {
    color: '#FFCD1B',
    fontSize: 16,
    fontWeight: 'bold',
    top: 20,
  },
  input: {
    backgroundColor: '#022036',
    width: '80%',
    marginBottom: 20,
    color: '#fff',
    fontSize: 14,
    borderRadius: 7,
    padding: 5,
    top: 30,
    borderWidth: 2,
    borderColor: '#fff',
    height: 40, // Defina uma altura fixa
  },
  title: {
    color: '#FFCD1B',
    fontSize: 22,
    fontWeight: 'bold',
    top: 10,
    bottom: 20,
  },
  form: {
    flex: 1,
    alignItems: "flex-start",
    width: '90%',
    top: 20,
  },
  buttonPriva: {
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 50,
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#F2A51A',
    width: '60%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 15,
  },
  termoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkBoxContainer: {
    backgroundColor: "transparent",
    width: 0,
    paddingRight: 0,
    left: -20,
  },
  termoText: {
    color: "#fff",
    fontSize: 13,
  },
  termoButtonWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },

  buttonPrivaText: {
    fontWeight: "bold",
  },
  buttonPrivaEnabled: {
    backgroundColor: "#F2A51A",
    borderColor: "#F2A51A",
  },
  buttonPrivaDisabled: {
    backgroundColor: "#022036",
    borderColor: "#888888",
  },

  buttonPrivaTextEnabled: {
    color: "#fff",
  },
  buttonPrivaTextDisabled: {
    color: "#888888",
  },
});

export default styles;