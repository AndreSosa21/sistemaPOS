// CameraModal.tsx

import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // Correct import for react-native-camera
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from "react";

// Interfaz para las propiedades del componente CameraModal
interface CameraModalProps {
  isVisible: boolean;
  setImage: (image: any) => void; // Función para actualizar la imagen en el componente padre (por ejemplo, AdminMenu)
  closeModal: () => void; // Función para cerrar el modal
}

// Componente CameraModal
export function CameraModal(props: CameraModalProps) {
  // Se extraen las propiedades pasadas al componente
  const { isVisible, setImage, closeModal } = props;
  // Estado que guarda el tipo de cámara (back o front)
  const [facing, setFacing] = useState<CameraType>('back');
  // Se solicitan los permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();
  // Referencia para acceder al componente CameraView
  const cameraRef = useRef<CameraView | null>(null);

  // Función para cambiar el tipo de cámara (flip)
  const flip = async () => {
    setFacing(facing === 'back' ? 'front' : 'back');
  };

  // Función para tomar una foto con la cámara
  const take = async () => {
    let result = await cameraRef.current?.takePictureAsync({
      quality: 1,
      base64: true,
    });

    if (result && result.uri) {
      setImage(result);  // Actualiza la imagen en el componente padre
      closeModal();  // Cierra el modal después de tomar la foto
    }
  };

  // Función para abrir la biblioteca de imágenes y seleccionar una imagen
  const open = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Si la selección no fue cancelada y hay imágenes disponibles, actualiza la imagen y cierra el modal
    if (!result.canceled && result.assets) {
      setImage(result.assets[0]);
      closeModal();
    }
  };

  // Si no se ha obtenido permiso, muestra una vista vacía
  if (!permission) {
    return <View />;
  }

  // Si no se han concedido los permisos, se muestra un mensaje y un botón para solicitarlos
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderiza el Modal con la cámara y tres botones: tomar foto, abrir galería, cambiar cámara
  return (
    <Modal visible={isVisible} transparent={false} animationType="slide">
      <View style={{ flex: 1 }}>
        <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 30, width: '100%' }}>
            <TouchableOpacity onPress={take} style={{ backgroundColor: 'lightblue', padding: 10 }}>
              <Text>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={open} style={{ backgroundColor: 'lightgreen', padding: 10 }}>
              <Text>Open Library</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={flip} style={{ backgroundColor: 'lightcoral', padding: 10 }}>
              <Text>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}
