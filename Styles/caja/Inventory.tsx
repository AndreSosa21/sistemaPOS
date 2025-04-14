import { StyleSheet } from 'react-native';
 
const Colors = {
  primary: '#DE3C4B',
  secondary: '#63A46C',
  background: '#FDF8F7',
  textDark: '#000000',
  textLight: '#FFFFFF',
};
 
export const cajeroInventoryStyles = StyleSheet.create({
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
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  iconHeader: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  body: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  orderCard: {
    backgroundColor: '#FFF',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: Colors.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  orderCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 5,
  },
  orderCardSubtitle: {
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 10,
  },
  itemsContainer: {
    maxHeight: 120,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: Colors.textDark,
  },
  totalsContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 16,
    color: Colors.textDark,
    marginVertical: 2,
  },
  noOrdersText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: Colors.textDark,
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
});
