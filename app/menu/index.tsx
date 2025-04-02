import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { CameraModal } from "@/components/CameraModal";
export default function Menu() {

const [image, setImage] = useState(undefined as any);
const [isVisible, setVisible] = useState(false); 


  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        }}>
      <Text>Menu</Text>
      {/* select image*/}
      {
        image ? <View>
            {/* image preview */}

        </View>
         : 
         <TouchableOpacity onPress={() => setVisible(true)}>
            <Text>Select Image</Text>
        </TouchableOpacity>
      }
      <View>

      </View>
      {/* title*/}
      <TextInput/>
      {/* price*/}
      <TextInput/>
      {/* description*/}
      <TextInput/>
     
      {/* edit*/}
      {/* delete*/}
      {/* save*/}
      <CameraModal
        isVisible={isVisible}
        image={image}
       /> 
     
    </View>
  );
}