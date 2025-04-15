// ===============================================================
// Archivo: caja/index
// Propósito: Pantalla principal del Cajero. Muestra las órdenes en 
// tiempo real, permite filtrar por estado y procesar el pago de una 
// orden mediante un Modal de confirmación. También permite cambiar 
// entre la vista de órdenes y la del inventario mediante la navegación.
// ===============================================================

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
// Importa funciones para escuchar datos en tiempo real de Firestore
import { collection, query, onSnapshot } from 'firebase/firestore';
// Configuración de Firestore
import { db } from '../../utils/FireBaseConfig';
// Uso del contexto de autenticación para obtener el email del usuario
import { AuthContext } from '../../context/AuthContext';
// Hook para navegación con Expo Router
import { useRouter } from 'expo-router';
// Uso del contexto de cuenta para funciones específicas, como marcar órdenes pagadas
import { useAccount } from '../../context/AccountContext';
// Importación de estilos para la sección de caja y para los modales
import { cajeroStyles, modalStyles } from '../../Styles/caja/index';
// Importación de colores predefinidos
import Colors from "../../assets/colors";

// Lista de estados disponibles para las órdenes (incluye "pagado")
const ESTADOS_CAJERO = ['todos', 'pendiente', 'preparando', 'entregado', 'pagado'];

// Asocia a cada estado un color, el cual se utilizará para los botones de la UI
const ESTADO_COLORES_CAJERO: any = {
  pendiente: '#f4a261',
  preparando: '#2a9d8f',
  entregado: '#264653',
  pagado: '#1d3557',
};

const Cajero = () => {
  // Se obtiene el email del usuario mediante AuthContext
  const { email } = useContext(AuthContext);
  // Estado para almacenar el nombre de usuario, extraído del email
  const [username, setUsername] = useState('');
  // Estado para almacenar la lista de órdenes
  const [orders, setOrders] = useState<any[]>([]);
  // Estado para almacenar la orden seleccionada (para ver detalle)
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  // Estado que guarda el filtro actual ("todos" por defecto)
  const [filter, setFilter] = useState('todos');
  // Hook de navegación
  const router = useRouter();
  // Función del contexto de cuenta para marcar una orden como pagada
  const { markOrderAsPaid } = useAccount();

  // Estados para manejar el Modal de confirmación del pago
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTotal, setConfirmTotal] = useState(0);
  const [orderToPay, setOrderToPay] = useState<any>(null);

  // useRef para asegurar que el componente esté montado al actualizar datos
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Extrae el nombre del usuario a partir del email
  useEffect(() => {
    if (email) {
      const user = email.split('@')[0];
      setUsername(user);
    }
  }, [email]);

  // Listener en tiempo real: se escuchan todas las órdenes de Firestore
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (isMounted.current) {
          // Se mapean los documentos para incluir su id y datos
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

  // Función para calcular el subtotal, impuestos (10%) y total de una orden
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

  // Función para iniciar el proceso de pago de una orden
  const handlePay = (order: any) => {
    const { total } = calculateTotals(order);
    setConfirmTotal(total);
    setOrderToPay(order);
    setConfirmVisible(true);
  };

  // Filtra las órdenes según el estado seleccionado (o muestra todas si el filtro es "todos")
  const filteredOrders = filter === 'todos'
    ? orders
    : orders.filter((o) => o.orderStatus === filter);

  // Renderiza una tarjeta para cada orden de la lista filtrada
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

  // Renderiza el detalle de una orden seleccionada, incluyendo la lista de ítems y totales
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
        {/* Sección de totales */}
        <View style={cajeroStyles.totalsContainer}>
          <Text style={cajeroStyles.totalText}>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text style={cajeroStyles.totalText}>Taxes (10%): ${tax.toFixed(2)}</Text>
          <Text style={[cajeroStyles.totalText, { fontWeight: 'bold' }]}>
            Total: ${total.toFixed(2)}
          </Text>
        </View>
        {/* Botones para confirmar pago o volver al listado */}
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

  // Función para procesar el pago de una orden
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
      {/* Header con saludo y notificaciones */}
      <View style={cajeroStyles.header}>
        <View>
          <Text style={cajeroStyles.greeting}>Hello! {username}</Text>
          <Text style={cajeroStyles.role}>Cajero</Text>
        </View>
        <Image source={require('../../assets/images/campana.png')} style={cajeroStyles.icon} />
      </View>

      {/* Si no se ha seleccionado una orden, se muestran los filtros */}
      {!selectedOrder && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={cajeroStyles.filtersContainer}
        >
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
        </ScrollView>
      )}

      {/* Renderizado condicional: si se ha seleccionado una orden se muestra el detalle, sino se muestra la lista */}
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

      {/* Footer con botones de navegación */}
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
