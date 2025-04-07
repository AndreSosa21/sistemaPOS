import { StyleSheet } from 'react-native';

const Colors = {
  primary: '#C94949',         // Rojo (header y footer)
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

// Nuevos estilos para la pantalla de menú
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
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 6,
  },
  addButton: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cartButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  cartButtonText: {
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
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
