// app/mesero/index.tsx
import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { meseroStyles } from '../../Styles/mesero/index';
import { useRouter } from 'expo-router';

const Mesero = () => {
  const { userType } = useContext(AuthContext);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (userType === 'mesero') {
      setRole('Mesero');
    }
  }, [userType]);

  const handleTablePress = (tableNumber: string) => {
    router.push({ pathname: '/mesero/TableOrdersScreen', params: { table: tableNumber } });
  };

  const handleNavigation = (screen: string) => {
    if (screen === 'orders') {
      router.push('/mesero/OrdersScreen');
    } else if (screen === 'profile') {
      router.push('/mesero/ProfileScreen');
    } else if (screen === 'logout') {
      router.push('/login');
    }
  };

  return (
    <View style={meseroStyles.container}>
      {/* Header */}
      <View style={meseroStyles.header}>
        <View>
          <Text style={meseroStyles.text}>Hello ! Andrea</Text>
          <Text style={meseroStyles.roleText}>{role}</Text>
        </View>
        <Image
          source={require('../../assets/images/campana.png')}
          style={meseroStyles.footerIcon}
        />
      </View>

      {/* Status legend */}
      <View style={meseroStyles.statusIndicators}>
        <View style={meseroStyles.dotLabel}>
          <View style={[meseroStyles.dot, { backgroundColor: '#409744' }]} />
          <Text>Available</Text>
        </View>
        <View style={meseroStyles.dotLabel}>
          <View style={[meseroStyles.dot, { backgroundColor: '#BA3A3A' }]} />
          <Text>Occupied</Text>
        </View>
      </View>

      {/* Table grid */}
      <ScrollView contentContainerStyle={meseroStyles.tableGrid}>
        {['T-1', 'T-2', 'T-3', 'T-4', 'T-5', 'T-6'].map((table) => (
          <TouchableOpacity
            key={table}
            style={meseroStyles.table}
            onPress={() => handleTablePress(table)}
          >
            <Text style={meseroStyles.tableText}>{table}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={meseroStyles.footer}>
        <TouchableOpacity onPress={() => router.push('/mesero')}>
          <Image
            source={require('../../assets/images/home.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('orders')}>
          <Image
            source={require('../../assets/images/order.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('profile')}>
          <Image
            source={require('../../assets/images/persona.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('logout')}>
          <Image
            source={require('../../assets/images/out.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Mesero;
