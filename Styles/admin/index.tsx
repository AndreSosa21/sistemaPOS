import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
    justifyContent: 'space-between' ,
    height: '100%',
    width: '100%' // Fondo suave para una experiencia visual relajada
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 40,
    backgroundColor: '#DE3C4B', // Rojo para la cabecera
    alignItems: 'center',
    width: '100%',
    
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  personaIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  crudContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
    backgroundColor: '#F7F7F7', // Fondo suave para los inputs
    color: '#333', // Color de texto oscuro para mejor legibilidad
  },
  button: {
    backgroundColor: '#3A4BE0', // Azul para el botón de añadir
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
    backgroundColor: '#DE3C4B', // Rojo para el botón de seleccionar imagen
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
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#3A4BE0', // Azul para las acciones de actualización
    padding: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: '#FFF',
  },
  deleteButton: {
    backgroundColor: '#D9534F', // Rojo para las acciones de eliminación
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',  // Espaciado entre los iconos
    alignItems: 'center',
    backgroundColor: '#DE3C4B',  // Mismo color que el header
    paddingVertical: 10,
    marginTop: 'auto',
    bottom: 0,
    width: '100%',
  },
  footerIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff', // Color blanco para los iconos
  },
});

export default styles;
