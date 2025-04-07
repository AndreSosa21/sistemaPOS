import { StyleSheet } from 'react-native';

const chefStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Fondo suave
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DE3C4B', // Rojo para la cabecera
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  notificationIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFF',
  },
  tableItem: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tableText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  viewOrderButton: {
    backgroundColor: '#3A4BE0',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',  // Espaciado entre los iconos
    alignItems: 'center',
    backgroundColor: '#DE3C4B',  // Mismo color que el header
    paddingVertical: 10,
    bottom: 0,
    width: '100%',
    position: 'absolute',
    left: 0,
  },
  footerIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFF',
  },
});

export default chefStyles;
