import { StyleSheet } from 'react-native';

const Colors = {
  primary: '#DE3C4B',
  secondary: '#63A46C',
  background: '#FDF8F7',
  textDark: '#000000',
  textLight: '#FFFFFF',
  tableInactive: '#EDEDED',
  dotRed: '#BA3A3A',
  dotGreen: '#409744',
};

export const cajeroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  role: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  orderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textDark,
  },
  iconSmall: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 6,
  },
  orderCard: {
    backgroundColor: '#FFF',
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  orderCardText: {
    fontSize: 18,
    color: Colors.textDark,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textDark,
    textAlign: 'center',
  },
  detailItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
  },
  detailItemText: {
    fontSize: 16,
    color: Colors.textDark,
  },
  totalsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 16,
    color: Colors.textDark,
    marginVertical: 2,
  },
  payButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  payButtonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.primary,
  },
  iconFooter: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  // ESTILOS NUEVOS AÑADIDOS AQUÍ 👇
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.tableInactive,
  },
  filterButtonText: {
    color: Colors.textDark,
    fontWeight: 'bold',
  },
});

export const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%'
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  cancelButton: {
    backgroundColor: '#DE3C4B'
  },
  confirmButton: {
    backgroundColor: '#63A46C'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});
