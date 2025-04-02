// app/admin/index.tsx
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import { CameraModal } from "../../components/CameraModal";
import { useCrud } from "../../context/CrudContext";
import styles from "../../Styles/admin";

export default function AdminMenu() {
  const { products, addProduct, updateProduct, deleteProduct } = useCrud();
  const [image, setImage] = useState(undefined as any);
  const [isVisible, setVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
  });

  const handleAddProduct = () => {
    // Agrega el producto sin el id, Firestore generará el id automáticamente
    addProduct(newProduct, image);
    setNewProduct({ title: "", price: "", description: "" });
    setImage(undefined);
  };

  const handleUpdateProduct = (id: string | undefined) => {
    if (id) {
      // Solo llamamos a update si el id no es undefined
      updateProduct(id, newProduct, image);
      setNewProduct({ title: "", price: "", description: "" });
      setImage(undefined);
    }
  };

  const handleDeleteProduct = (id: string | undefined) => {
    if (id) {
      // Solo llamamos a delete si el id no es undefined
      deleteProduct(id);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Product Management</Text>
      
      {/* Product Form */}
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
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={newProduct.description}
        onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
      />
      
      {/* Select Image Button */}
      {image ? (
        <View>
          {/* image preview */}
        </View>
      ) : (
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Text>Select Image</Text>
        </TouchableOpacity>
      )}

      {/* Add, Update, Delete Buttons */}
      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.price}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity onPress={() => handleUpdateProduct(item.id)}>
              <Text>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Camera Modal */}
      <CameraModal isVisible={isVisible} image={image} />
    </View>
  );
}
