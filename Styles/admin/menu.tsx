import { StyleSheet } from 'react-native';

const menuStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A4BE0',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
    width: '100%',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    marginBottom: 20,
    padding: 12,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    color: '#333',
  },
  button: {
    backgroundColor: '#3A4BE0',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#DE3C4B',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  imageButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  imagePreview: {
    marginBottom: 15,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productItem: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#3A4BE0',
    padding: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: '#FFF',
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
  },
});

export default menuStyles;
