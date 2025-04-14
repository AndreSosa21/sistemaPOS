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

const cajeroStyles = StyleSheet.create({
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
    color: Colors.textLight,
    fontSize: 12,
    marginTop: 4,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconSmall: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 6,
  },
  iconFooter: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.primary,
  },
});

export default cajeroStyles;
