import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { CameraModal } from "../../components/CameraModal";
import { useCrud } from "../../context/CrudContext";
import styles from "../../Styles/admin";
import { useRouter } from "expo-router";
import Menu from "./menu";  // Importar componente de menú
import { AuthContext } from '../../context/AuthContext';

export default function AdminMenu() {
  const { products, addProduct, updateProduct, deleteProduct } = useCrud();
  const [image, setImage] = useState<any>(undefined);
  const [isVisible, setVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
  });
  const [showCrud, setShowCrud] = useState(false);
  const [showMenu, setShowMenu] = useState(false); 
  const { userType, email } = useContext(AuthContext);
  const [username, setUsername] = useState(''); // Nuevo estado para mostrar el menú
  const router = useRouter();

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleFooterNavigation = (page: string) => {
    if (page === "menu") {
      setShowMenu(true);
    } else if (page === "profile") {
      router.push("/admin");
    } else if (page === "logout") {
      router.push("/login");
    }
  };

  const handleNavigation = (page: string) => {
    if (page === "menu") {
      setShowMenu(false);
    } else if (page === "addPhoto") {
      setShowCrud(true);
    }
  };
  useEffect(() => {
      if (email) {
        const user = email.split('@')[0];
        setUsername(user);
      }
    }, [userType, email]);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello !{username} </Text>
        <TouchableOpacity onPress={() => router.push("/admin")}>
          <Image
            source={require("../../assets/images/campana.png")}
            style={styles.personaIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Mostrar menú o CRUD */}
      {showMenu ? (
        <Menu handleNavigation={handleNavigation} />
      ) : showCrud ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id || ""}
            ListHeaderComponent={
              <View style={styles.crudContainer}>
                <Text style={styles.title}>Product Management</Text>
                {/* Resto del formulario de productos */}
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                {/* Mostrar los productos */}
              </View>
            )}
          />
        </View>
      ) : (
        <View>
          {/* Aquí iría otro contenido si lo deseas */}
        </View>
      )}

      {/* Modal de cámara */}
      <CameraModal isVisible={isVisible} setImage={setImage} closeModal={() => setVisible(false)} />

      {/* Footer fijo */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleFooterNavigation("menu")}>
          <Image
            source={require("../../assets/images/menu.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFooterNavigation("profile")}>
          <Image
            source={require("../../assets/images/persona.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFooterNavigation("logout")}>
          <Image
            source={require("../../assets/images/out.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
