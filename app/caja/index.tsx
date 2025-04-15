import React, { useEffect, useState, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  Modal 
} from 'react-native';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/FireBaseConfig';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useAccount } from '../../context/AccountContext';
import { cajeroStyles, modalStyles } from '../../Styles/caja/index';
import Colors from "../../assets/colors";


// Lista de estados para Cajero (incluye "pagado")
const ESTADOS_CAJERO = ['todos', 'pendiente', 'preparando', 'entregado', 'pagado'];

const ESTADO_COLORES_CAJERO: any = {
  pendiente: '#f4a261',
  preparando: '#2a9d8f',
  entregado: '#264653',
  pagado: '#1d3557',
};

const Cajero = () => {
  const { email } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState('todos');
  const router = useRouter();
  const { markOrderAsPaid } = useAccount();

  // Estados para el modal de confirmación
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTotal, setConfirmTotal] = useState(0);
  const [orderToPay, setOrderToPay] = useState<any>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (email) {
      const user = email.split('@')[0];
      setUsername(user);
    }
  }, [email]);

  // Escucha en tiempo real TODAS las órdenes
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (isMounted.current) {
          const ordersData = snapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }));
          setOrders(ordersData);
        }
      },
      (error) => {
        console.error('[Cajero] Error al obtener las órdenes:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const calculateTotals = (order: any) => {
    const subtotal = order.items?.reduce(
      (sum: number, item: any) =>
        sum + parseFloat(item.price) * (item.quantity || 1),
      0
    ) || 0;
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handlePay = (order: any) => {
    const { total } = calculateTotals(order);
    setConfirmTotal(total);
    setOrderToPay(order);
    setConfirmVisible(true);
  };

  // Filtrar según el estado seleccionado
  const filteredOrders = filter === 'todos'
    ? orders
    : orders.filter((o) => o.orderStatus === filter);

  const renderOrderCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        cajeroStyles.orderCard,
        { borderLeftColor: ESTADO_COLORES_CAJERO[item.orderStatus] || '#ccc' },
      ]}
      onPress={() => setSelectedOrder(item)}
    >
      <Text style={cajeroStyles.orderCardText}>Mesa: {item.table}</Text>
      <Text style={cajeroStyles.orderCardText}>Estado: {item.orderStatus}</Text>
      <Text style={cajeroStyles.orderCardText}>Platos: {item.items?.length || 0}</Text>
    </TouchableOpacity>
  );

  const renderOrderDetail = () => {
    const { subtotal, tax, total } = calculateTotals(selectedOrder);
    return (
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={cajeroStyles.detailTitle}>
          Detalle de la Orden - Mesa {selectedOrder.table}
        </Text>
        {selectedOrder.items?.map((item: any, index: number) => (
          <View key={index} style={cajeroStyles.detailItem}>
            <Text style={cajeroStyles.detailItemText}>{item.title}</Text>
            <Text style={cajeroStyles.detailItemText}>Cantidad: {item.quantity || 1}</Text>
            <Text style={cajeroStyles.detailItemText}>
              Precio: ${parseFloat(item.price).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={cajeroStyles.totalsContainer}>
          <Text style={cajeroStyles.totalText}>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text style={cajeroStyles.totalText}>Taxes (10%): ${tax.toFixed(2)}</Text>
          <Text style={[cajeroStyles.totalText, { fontWeight: 'bold' }]}>
            Total: ${total.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={cajeroStyles.payButton}
          onPress={() => handlePay(selectedOrder)}
        >
          <Text style={cajeroStyles.payButtonText}>PAGAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={cajeroStyles.backButton}
          onPress={() => setSelectedOrder(null)}
        >
          <Text style={cajeroStyles.backButtonText}>Volver al listado</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const processPayment = async () => {
    if (!orderToPay) return;
    try {
      await markOrderAsPaid(orderToPay.id);
      setConfirmVisible(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('[Cajero] Error al procesar el pago:', error);
      setConfirmVisible(false);
    }
  };

  return (
    <View style={cajeroStyles.container}>
      <View style={cajeroStyles.header}>
        <View>
          <Text style={cajeroStyles.greeting}>Hello! {username}</Text>
          <Text style={cajeroStyles.role}>Cajero</Text>
        </View>
        <Image source={require('../../assets/images/campana.png')} style={cajeroStyles.icon} />
      </View>

      {/* Filtros de órdenes */}
      {!selectedOrder && (
        <View style={cajeroStyles.filtersContainer}>
          {ESTADOS_CAJERO.map((estado) => (
            <TouchableOpacity
              key={estado}
              onPress={() => setFilter(estado)}
              style={[
                cajeroStyles.filterButton,
                {
                  backgroundColor:
                    filter === estado ? (ESTADO_COLORES_CAJERO[estado] || Colors.primary) : Colors.tableInactive,
                },
              ]}
            >
              <Text style={cajeroStyles.filterButtonText}>
                {estado.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedOrder ? (
        renderOrderDetail()
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={{ padding: 10 }}
        />
      )}

      <Modal visible={confirmVisible} animationType="fade" transparent>
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>Confirmar Pago</Text>
            <Text style={modalStyles.modalMessage}>
              ¿Desea confirmar el pago de ${confirmTotal.toFixed(2)}?
            </Text>
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.confirmButton]}
                onPress={processPayment}
              >
                <Text style={modalStyles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={cajeroStyles.footer}>
        <TouchableOpacity onPress={() => router.push('/caja/Inventory')}>
          <Image source={require('../../assets/images/inventario.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/caja')}>
          <Image source={require('../../assets/images/home.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Image source={require('../../assets/images/out.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cajero;
