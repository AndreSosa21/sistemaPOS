// app/styles/register.tsx

import { StyleSheet } from 'react-native';

const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#DE3C4B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    marginBottom: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#DE3C4B',
    paddingHorizontal: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#DE3C4B',
  },
  pickerItem: {
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#DE3C4B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  linkText: {
    color: '#000',
    fontSize: 16,
  },
  loginText: {
    color: '#DE3C4B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    width: '80%', // Ajusta el ancho del modal (más pequeño)
    maxWidth: 350, // Limita el ancho máximo del modal para que no sea demasiado grande
    backgroundColor: '#fff', // Fondo blanco para el modal
    borderRadius: 10, // Bordes redondeados
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Sombra para darle profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Elevación para dar sombra en Android
     // Elevación para dar sombra en Android
    position: 'absolute', // Asegura que el modal esté posicionado correctamente
    top: '50%', // Ajusta la posición del modal desde la mitad de la pantalla
    left: '50%', // Ajusta la posición del modal desde la mitad de la pantalla
    transform: [{ translateX: -175 }, { translateY: -100 }], // Ajusta el modal para que esté centrado
  },
  modalText: {
    fontSize: 16, // Reduce el tamaño del texto
    color: '#333', // Color oscuro para el texto
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22, // Mejora la legibilidad del texto
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo transparente detrás del modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default registerStyles;
