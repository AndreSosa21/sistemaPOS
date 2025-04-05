// CameraModal.tsx

import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // Correct import for react-native-camera
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from "react";

interface CameraModalProps {
  isVisible: boolean;
  setImage: (image: any) => void; // Function to update the image state in AdminMenu
  closeModal: () => void; // Function to close the modal
}

export function CameraModal(props: CameraModalProps) {
  const { isVisible, setImage, closeModal } = props;
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const flip = async () => {
    setFacing(facing === 'back' ? 'front' : 'back');
  };

  const take = async () => {
    let result = await cameraRef.current?.takePictureAsync({
      quality: 1,
      base64: true,
    });

    if (result && result.uri) {
      setImage(result);  // Update the image in the parent component
      closeModal();  // Close the modal after taking the picture
    }
  };

  const open = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0]);  // Update the image in the parent component
      closeModal();  // Close the modal after selecting an image
    }
  };

  if (!permission) {
    return <View />;
  }

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
