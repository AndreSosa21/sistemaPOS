import { View, Text, Modal, TouchableOpacity, Button } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // Correct import for react-native-camera
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from "react";
import { FieldPath } from "firebase/firestore";

interface CameraModalProps{
    isVisible: boolean;
    image ?: any;
    
}  
export function CameraModal(props: CameraModalProps) {

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const flip = async () =>{
    setFacing(facing =='back' ? 'front': 'back')


  }
  const take = async () =>{
    let result = cameraRef.current?.takePictureAsync({
      quality: 1,
      base64 :true
    });
    if(result){

    }
    
  }
  const open = async () =>{
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      
    }
   
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{
          flex:1
      }}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  
  return (
	<Modal
    visible={props.isVisible}
    >
    <View
    style={{ 
        flex: 1

     }}
    >
      <CameraView style= {{
        flex: 1
      }}
        facing={facing}
        ref ={cameraRef}
      >
        <View style={{
            flexDirection: "row",

        }}>
          
          <TouchableOpacity
            onPress={take}
          >
            <Text> Take a photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={open}
          >
          <Text> Open library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={flip}
          >
            <Text> flip camera </Text>
          </TouchableOpacity>

        </View>
        
      </CameraView>

    </View>
	</Modal>
  );
}