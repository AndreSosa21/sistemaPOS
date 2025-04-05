// context/CrudContext.tsx

import React, { createContext, useState, useContext, useEffect } from "react";
import { db, storage } from "../utils/FireBaseConfig"; // Asegúrate de tener configurado Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore";

interface Product {
  id?: string;  // id es opcional al agregar el producto
  title: string;
  price: string;
  description: string;
  imageUrl?: string;
}

interface CrudContextType {
  products: Product[];
  addProduct: (product: Product, image: any) => void;
  updateProduct: (productId: string, updatedProduct: Product, image: any) => void;
  deleteProduct: (productId: string) => void;
}

const CrudContext = createContext<CrudContextType | undefined>(undefined);

export const CrudProvider = ({ children }: any) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  const addProduct = async (product: Product, image: any) => {
    try {
      let imageUrl = "";
      if (image) {
        // Convertir la imagen a Blob
        const response = await fetch(image.uri);
        const blob = await response.blob();

        // Determinar el tipo MIME de la imagen
        const mimeType = blob.type;
        if (mimeType.startsWith('image/')) {
          const storageRef = ref(storage, `images/products/${product.title}`);
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            "state_changed",
            () => {},
            (error) => {
              console.error(error);
            },
            async () => {
              // Obtener la URL de la imagen subida
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              const docRef = await addDoc(collection(db, "products"), {
                title: product.title,
                price: product.price,
                description: product.description,
                imageUrl: imageUrl,
              });
              setProducts((prev) => [...prev, { ...product, id: docRef.id, imageUrl }]);
            }
          );
        } else {
          throw new Error("El archivo seleccionado no es una imagen válida");
        }
      } else {
        // Si no hay imagen, agregar el producto sin la imagen
        const docRef = await addDoc(collection(db, "products"), {
          title: product.title,
          price: product.price,
          description: product.description,
        });
        setProducts((prev) => [...prev, { ...product, id: docRef.id }]);
      }
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const updateProduct = async (productId: string, updatedProduct: Product, image: any) => {
    try {
      let imageUrl = updatedProduct.imageUrl;
      if (image) {
        // Convertir la imagen a Blob
        const response = await fetch(image.uri);
        const blob = await response.blob();

        // Determinar el tipo MIME de la imagen
        const mimeType = blob.type;
        if (mimeType.startsWith('image/')) {
          const storageRef = ref(storage, `images/products/${updatedProduct.title}`);
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            "state_changed",
            () => {},
            (error) => {
              console.error(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              await updateDoc(doc(db, "products", productId), {
                ...updatedProduct,
                imageUrl: imageUrl,
              });
              setProducts((prev) => prev.map(product => product.id === productId ? { ...product, ...updatedProduct, imageUrl } : product));
            }
          );
        } else {
          throw new Error("El archivo seleccionado no es una imagen válida");
        }
      } else {
        await updateDoc(doc(db, "products", productId), {
          title: updatedProduct.title,
          price: updatedProduct.price,
          description: updatedProduct.description,
          imageUrl: updatedProduct.imageUrl,
        });
        setProducts((prev) => prev.map(product => product.id === productId ? { ...product, ...updatedProduct } : product));
      }
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <CrudContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </CrudContext.Provider>
  );
};

export const useCrud = () => {
  const context = useContext(CrudContext);
  if (!context) {
    throw new Error("useCrud must be used within a CrudProvider");
  }
  return context;
};
