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
  // Estilos para el Modal
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Fondo transparente
  },
  modalText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default registerStyles;
