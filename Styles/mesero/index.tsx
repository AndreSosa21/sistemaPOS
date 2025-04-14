import { StyleSheet } from 'react-native';

const Colors = {
  primary: '#DE3C4B',         // Rojo (header y footer)
  secondary: '#63A46C',       // Verde (mesas disponibles)
  background: '#FDF8F7',      // Fondo crema
  textDark: '#000000',
  textLight: '#FFFFFF',
  tableInactive: '#EDEDED',   // Gris claro (mesas inactivas)
  dotRed: '#BA3A3A',
  dotGreen: '#409744',
};

// Ya tienes estos para las pantallas principales del mesero (mantengo)
export const meseroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 60, // espacio para el footer fijo
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: 'bold',
  },
  roleText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 20,
  },
  dotLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  table: {
    backgroundColor: Colors.tableInactive,
    borderRadius: 16,
    width: 120,
    height: 120,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tableText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.textDark,
  },
  occupied: {
    backgroundColor: Colors.primary,
  },
  available: {
    backgroundColor: Colors.secondary,
  },
  footer: {
    backgroundColor: Colors.primary,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.textLight,
  },
});

export const menuStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    paddingBottom: 80,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: Colors.background, // Color rojo para resaltar precio
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: Colors.primary, // Rojo
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.textLight,
    fontWeight: '600',
    fontSize: 14,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  menuImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  addButtonFloating: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    zIndex: 2,
  },
  addButtonTextFloating: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 14,
  },
  menuInfo: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    height: 80,
  },
  menuTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuDescription: {
    color: Colors.textLight,
    fontSize: 14,
  },
  
});


export const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingBottom: 80, // espacio para el footer fijo
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  confirmButtonText: {
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export const tableOrdersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 10,
    paddingTop: 80, // espacio para el footer fijo
    alignContent: 'center',
    justifyContent: 'center',
  },
  orderContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 6,
    color: Colors.textDark,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
