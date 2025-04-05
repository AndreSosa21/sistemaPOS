// AdminMenu.tsx

import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useState } from "react";
import { CameraModal } from "../../components/CameraModal";
import { useCrud } from "../../context/CrudContext";
import styles from "../../Styles/admin";

export default function AdminMenu() {
  const { products, addProduct, updateProduct, deleteProduct } = useCrud();
  const [image, setImage] = useState<any>(undefined);
  const [isVisible, setVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
  });

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
    setVisible(false);  // Close the camera modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Management</Text>
      
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

      <FlatList
        data={products}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productText}>{item.title}</Text>
            <Text style={styles.productText}>{item.price}</Text>
            <Text style={styles.productText}>{item.description}</Text>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
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
      />

      {/* Camera Modal */}
      <CameraModal isVisible={isVisible} setImage={setImage} closeModal={closeModal} />
    </View>
  );
}
