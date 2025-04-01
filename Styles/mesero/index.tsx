import { StyleSheet } from 'react-native';

const meseroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DE3C4B',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  bellIcon: {
    width: 30,
    height: 30,
  },
  tableView: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DE3C4B',
    marginBottom: 16,
  },
  tablesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  table: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
    marginRight: 16,
  },
  tableText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  available: {
    backgroundColor: '#34C759', // Verde para mesas disponibles
  },
  occupied: {
    backgroundColor: '#FF3B30', // Rojo para mesas ocupadas
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    borderBottomWidth: 2,
    borderBottomColor: '#DE3C4B',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default meseroStyles;
