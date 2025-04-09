import React, { useEffect, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { meseroStyles } from '../../Styles/mesero/index';
import { useRouter } from 'expo-router';
import { useTable } from '../../context/TablesContext';

const Mesero = () => {
  const { userType } = useContext(AuthContext);
  const [role, setRole] = useState('');
  const router = useRouter();
  const { tables } = useTable();

  useEffect(() => {
    if (userType === 'mesero') {
      setRole('Mesero');
    }
  }, [userType]);

  // Al presionar una mesa, se navega solo si la mesa está ocupada;
  // si la mesa está disponible se muestra una alerta.
  const handleTablePress = (tableName: string, status: string) => {
    if (status === 'Occupied') {
      router.push(`/mesero/TableOrdersScreen?table=${tableName}`);
    } else {
      Alert.alert('Mesa Disponible', 'La mesa seleccionada se encuentra libre y no tiene órdenes asignadas.');
    }
  };

  const handleNavigation = (screen: string) => {
    if (screen === 'orders') {
      router.push('/mesero/OrdersScreen');
    } else if (screen === 'profile') {
      router.push('/mesero');
    } else if (screen === 'logout') {
      router.push('/login');
    }
  };

  return (
    <View style={meseroStyles.container}>
      {/* Header */}
      <View style={meseroStyles.header}>
        <View>
          <Text style={meseroStyles.text}>Hello! Andrea</Text>
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
        {tables.map((table) => (
          <TouchableOpacity
            key={table.name}
            style={[
              meseroStyles.table,
              {
                backgroundColor:
                  table.status === 'Available' ? '#409744' : '#BA3A3A',
              },
            ]}
            onPress={() => handleTablePress(table.name, table.status)}
          >
            <Text style={meseroStyles.tableText}>{table.name}</Text>
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
