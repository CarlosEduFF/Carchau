import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  eventDescription: {
    fontSize: 14,
    color: '#888',
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
  },
  eventValue: {
    fontSize: 14,
    color: '#f2a51a',
    marginRight: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    marginLeft: 0
  },
});

export default styles;