// Importaciones de React y componentes de React Native necesarios para la interfaz
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
// Importación del componente para la cámara en un Modal
import { CameraModal } from "../../components/CameraModal";
// Uso del contexto para operaciones CRUD de productos
import { useCrud } from "../../context/CrudContext";
// Importación de estilos específicos para el administrador
import styles from "../../Styles/admin";
// Hook para navegación con Expo Router
import { useRouter } from "expo-router";
// Importa el componente de menú (interfaz para agregar o gestionar productos)
import Menu from "./menu";  // Importar componente de menú
// Importación del contexto de autenticación para obtener datos del usuario
import { AuthContext } from '../../context/AuthContext';

// Componente AdminMenu: interfaz principal para el administrador
export default function AdminMenu() {
  // Obtención de funciones CRUD para productos
  const { products, addProduct, updateProduct, deleteProduct } = useCrud();
  // Estado para almacenar la imagen seleccionada en el Modal de cámara
  const [image, setImage] = useState<any>(undefined);
  // Estado para controlar la visibilidad del Modal de cámara
  const [isVisible, setVisible] = useState(false);
  // Estado para manejar los datos del nuevo producto a agregar o editar
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
  });
  // Estados para mostrar diferentes vistas (CRUD o menú)
  const [showCrud, setShowCrud] = useState(false);
  const [showMenu, setShowMenu] = useState(false); 
  // Obtención del usuario del contexto de autenticación
  const { userType, email } = useContext(AuthContext);
  // Estado para extraer el nombre de usuario del email
  const [username, setUsername] = useState('');
  // Hook de navegación
  const router = useRouter();

  // Función que alterna la visibilidad del menú
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  // Función para manejar la navegación en el footer según la opción seleccionada
  const handleFooterNavigation = (page: string) => {
    if (page === "menu") {
      setShowMenu(true);
    } else if (page === "profile") {
      router.push("/admin");
    } else if (page === "logout") {
      router.push("/login");
    }
  };

  // Función para gestionar la navegación interna entre vistas (menú o CRUD)
  const handleNavigation = (page: string) => {
    if (page === "menu") {
      setShowMenu(false);
    } else if (page === "addPhoto") {
      setShowCrud(true);
    }
  };

  // useEffect para extraer el nombre de usuario a partir del email
  useEffect(() => {
      if (email) {
        const user = email.split('@')[0];
        setUsername(user);
      }
    }, [userType, email]);

  return (
    <View style={{ flex: 1 }}>
      {/* Header con saludo y notificación */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello !{username} </Text>
        <TouchableOpacity onPress={() => router.push("/admin")}>
          <Image
            source={require("../../assets/images/campana.png")}
            style={styles.personaIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Renderizado condicional: se muestra el menú o la vista CRUD según los estados */}
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
                {/* Mostrar los productos (puedes ampliar la visualización aquí) */}
              </View>
            )}
          />
        </View>
      ) : (
        <View>
          {/* Área para contenido adicional cuando no se muestra menú ni CRUD */}
        </View>
      )}

      {/* Modal de cámara para tomar/seleccionar imagen */}
      <CameraModal isVisible={isVisible} setImage={setImage} closeModal={() => setVisible(false)} />

      {/* Footer fijo con botones de navegación */}
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
