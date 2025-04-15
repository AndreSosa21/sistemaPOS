import { StyleSheet } from "react-native";

const Colors = {
  primary: "#DE3C4B",
  secondary: "#63A46C",
  background: "#F7F7F7",
  textDark: "#000000",
  textLight: "#FFFFFF",
  tableInactive: "#EDEDED",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  personaIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
  },
  ordersList: {
    padding: 20,
  },
  orderItem: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dishesList: {
    marginVertical: 10,
  },
  dishText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 2,
  },
  statusButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  statusButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
  },
  // ESTILOS AGREGADOS PARA FILTROS
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
    gap: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.tableInactive,
    marginVertical: 5,
    height: 40,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textDark,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  footerIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
  },
});

export default styles;
