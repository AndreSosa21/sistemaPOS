// app/chef/index.tsx
import React, { useEffect, useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import chefStyles from '../../Styles/chef/index';

const Chef = () => {
  const { userType } = useContext(AuthContext);
  const [role, setRole] = useState('');

  useEffect(() => {
    if (userType === 'mesero') {
      setRole('Mesero');
    }
  }, [userType]);

  return (
    <View style={chefStyles.container}>
      <Text style={chefStyles.text}>Bienvenido, {role}</Text>
    </View>
  );
};

export default Chef;
