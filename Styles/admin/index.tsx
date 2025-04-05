// styles/admin/index.tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7', // Fondo más suave
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
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
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    marginBottom: 20,
    padding: 12,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#DE3C4B', // Color de botón personalizado
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#3A4BE0',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
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
  },
  productText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    backgroundColor: '#DE3C4B',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
  },
});

export default styles;
