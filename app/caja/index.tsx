// app/cajero/index.tsx
import React, { useEffect, useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import cajeroStyles from '../../Styles/caja/index';

const Cajero = () => {
  const { userType } = useContext(AuthContext);
  const [role, setRole] = useState('');

  useEffect(() => {
    if (userType === 'cajero') {
      setRole('Cajero');
    }
  }, [userType]);

  return (
    <View style={cajeroStyles.container}>
      <Text style={cajeroStyles.text}>Bienvenido, {role}</Text>
    </View>
  );
};

export default Cajero;
