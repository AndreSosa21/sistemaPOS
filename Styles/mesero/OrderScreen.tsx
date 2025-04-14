import { StyleSheet } from 'react-native';

const Colors = {
  primary: '#DE3C4B',         // Rojo (cabecera, botones)
  secondary: '#63A46C',       // Verde (mesa seleccionada)
  background: '#FDF8F7',      // Fondo crema
  textDark: '#000000',
  textLight: '#FFFFFF',
  tableInactive: '#EDEDED',   // Gris claro para mesas sin seleccionar
  modalBackground: 'rgba(0, 0, 0, 0.5)', // Fondo del modal
};

export const orderScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    paddingTop: 40,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  headerText: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productList: {
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.textDark,
  },
  productDescription: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  orderSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    marginBottom: 8,
  },
  cartItemText: {
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 6,
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginHorizontal: 6,
  },
  removeButtonText: {
    fontSize: 12,
    color: 'red',
    fontWeight: 'bold',
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  tableButton: {
    backgroundColor: Colors.tableInactive,
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableButtonSelected: {
    backgroundColor: Colors.secondary,
  },
  tableButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  selectedTableText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 8,
    color: Colors.textDark,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  confirmButtonText: {
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  scanButtonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.modalBackground,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  closeModalButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 50,
  },
  closeModalButtonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
  },
});
