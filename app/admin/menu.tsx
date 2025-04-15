// Importación de React y hooks necesarios para el manejo del estado en el componente
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, ScrollView } from "react-native";
// Importación del Modal para la cámara
import { CameraModal } from "../../components/CameraModal";
// Uso del contexto de CRUD para productos
import { useCrud } from "../../context/CrudContext";
// Estilos específicos para el menú del administrador
import menuStyles from "../../Styles/admin/menu";

// Componente Menu: interfaz para agregar y gestionar productos
const Menu = ({ handleNavigation }: any) => {
  // Obtención de funciones CRUD desde el contexto
  const { products, addProduct, updateProduct, deleteProduct } = useCrud();
  // Estado para almacenar la imagen seleccionada
  const [image, setImage] = useState<any>(undefined);
  // Estado para el nuevo producto con sus propiedades
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
  });
  // Estado para controlar la visibilidad del Modal de la cámara
  const [isVisible, setVisible] = useState(false);

  // Función para agregar un nuevo producto utilizando la función del contexto
  const handleAddProduct = () => {
    addProduct(newProduct, image);
    // Se limpian los valores del formulario tras agregar el producto
    setNewProduct({ title: "", price: "", description: "" });
    setImage(undefined);
  };

  // Función para actualizar un producto existente
  const handleUpdateProduct = (id: string | undefined) => {
    if (id) {
      updateProduct(id, newProduct, image);
      // Se reinician los valores después de la actualización
      setNewProduct({ title: "", price: "", description: "" });
      setImage(undefined);
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = (id: string | undefined) => {
    if (id) {
      deleteProduct(id);
    }
  };

  // Función para cerrar el Modal de la cámara
  const closeModal = () => {
    setVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={menuStyles.scrollContainer}>
      <Text style={menuStyles.headerText}>Add New Product</Text>

      {/* Formulario para agregar un producto */}
      <View style={menuStyles.formContainer}>
        <TextInput
          style={menuStyles.input}
          placeholder="Product Title"
          value={newProduct.title}
          onChangeText={(text) => setNewProduct({ ...newProduct, title: text })}
        />
        <TextInput
          style={menuStyles.input}
          placeholder="Price"
          value={newProduct.price}
          onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={menuStyles.input}
          placeholder="Description"
          value={newProduct.description}
          onChangeText={(text) =>
            setNewProduct({ ...newProduct, description: text })
          }
        />

        {/* Visualización previa de la imagen seleccionada */}
        {image ? (
          <View style={menuStyles.imagePreview}>
            <Image source={{ uri: image.uri }} style={menuStyles.image} />
          </View>
        ) : (
          <TouchableOpacity
            style={menuStyles.imageButton}
            onPress={() => setVisible(true)}
          >
            <Text style={menuStyles.imageButtonText}>Select Image</Text>
          </TouchableOpacity>
        )}

        {/* Botón para agregar el producto */}
        <TouchableOpacity style={menuStyles.button} onPress={handleAddProduct}>
          <Text style={menuStyles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para la cámara */}
      <CameraModal isVisible={isVisible} setImage={setImage} closeModal={closeModal} />

      {/* Listado de productos existentes */}
      <Text style={menuStyles.headerText}>Existing Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <View style={menuStyles.productItem}>
            <Image source={{ uri: item.imageUrl }} style={menuStyles.productImage} />
            <View style={menuStyles.productDetails}>
              <Text style={menuStyles.productText}>{item.title}</Text>
              <Text style={menuStyles.productText}>${item.price}</Text>
              <Text style={menuStyles.productText}>{item.description}</Text>
            </View>
            <View style={menuStyles.actionButtons}>
              <TouchableOpacity
                style={menuStyles.updateButton}
                onPress={() => handleUpdateProduct(item.id)}
              >
                <Text style={menuStyles.updateButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={menuStyles.deleteButton}
                onPress={() => handleDeleteProduct(item.id)}
              >
                <Text style={menuStyles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
};

export default Menu;
