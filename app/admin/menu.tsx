import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, ScrollView } from "react-native";
import { CameraModal } from "../../components/CameraModal";
import { useCrud } from "../../context/CrudContext";
import menuStyles from "../../Styles/admin/menu";

const Menu = ({ handleNavigation }: any) => {
  const { products, addProduct, updateProduct, deleteProduct } = useCrud();
  const [image, setImage] = useState<any>(undefined);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
  });
  const [isVisible, setVisible] = useState(false);

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

  return (
    <ScrollView contentContainerStyle={menuStyles.scrollContainer}>
      <Text style={menuStyles.headerText}>Add New Product</Text>

      {/* Form to add product */}
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

        <TouchableOpacity style={menuStyles.button} onPress={handleAddProduct}>
          <Text style={menuStyles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for camera */}
      <CameraModal isVisible={isVisible} setImage={setImage} closeModal={closeModal} />

      {/* Display the existing products */}
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