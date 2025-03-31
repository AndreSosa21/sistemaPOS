// app/mesero/index.tsx
import React, { useEffect, useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import meseroStyles from '../../Styles/mesero/index';

const Mesero = () => {
  const { userType } = useContext(AuthContext);
  const [role, setRole] = useState('');

  useEffect(() => {
    if (userType === 'mesero') {
      setRole('Mesero');
    }
  }, [userType]);

  return (
    <View style={meseroStyles.container}>
      <Text style={meseroStyles.text}>Bienvenido, {role}</Text>
    </View>
  );
};

export default Mesero;
