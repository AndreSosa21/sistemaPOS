import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useState } from "react";
import { CameraModal } from "../../components/CameraModal";
import { useCrud } from "../../context/CrudContext";
import styles from "../../Styles/admin";
import { useRouter } from "expo-router";

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
  const router = useRouter();

  const handleMenuClick = () => {
    setShowCrud(!showCrud);
  };

  const handleAddProduct = () => {
    addProduct(newProduct, image);
    setNewProduct({ title: "", price: "", description: "" });
    setImage(undefined);
  };

  const handleUpdateProduct = (id: string | undefined) => {
    if (id) {
      updateProduct(id, newProduct, image);
      setNewProduct({ title: "", price: "", description: "" });
      setImage(undefined);
    }
  };

  const handleDeleteProduct = (id: string | undefined) => {
    if (id) {
      deleteProduct(id);
    }
  };

  const closeModal = () => {
    setVisible(false);
  };

  const handleFooterNavigation = (page: string) => {
    if (page === "menu") {
      router.push("/admin");
    } else if (page === "profile") {
      router.push("/admin");
    } else if (page === "logout") {
      router.push("/login");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello ! Admin</Text>
        <TouchableOpacity onPress={() => router.push("/admin")}>
          <Image
            source={require("../../assets/images/campana.png")}
            style={styles.personaIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Contenido principal scrollable */}
      {showCrud && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id || ""}
            ListHeaderComponent={
              <View style={styles.crudContainer}>
                <Text style={styles.title}>Product Management</Text>

                <View style={styles.formContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={newProduct.title}
                    onChangeText={(text) => setNewProduct({ ...newProduct, title: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={newProduct.price}
                    onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={newProduct.description}
                    onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                  />

                  {image ? (
                    <View style={styles.imagePreview}>
                      <Image source={{ uri: image.uri }} style={styles.image} />
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.imageButton} onPress={() => setVisible(true)}>
                      <Text style={styles.imageButtonText}>Select Image</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                    <Text style={styles.buttonText}>Add Product</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <View style={styles.productContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                  <View style={styles.productDetails}>
                    <Text style={styles.productText}>{item.title}</Text>
                    <Text style={styles.productText}>{item.price}</Text>
                    <Text style={styles.productText}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateProduct(item.id)}>
                    <Text style={styles.updateButtonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProduct(item.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        </View>
      )}

      {/* Modal de cámara */}
      <CameraModal isVisible={isVisible} setImage={setImage} closeModal={closeModal} />

      {/* Footer fijo */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleMenuClick()}>
          <Image
            source={require("../../assets/images/menu.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFooterNavigation("admin")}>
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
