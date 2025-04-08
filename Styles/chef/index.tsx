import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 40,
    backgroundColor: "#DE3C4B", // Mismo color que en admin
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
  orderStatus: {
    fontSize: 16,
    marginBottom: 10,
  },
  dishItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  dishText: {
    fontSize: 16,
    color: "#333",
  },
  updateButton: {
    backgroundColor: "#3A4BE0", // Azul para la acción de actualización
    padding: 8,
    borderRadius: 5,
  },
  updateButtonText: {
    color: "#FFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#DE3C4B",
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
