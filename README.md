# Welcome to POSitive 🚀

Bienvenido a **POSitive**, una aplicación desarrollada con [Expo](https://expo.dev) que integra **Firebase** para la autenticación, manejo de roles y operaciones CRUD. Este proyecto utiliza **Expo Router** para la navegación basada en archivos, y se apoya en múltiples contextos para gestionar la autenticación, productos, órdenes, mesas, y cuentas.

---

## 🗂️ Estructura del Proyecto

La estructura principal de la aplicación es la siguiente:

```bash
project/
├── app/                   # Contiene las pantallas y rutas de la app
│   ├── _layout.tsx        # Layout global y providers para la app
│   ├── index.tsx          # Pantalla de splash (ActivityIndicator)
│   ├── login.tsx          # Pantalla de inicio de sesión
│   ├── register.tsx       # Pantalla de registro
│   ├── mesero/            # Pantalla para el rol de mesero
│   ├── chef/              # Pantalla para el rol de chef
│   ├── cajero/            # Pantalla para el rol de cajero
│   └── admin/             # Pantalla para el rol de administrador
├── context/               # Contextos de la aplicación
│   ├── AuthContext.tsx    # Manejo de autenticación y roles
│   ├── CrudContext.tsx    # Operaciones CRUD para productos
│   ├── AccountContext.tsx # Gestión de pagos, inventario y mesas
│   ├── OrdersContext.tsx  # Gestión de órdenes (carrito, pedido, selección de mesa)
│   └── TablesContext.tsx  # Gestión y actualización de mesas
├── Styles/                # Carpeta de estilos (aquí se encuentran todos los archivos de estilos CSS/TS)
├── utils/                 # Utilidades, incluida la configuración de Firebase
│   └── FireBaseConfig.ts  # Configuración de Firebase (auth, db, storage)
├── assets/                # Imágenes, íconos y otros recursos multimedia
└── package.json           # Dependencias y scripts del proyecto

```

---

## ⚙️ Tecnologías Utilizadas

- **[Expo](https://expo.dev/)** para el desarrollo multiplataforma.  
- **[Firebase](https://firebase.google.com/)**:  
  - **Firestore** para la base de datos en tiempo real.  
  - **Firebase Authentication** para la autenticación de usuarios.  
  - **Firebase Storage** para la gestión y carga de imágenes.  
- **Expo Router** para la navegación basada en archivos.  
- **React Context** para la gestión global:
  - **AuthContext**: Maneja autenticación y redirección según el rol (mesero, chef, cajero, admin).
  - **CrudContext**: Provee operaciones CRUD para productos.
  - **AccountContext**: Gestiona pagos, movimientos de órdenes al inventario y liberación de mesas.
  - **OrdersContext**: Maneja el carrito de pedidos y la confirmación de órdenes.
  - **TablesContext**: Controla el estado de las mesas y su actualización en tiempo real.

---

## 📸 Estilos

Todos los estilos de la aplicación se encuentran en la carpeta **Styles**.  
Aquí se definen los estilos para cada pantalla, componente y modal, garantizando una apariencia consistente en toda la app.

---

## 🏃‍♂️ Cómo Empezar

Sigue estos pasos para poner en marcha el proyecto:

1. **Instalar dependencias**

   ```bash
   npm install

2. **Iniciar la aplicación**

   ```bash
   npx expo start

## En la terminal verás opciones para:

- Abrir la app en un simulador de Android
- Abrir la app en un simulador de iOS
- Usar Expo Go para pruebas en dispositivos físicos

**Desarrollo y rutas**

Comienza a desarrollar editando los archivos dentro de la carpeta **app/**.  
La aplicación utiliza file-based routing para gestionar las rutas de forma sencilla.

Esto moverá el código de inicio a la carpeta **app-example** y creará una nueva carpeta **app** limpia para comenzar a desarrollar.

💡 **Recursos y Comunidad**

- **Documentación de Expo:**
  - [Expo Documentation](https://docs.expo.dev/)
  - [Guías de Expo](https://docs.expo.dev/guides)

- **Tutorial de Expo:**
  - [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)

- **Repositorio de Expo en GitHub:**
  - [Expo on GitHub](https://github.com/expo/expo)

- **Comunidad en Discord:**
  - [Expo Discord Community](https://chat.expo.dev)

📚 **Explicación Adicional**

- **Autenticación y Roles:**  
  La app maneja diferentes tipos de usuarios (mesero, chef, cajero, admin).  
  El `AuthContext` se encarga de gestionar el inicio y cierre de sesión, redirigiendo a la ruta correspondiente según el rol del usuario.

- **CRUD de Productos:**  
  Implementado en el `CrudContext`, permite agregar, actualizar y eliminar productos, incluyendo la subida de imágenes a Firebase Storage.

- **Gestión de Órdenes y Mesas:**  
  Los contextos `OrdersContext`, `AccountContext` y `TablesContext` se encargan de:
  - Administrar el carrito de pedidos y confirmar órdenes.
  - Procesar pagos, mover órdenes al inventario y liberar mesas.
  - Actualizar en tiempo real el estado de las mesas (Available/Occupied).

- **Estilos y UI:**  
  Todos los estilos están centralizados en la carpeta **Styles**, que contiene todos los archivos de estilos para que la interfaz se mantenga consistente en todas las pantallas y componentes.
