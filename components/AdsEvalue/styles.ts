import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
});

export default styles;