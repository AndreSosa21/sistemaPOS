import { View,Text, Modal } from "react-native";
import React from "react";

interface CameraModalProps{
    isVisible: boolean;
    image ?: any;
    
}  
export function CameraModal(props: CameraModalProps) {
  
  return (
	<Modal
    visible={props.isVisible}
    >
    <View
    style={{ 
        flex: 1

     }}
    ></View>
	</Modal>
  );
}