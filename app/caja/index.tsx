import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import cajeroStyles from '../../Styles/caja/index';

const Cajero = () => {
  const { userType, email } = useContext(AuthContext);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (userType === 'cajero') {
      setRole('Cajero');
    }

    if (email) {
      const user = email.split('@')[0];
      setUsername(user);
    }
  }, [userType, email]);

  return (
    <View style={cajeroStyles.container}>
      {/* Header */}
      <View style={cajeroStyles.header}>
        <View>
          <Text style={cajeroStyles.greeting}>Hello ! {username}</Text>
          <Text style={cajeroStyles.role}>cajero</Text>
        </View>
        <Image source={require('../../assets/images/campana.png')} style={cajeroStyles.icon} />
      </View>

      {/* Body */}
      <View style={cajeroStyles.body}>
        <View style={cajeroStyles.orderTitleContainer}>
          <Text style={cajeroStyles.title}>Ordenes</Text>
          <Image source={require('../../assets/images/orden.png')} style={cajeroStyles.iconSmall} />
        </View>
      </View>

      {/* Footer */}
      <View style={cajeroStyles.footer}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/inventario.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../assets/images/home.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../assets/images/out.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cajero;
