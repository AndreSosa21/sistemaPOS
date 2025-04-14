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
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/FireBaseConfig';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useAccount } from '../../context/AccountContext';
import { cajeroStyles, modalStyles } from '../../Styles/caja/index';

const Cajero = () => {
  const { email } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
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

  // Escucha en tiempo real los pedidos con estado "entregado"
  useEffect(() => {
    if (!selectedOrder) {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('orderStatus', '==', 'entregado'));
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
          console.error('[Cajero] Error al obtener las órdenes entregadas:', error);
        }
      );
      return () => unsubscribe();
    }
  }, [selectedOrder]);

  // Calcula subtotal, impuesto (10%) y total de la orden
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

  // Abre el modal de confirmación y almacena la orden y total a pagar
  const handlePay = (order: any) => {
    const { total } = calculateTotals(order);
    setConfirmTotal(total);
    setOrderToPay(order);
    setConfirmVisible(true);
  };

  // Renderiza la tarjeta de cada pedido en el listado
  const renderOrderCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={cajeroStyles.orderCard} 
      onPress={() => setSelectedOrder(item)}
    >
      <Text style={cajeroStyles.orderCardText}>Mesa: {item.table}</Text>
      <Text style={cajeroStyles.orderCardText}>Platos: {item.items?.length || 0}</Text>
    </TouchableOpacity>
  );

  // Vista de detalle de la orden seleccionada
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

  // Función que procesa la orden al confirmar el pago en el modal
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
      {selectedOrder ? (
        renderOrderDetail()
      ) : (
        <View style={cajeroStyles.body}>
          <View style={cajeroStyles.orderTitleContainer}>
            <Text style={cajeroStyles.title}>Órdenes Entregadas</Text>
            <Image source={require('../../assets/images/orden.png')} style={cajeroStyles.iconSmall} />
          </View>
          {orders.length === 0 ? (
            <Text style={{ marginTop: 20 }}>No hay órdenes entregadas</Text>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={renderOrderCard}
              contentContainerStyle={{ paddingVertical: 10 }}
            />
          )}
        </View>
      )}

      {/* Modal de confirmación de pago */}
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
        {/* Botón de Inventario: Redirige a /caja/Inventory */}
        <TouchableOpacity onPress={() => router.push('/caja/Inventory')}>
          <Image source={require('../../assets/images/inventario.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
        {/* Botón de Home */}
        <TouchableOpacity onPress={() => router.push('/caja')}>
          <Image source={require('../../assets/images/home.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
        {/* Botón de Salida */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Image source={require('../../assets/images/out.png')} style={cajeroStyles.iconFooter} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cajero;
