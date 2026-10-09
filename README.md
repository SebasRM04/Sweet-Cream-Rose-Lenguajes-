# Proyecto_INTEGRADOR_V2
# 🎂 Proyecto Integrador — Sweet Cream Rose / SweetCreamPink
**Alcance académico:** el sistema se centra en el **proceso de Ventas** (catálogo, carrito, cobro, registro y seguimiento comercial del pedido). No incluye despacho operativo ni inventario de insumos (personal, turnos, preparación en cocina, ruta de entrega).

---

## 📋 Resumen General

| Aspecto | Detalle |
|---|---|
| **Nombre del proyecto** | Sweet Cream Rose (también mencionado como Sweet Kiss / SweetCreamPink) |
| **Backend** | Java 17 + Spring Boot 3.4.1 |
| **Frontend** | React (Create React App) |
| **Base de datos** | MySQL 8.0.45 |
| **Seguridad** | JWT + Spring Security + BCrypt |
| **Build tool** | Maven |
| **Puerto backend** | 8080 (por defecto Spring Boot) |

---

## 🗂️ Estructura del Proyecto

```
Sweet-Cream-Rose/
├── demoSpringBoot/              ← Backend Spring Boot (Java 17)
│   ├── src/main/java/com/SweetCreamPink/demoSpringBoot/
│   │   ├── Configuracion/       ← Configuración general (CORS, etc.)
│   │   ├── Controlador/         ← Endpoints REST (@RestController)
│   │   ├── DAO/                 ← Capa DAO sobre los Repository (principio DIP)
│   │   ├── DTO/                 ← Objetos de transferencia de datos
│   │   ├── Modelo/               ← Entidades JPA (tablas de la BD)
│   │   ├── Repositorio/          ← Interfaces Spring Data JPA
│   │   ├── Seguridad/             ← JWT y configuración de Spring Security
│   │   └── service/               ← Lógica de negocio
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── logback-spring.xml
│   └── pom.xml                  ← Dependencias Maven
├── frontend-pink-sweet/         ← Frontend React
│   └── src/
│       ├── App.jsx              ← Componente raíz de la tienda pública
│       ├── index.js             ← Punto de entrada + enrutamiento (react-router-dom)
│       ├── api.js               ← Cliente HTTP centralizado hacia el backend
│       ├── components/          ← Componentes compartidos (Header, Footer)
│       ├── pages/
│       │   ├── auth/            ← Login, Registro, recuperación de contraseña
│       │   ├── tienda/          ← Inicio, Productos, Ofertas, Carrito, Recibo, Nosotros
│       │   ├── perfil/          ← Panel de perfil del cliente y sus pestañas
│       │   ├── admin/           ← Panel de administración de ventas (sin personal/horarios)
│       │   └── legal/           ← Términos, políticas, preguntas frecuentes
│       └── assets/              ← Imágenes del catálogo y la interfaz
├── monitoring/                  ← Configuración de Prometheus y Grafana (opcional)
├── docker-compose.yml
└── Reposteria.sql               ← Volcado completo de la base de datos
```

> El backend sigue una **arquitectura en capas**: `Controlador → service → DAO/Repositorio → Modelo`.
> No es MVC clásico (no hay vistas renderizadas en el servidor): el backend expone una API REST y el frontend React consume esa API como una SPA independiente.

---

## 🗄️ Base de Datos (`reposteria`)

### Tablas principales

| Tabla | Descripción |
|---|---|
| `usuario` | Clientes registrados (nombre, correo, contraseña BCrypt, teléfono, rol) |
| `rol` | Solo 2 valores: `Admin (1)` y `Cliente (2)` |
| `categoria` | 10 categorías: Cupcakes, Galletas, Tortas, Alfajores, Trufas, etc. |
| `producto` | Productos del catálogo, asociados a una categoría |
| `producto_variantes` | Sabores/tamaños de cada producto con precio adicional |
| `orden` | Pedidos del cliente: estado, dirección de entrega, método de pago, total |
| `detalles_orden` | Líneas de cada orden (producto, variante, cantidad, precio, subtotal) |
| `materia_prima` | Inventario de insumos (harina, azúcar, huevos, etc.) con stock |
| `receta_fija` | Cuánto insumo usa cada variante de producto |
| `insumos_personalizados_orden` | Insumos extra para pedidos personalizados |
| `productos` | Segunda tabla de catálogo con imagen binaria (tabla legacy) |
| `comentarios` | Reseñas de clientes con flag de aprobación |

### Triggers automáticos en MySQL

```sql
-- 1. tr_calculo_subtotal
-- Al insertar un detalle de orden, calcula automáticamente el subtotal
-- (cantidad × precio) sin que el backend lo tenga que hacer.
BEFORE INSERT ON detalles_orden
  SET NEW.detoSubTotal = NEW.detoCantidad * NEW.detoPrecio;

-- 2. tr_descuento_stock_estandar
-- Al confirmar un pedido estándar, descuenta del stock de materia_prima
-- usando la receta_fija de cada variante pedida.
AFTER INSERT ON detalles_orden
  UPDATE materia_prima ... JOIN receta_fija ...

-- 3. tr_actualizar_total_orden
-- Cada vez que se agrega un detalle, recalcula el total de la orden
-- sumando todos los subtotales.
AFTER INSERT ON detalles_orden
  UPDATE orden SET ordTotal = SUM(detoSubTotal) ...

-- 4. tr_reponer_stock_borrado
-- Si se borra un detalle de orden (cancelación), devuelve el stock
-- de materia prima que se había descontado.
AFTER DELETE ON detalles_orden
  UPDATE materia_prima ... (suma de vuelta)

-- 5. tr_descuento_stock_personalizado
-- Para pedidos personalizados, descuenta los insumos específicos
-- registrados en insumos_personalizados_orden.
AFTER INSERT ON insumos_personalizados_orden
  UPDATE materia_prima SET matStock = matStock - NEW.cantidad_usada
```

---

## ☕ Backend — Spring Boot

### Dependencias clave (`pom.xml`)

```xml
<!-- Spring Boot Core: servidor web, JPA, seguridad, validación y email -->
<dependency>spring-boot-starter-web</dependency>
<dependency>spring-boot-starter-data-jpa</dependency>
<dependency>spring-boot-starter-security</dependency>
<dependency>spring-boot-starter-validation</dependency>
<dependency>spring-boot-starter-mail</dependency>
<!-- Conecta con MySQL -->
<dependency>mysql-connector-j</dependency>
<!-- JWT para tokens de autenticación (versión 0.11.5) -->
<dependency>jjwt-api / jjwt-impl / jjwt-jackson</dependency>
<!-- Google Guava: utilidades de colecciones -->
<dependency>guava</dependency>
<!-- Apache Commons: utilidades de texto y validación -->
<dependency>commons-lang3 / commons-validator / commons-collections4</dependency>
<!-- Apache POI: exportar reportes a Excel (.xlsx) -->
<dependency>poi / poi-ooxml</dependency>
<!-- Lombok: genera getters/setters/constructores automáticamente -->
<dependency>lombok</dependency>
<!-- H2: base de datos en memoria solo para tests -->
<dependency>h2 (scope test)</dependency>
```

---

### 🔐 Seguridad — `SecurityConfig.java`

```java
/**
 * Configura toda la seguridad HTTP de la aplicación.
 * Conecta con: JwtAuthFilter (intercepta cada request) y
 * CustomUserDetailsService (carga el usuario desde la BD).
 *
 * Sin sesiones en servidor — usa JWT stateless.
 * CSRF desactivado porque el frontend es React (no forms HTML tradicionales).
 *
 * CORS: acepta solicitudes solo del origen configurado en application.properties
 * (variable cors.allowed-origins), típicamente http://localhost:3000.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // habilita @PreAuthorize en los controladores
public class SecurityConfig {

    // Rutas completamente públicas (sin token):
    //   POST /api/auth/registro, /login, /olvide-contrasena, /restablecer-contrasena
    //   POST /api/admin/auth/verificar-admin, /pin  ← login de 2 pasos del admin
    //   GET  /api/productos/**, /api/comentarios/aprobados/**, /api/ofertas/vigentes
    //   GET  /uploads/**  ← imágenes subidas

    // Solo ADMIN (rol=1):
    //   /api/admin/**
    //   DELETE/POST/PUT /api/productos/**
    //   PUT /api/comentarios/*/aprobar

    // CLIENTE o ADMIN autenticados (con JWT válido):
    //   /api/perfil/**, /api/direcciones/**, /api/metodos-pago/**
    //   /api/ordenes/**, POST /api/comentarios/**

    // Contraseñas hasheadas con BCrypt (sin texto plano en ningún momento)
    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
```

---

### 🔑 Seguridad JWT — `Security/`

```java
// ── JwtUtil.java ──────────────────────────────────────────────
// Genera y valida tokens JWT.
// La clave secreta se lee de application.properties (jwt.secret).
// Expiración configurable (jwt.expiration-ms, por defecto 24h).
// Extrae el correo del usuario desde el token para identificarlo.

// ── JwtAuthFilter.java ────────────────────────────────────────
// Filtro que corre ANTES de cada request HTTP.
// Lee el header "Authorization: Bearer <token>".
// Si el token es válido, carga el usuario y lo pone en el contexto
// de seguridad de Spring — así los controladores saben quién hizo la petición.

// ── CustomUserDetailsService.java ─────────────────────────────
// Implementa UserDetailsService de Spring Security.
// Conecta con UsuarioRepository para buscar el usuario por correo.
// Convierte la entidad Usuario en un UserDetails que Spring entiende,
// incluyendo el rol como autoridad (ROLE_ADMIN o ROLE_CLIENTE).
```

---

### 📦 Modelos / Entidades — `Modelo/`

```java
// ── Usuario.java ──────────────────────────────────────────────
// Tabla: usuario
// Campos clave: correo (único), contrasena (BCrypt), resetToken (recuperación)
// Relaciones:
//   → ManyToOne con Rol (Admin o Cliente)
//   → OneToMany con Direccion (varias direcciones de envío)
//   → OneToMany con MetodoPago (varios métodos guardados)
//   → OneToMany con Orden (historial de compras)

// ── Producto.java ─────────────────────────────────────────────
// Tabla: producto
// Un producto (ej: "Cupcakes Especiales") pertenece a una Categoría
// y tiene N variantes (sabores/tamaños) en ProductoVariante.
// También tiene campos de catálogo: descripción, precio, imagenUrl.

// ── ProductoVariante.java ─────────────────────────────────────
// Tabla: producto_variantes
// Cada variante (ej: "Chocolate S/ 7.50") tiene un precioAdicional
// y está ligada a la receta de insumos en receta_fija.

// ── Orden.java ───────────────────────────────────────────────
// Tabla: orden
// Representa una venta completa del cliente.
// Estados de venta: Pendiente → Confirmada → Completada | Cancelado
// Métodos de pago aceptados: Efectivo, Transferencia, Tarjeta, Yape
// → OneToMany con DetalleOrden (los productos de la venta)

// ── Comentario.java ───────────────────────────────────────────
// Tabla: comentarios
// Reseña de un cliente. Empieza sin aprobar.
// El admin la revisa y la aprueba — solo entonces se muestra en el frontend.
```

---

### 🎮 Controladores REST — `Controlador/`

```java
// ── AuthController.java ───────────────────────────────────────
// Ruta base: /api/auth
// Conecta con: AuthService (lógica), AuthServiceImpl
//
// POST /registro       → registra nuevo cliente, hashea contraseña, asigna rol=Cliente
// POST /login          → valida credenciales con BCrypt, devuelve JWT
// POST /olvide-contrasena    → genera token de recuperación y lo envía por email
// POST /restablecer-contrasena → cambia la contraseña usando el token del email

// ── AdminAuthController.java ──────────────────────────────────
// Ruta base: /api/admin/auth
// Login en 2 pasos para el administrador:
// Paso 1: POST /verificar-admin → verifica que sea ADMIN válido (correo + contraseña)
// Paso 2: POST /pin            → valida el PIN de 2do factor, emite JWT con rol ADMIN

// ── ProductoController.java ───────────────────────────────────
// Ruta base: /api/productos
// Conecta con: ProductoRepository (directo a BD)
//
// GET  /                   → lista todos los productos (público)
// GET  /{id}               → detalle de un producto (público)
// GET  /buscar?q=          → busca por nombre, case-insensitive (público)
// GET  /categoria/{catId}  → filtra por categoría (público)
// POST /guardar            → crea producto con imagen (solo ADMIN)
//   ↳ Guarda la imagen en disco (directorio configurado en uploads.directory)
//   ↳ Registra la URL "/uploads/nombreArchivo" en la BD
// PUT  /{id}               → actualiza nombre/precio/descripción (solo ADMIN)
// DELETE /{id}             → elimina producto (solo ADMIN, registra log de warning)

// ── CarritoController.java ────────────────────────────────────
// Ruta base: /api/carrito
// IMPORTANTE: el carrito se guarda en memoria del servidor (lista estática),
// no en BD. Se pierde si el servidor reinicia.
//
// GET  /                   → devuelve los ítems actuales del carrito
// POST /agregar            → agrega producto; si ya existe, incrementa cantidad
// POST /pagar              → confirma el pago y vacía el carrito
// DELETE /limpiar          → vacía el carrito sin pagar

// ── OrdenController.java ─────────────────────────────────────
// Ruta base: /api/ordenes
// Conecta con: OrdenService → OrdenRepository + UsuarioRepository
//
// POST /                         → crea una nueva orden (cliente autenticado)
// GET  /usuario/{usuarioId}      → historial de órdenes del cliente
// GET  /{id}                     → detalle de una orden específica
// PUT  /{id}/estado              → cambia estado de la orden (solo ADMIN)

// ── ComentarioController.java ────────────────────────────────
// Ruta base: /api/comentarios
// Conecta con: ComentarioService → ComentarioRepository
//
// GET  /aprobados                    → comentarios visibles en el frontend (público)
// GET  /aprobados/producto/{id}      → filtrados por producto (público)
// POST /                             → cliente crea reseña (queda en "pendiente")
// GET  /pendientes                   → admin revisa las que esperan aprobación
// PUT  /{id}/aprobar                 → admin aprueba un comentario
// DELETE /{id}                       → admin elimina un comentario

// ── DireccionController.java ──────────────────────────────────
// Ruta base: /api/direcciones
// Conecta con: DireccionService → DireccionRepository + UsuarioRepository
//
// Permite al cliente tener múltiples direcciones de envío guardadas.
// GET    /usuario/{id}              → lista sus direcciones
// POST   /usuario/{id}             → agrega nueva (con opción "esPrincipal")
// PUT    /{id}/usuario/{uid}        → edita una existente
// DELETE /{id}/usuario/{uid}        → elimina una

// ── MetodoPagoController.java ────────────────────────────────
// Ruta base: /api/metodos-pago
// Conecta con: MetodoPagoService → MetodoPagoRepository
// Tipos aceptados: VISA, BANCO, YAPE
//
// Permite guardar y gestionar métodos de pago del cliente.
// Similar en estructura a DireccionController.

// ── PerfilController.java ────────────────────────────────────
// Ruta base: /api/perfil
// Conecta con: UsuarioService → UsuarioRepository
//
// GET /perfil/{id}   → obtiene datos del usuario (nunca devuelve la contraseña)
// PUT /perfil/{id}   → actualiza nombre, apellido, teléfono

// ── ConfiguracionController.java ─────────────────────────────
// Ruta base: /api/configuracion
// Conecta directamente con UsuarioRepository + PasswordEncoder
//
// PUT /actualizar-datos/{id}    → actualiza datos básicos de la cuenta
// POST /cambiar-password/{id}   → cambia contraseña verificando la actual con BCrypt

// ── AdminDashboardController.java ────────────────────────────
// Ruta base: /api/admin/dashboard
// Solo ADMIN. Conecta con múltiples repositorios para armar estadísticas.
// GET /resumen  → totales del mes: órdenes, ingresos, clientes (proceso de ventas)

// ── AdminProductosController.java ────────────────────────────
// Ruta base: /api/admin/productos
// Solo ADMIN. CRUD completo de productos desde el panel admin.

// ── AdminPedidosController.java ──────────────────────────────
// Ruta base: /api/admin/pedidos
// Solo ADMIN. Gestión comercial de ventas: ver todas, cambiar estado (Pendiente/Confirmada/Completada/Cancelado).

// ── AdminOfertasController.java ──────────────────────────────
// Ruta base: /api/admin/ofertas  (y GET /api/ofertas/vigentes → público)
// Gestión de ofertas/descuentos. Las vigentes se muestran en el frontend.

// ── AdminReportesController.java ─────────────────────────────
// Ruta base: /api/admin/reportes
// Solo ADMIN. Genera reportes de ventas. Puede exportar a Excel (Apache POI).

// ── AdminVentasController.java ───────────────────────────────
// Ruta base: /api/admin/ventas
// Solo ADMIN. Historial y análisis de ventas.

// ── UsuarioApiController.java ────────────────────────────────
// Ruta base: /api/usuarios
// Además de registro/login básico, expone GET /api/usuarios/perfil,
// que SÍ es usado activamente por el frontend (PerfilPanel y sus pestañas
// lo consultan para cargar los datos del cliente autenticado).
// POST /registrar  → registra usuario, asigna rol Cliente (id=2), hashea con BCrypt
// POST /login      → verifica credenciales con BCrypt, devuelve objeto usuario
// GET  /perfil     → devuelve los datos del usuario autenticado (requiere JWT)
```

---

### 🔧 Servicios — `service/`

```java
// ── AuthService.java (interfaz) ───────────────────────────────
// Define el contrato para: registrar, login, solicitarRecuperacion,
// restablecerContrasena.

// ── AuthServiceImpl.java ──────────────────────────────────────
// Implementación real. Conecta con:
//   → UsuarioDAO/UsuarioRepository   (verificar/guardar usuario en BD)
//   → JwtUtil                        (generar el token JWT al hacer login)
//   → PasswordEncoder                (hashear y verificar contraseñas BCrypt)
//   → JavaMailSender                 (enviar email con link/token de recuperación)
// El método solicitarRecuperacion NO revela si el correo existe (evita enumeración).
// El token de recuperación tiene expiración guardada en resetTokenExpiry del usuario.

// ── DireccionService / DireccionServiceImpl ───────────────────
// Lógica de negocio de direcciones.
// Conecta con DireccionRepository y UsuarioRepository.
// Valida que la dirección pertenece al usuario antes de editar/eliminar.

// ── MetodoPagoService / MetodoPagoServiceImpl ─────────────────
// Lógica de métodos de pago.
// Conecta con MetodoPagoRepository y UsuarioRepository.
// Valida tipos de pago (VISA, BANCO, YAPE).

// ── OrdenService / OrdenServiceImpl ──────────────────────────
// Lógica de creación y gestión de órdenes.
// Conecta con OrdenRepository, ProductoRepository, UsuarioRepository.
// Al crear una orden recorre los ítems, calcula totales y guarda detalles.

// ── ComentarioService ────────────────────────────────────────
// Lógica de moderación de comentarios.
// Conecta con ComentarioRepository.
// Nuevo comentario: siempre empieza con aprobado=false.

// ── UsuarioService ───────────────────────────────────────────
// Conecta con UsuarioRepository.
// Obtener y actualizar datos del perfil del usuario.
```

---

### 📁 DAOs — `DAO/`

```java
// Los DAOs son una capa de acceso a datos adicional al patrón Repository,
// pensada para aplicar el principio de Inversión de Dependencias (DIP):
// los Services dependen de esta interfaz, no de la implementación concreta.
//
// Solo se mantienen los DAO que realmente tienen una implementación y son
// usados por algún Service. Se retiraron interfaces DAO que nunca llegaron
// a implementarse ni a inyectarse en ningún lado (código muerto).

// ── UsuarioDAOImpl ────────────────────────────────────────────
// Conecta con UsuarioRepository. Usado por AuthService, OrdenService,
// DireccionService y MetodoPagoService.
// Métodos: buscar por correo, guardar, verificar si existe correo.

// ── OrdenDAOImpl ──────────────────────────────────────────────
// Conecta con OrdenRepository. Usado por OrdenService.
// Métodos de consulta más complejos: órdenes por fecha, por estado, etc.

// ── DireccionDAOImpl ──────────────────────────────────────────
// Conecta con DireccionRepository. Usado por DireccionService.
```

> **Nota de arquitectura:** varios controladores (`ProductoController`, `CarritoController`,
> `AdminProductosController`, entre otros) inyectan el `Repository` directamente en vez de
> pasar por un DAO/Service. Es una inconsistencia frente al patrón que sí siguen `Usuario`,
> `Orden` y `Dirección` — se documenta aquí para que quede claro en la sustentación. Mantenerlo
> así es válido si el equipo lo puede explicar (evita una capa de más para operaciones simples).

---

### 📬 DTOs — `DTO/`

```java
// Los DTOs evitan exponer las entidades directamente en la API.

// ── AdminDTOs.java ────────────────────────────────────────────
// AdminPinRequest   → correo + pin para el 2do factor del login admin
// DashboardResumen  → estadísticas del mes: órdenes, ingresos, clientes, personal
// VentaResumen      → ventas agrupadas por período (para reportes)

// ── DTOs.java ─────────────────────────────────────────────────
// Contiene varios DTOs generales: LoginRequest, LoginResponse (con JWT),
// RegistroRequest simplificado, etc.

// ── CarritoResumenDTO.java ────────────────────────────────────
// Resumen del carrito: lista de ítems + total calculado.

// ── UsuarioDTO.java ───────────────────────────────────────────
// Datos básicos del usuario para mostrar en perfil (sin contraseña).
```

---

### 📋 XMLs de configuración

```xml
<!-- ── logback.xml ─────────────────────────────────────────── -->
<!-- Configura el sistema de logs de la aplicación (Logback).    -->
<!-- Define dónde y cómo se guardan/muestran los logs:           -->
<!--   - Consola: muestra logs en tiempo real al ejecutar        -->
<!--   - Archivo: guarda logs en un .log para revisión posterior -->
<!-- Niveles: TRACE < DEBUG < INFO < WARN < ERROR                 -->
<!-- En producción se recomienda INFO o WARN para no saturar.    -->

<!-- ── nbactions.xml ───────────────────────────────────────── -->
<!-- Archivo de NetBeans IDE que mapea botones del IDE a comandos Maven. -->
<!--                                                              -->
<!-- Acción "run":                                                -->
<!--   Ejecuta: mvn process-classes + exec:exec                  -->
<!--   Clase principal: DemoSpringBootApplication                -->
<!--   Arranca el servidor Spring Boot normalmente.              -->
<!--                                                              -->
<!-- Acción "debug":                                              -->
<!--   Igual que run pero agrega el agente JDWP de Java          -->
<!--   (transport=dt_socket) para conectar el debugger remoto.   -->
<!--   Parámetro jpda.address → puerto de depuración.            -->
<!--                                                              -->
<!-- Acción "profile":                                            -->
<!--   Para analizar rendimiento (profiling).                    -->
<!--   Ejecuta la app sin agente de debug.                       -->

<!-- ── pom.xml ─────────────────────────────────────────────── -->
<!-- Archivo principal de Maven. Define:                          -->
<!-- - Identidad del proyecto (groupId, artifactId, version)     -->
<!-- - Versión de Java (17) y Spring Boot padre (3.4.1)          -->
<!-- - Todas las dependencias (librerías) del proyecto            -->
<!-- - Plugin spring-boot-maven-plugin para generar el .jar       -->
<!-- Spring Boot como "parent" hereda versiones compatibles       -->
<!-- de todas las librerías — no hay que especificar versiones    -->
<!-- para las dependencias core de Spring.                        -->
```

---

## ⚛️ Frontend — React

### Estructura de páginas

El enrutamiento combina dos niveles: `react-router-dom` para las rutas de nivel superior
(`index.js`), y navegación por estado interno dentro de `App.jsx` para las páginas de la
tienda pública.

```
index.js (BrowserRouter)
  ├── /                    → App.jsx (tienda pública, navegación interna por estado)
  │     ├── inicio         ← Slider de banners + productos destacados + testimonios
  │     ├── productos      ← Catálogo completo con filtros por categoría
  │     ├── ofertas        ← Productos en descuento (consume /api/ofertas/vigentes)
  │     ├── carrito        ← Carrito de compras
  │     ├── nosotros       ← Página informativa
  │     └── perfil         ← Panel de perfil (pages/perfil/PerfilPanel.js)
  ├── /login               → pages/auth/Login.js → POST /api/auth/login
  ├── /registro            → pages/auth/Registro.js → POST /api/auth/registro
  ├── /perfil              → pages/perfil/PerfilPanel.js
  ├── /cambiar-password-1..4 → pages/auth/Recuperar*.js (flujo de 4 pasos)
  ├── /productos           → pages/tienda/Productos.js
  └── /adminmenu           → pages/auth/AdminLoginGate.js envolviendo pages/admin/AdminPanel.js
```

### Componentes notables

- **`App.jsx`**: componente raíz de la tienda pública; controla la navegación interna con `useState` en vez de rutas propias.
- **`pages/admin/AdminPanel.js`**: shell del panel de administrador (barra lateral + pestañas). Cada pestaña vive en su propio archivo dentro de `pages/admin/` (`AdminDashboardTab.js`, `AdminProductosTab.js`, `AdminPedidosTab.js`, etc.), todas consumiendo los endpoints `/api/admin/**`.
- **`pages/perfil/PerfilPanel.js`**: shell del panel de perfil del cliente; cada pestaña (info, pedidos, direcciones, pagos, favoritos, configuración) vive en su propio archivo en `pages/perfil/`.
- **`pages/tienda/Recibo.js`**: comprobante de pago. Usa datos de ejemplo hardcodeados (María López, RUC 20458706521) — revisar antes de usarlo como evidencia de un flujo real.
- **`pages/auth/Recuperar*.js`**: flujo completo de recuperación de contraseña en 4 pantallas: solicitar correo → revisar email → nueva contraseña → confirmación.

---

## 🔄 Flujo completo: Login de cliente

```
1. Cliente llena formulario en Login.js
2. POST /api/auth/login  { correo, contrasena }
3. AuthController → AuthServiceImpl
4. AuthServiceImpl consulta UsuarioRepository.findByCorreo()
5. BCrypt.matches(contrasenaIngresada, hashEnBD)
6. Si OK → JwtUtil.generateToken(correo) → devuelve JWT
7. Frontend guarda el JWT en localStorage/state
8. Siguientes requests llevan header: Authorization: Bearer <token>
9. JwtAuthFilter intercepta → valida JWT → pone usuario en contexto
10. Los controladores ya saben quién es el usuario autenticado
```

## 🔄 Flujo completo: Login de administrador (2 pasos)

```
1. Admin ingresa correo + contraseña en /admin/login
2. POST /api/admin/auth/verificar-admin → verifica que sea rol ADMIN
3. Si OK, el sistema envía/muestra un PIN de segundo factor
4. Admin ingresa el PIN
5. POST /api/admin/auth/pin  { correo, pin }
6. Si el PIN es correcto → genera JWT con rol ADMIN
7. Frontend usa ese JWT para acceder a /api/admin/**
```

## 🔄 Flujo completo: Hacer una venta

```
1. Cliente agrega productos → POST /api/carrito/agregar
2. Revisa carrito → GET /api/carrito
3. Elige dirección, opción de entrega (recojo/delivery) y método de pago
4. Confirma pago → POST /api/carrito/pagar (vacía carrito en memoria)
5. Se crea la venta → POST /api/ordenes  (estado inicial: Pendiente)
6. OrdenService guarda Orden + DetalleOrden en BD
7. Admin ve la venta en Pedidos y puede cambiar estado:
   Pendiente → Confirmada → Completada  |  Cancelado
8. El cliente consulta el mismo estado en Mis pedidos y en el Recibo
```

---

## ⚠️ Notas técnicas importantes

- El **carrito está en memoria del servidor** (lista estática en `CarritoController`), no persiste en BD. Si el servidor se reinicia, se pierde. Para producción habría que guardarlo en BD o en sesión del usuario.
- Hay **dos tablas de productos**: `producto` (con categorías y variantes) y `productos` (con imagen binaria en BLOB). Parece ser una evolución del modelo — la tabla `producto` es la activa.
- `UsuarioApiController.java` (`/api/usuarios`) y `AuthController.java` (`/api/auth`) ambos exponen registro/login — el segundo es el que usa el flujo principal de login/registro. Pero `UsuarioApiController` no es descartable: su endpoint `GET /api/usuarios/perfil` sí es usado activamente por el panel de perfil del frontend. No se debe eliminar sin antes migrar ese endpoint a otro controlador.
- Los datos de productos en `App.jsx` del frontend son **estáticos hardcodeados** — en un entorno real deberían cargarse desde `/api/productos`.

---

## 🧹 Limpieza y reorganización aplicada

Este README documenta el proyecto **después** de una limpieza de código. Resumen de lo que cambió:

**Backend:**
- Se eliminó `mycontroller.java` (controlador MVC roto: usaba vistas Thymeleaf que no existen en el proyecto — no hay `templates/` ni la dependencia de Thymeleaf en el `pom.xml`).
- Se eliminó el módulo `Pedido`/`PedidoDetalle` (`Modelo`, `DAO`, `Repositorio`) por ser un duplicado del módulo `Orden`/`DetalleOrden` sin ninguna referencia activa en el código.
- Se eliminaron las interfaces `ComentarioDAO`, `DetalleOrdenDAO`, `MetodoPagoDAO`, `ProductoDAO` y `CarritoDAO`: nunca tuvieron una implementación ni fueron inyectadas en ningún Service o Controller.
- Las credenciales hardcodeadas en `application.properties` (contraseña de BD, clave JWT, PIN de admin, credenciales de Gmail) ahora se leen desde variables de entorno.

**Frontend:**
- Se eliminaron archivos vacíos o sin usar: `Boletas.js`, `App.css`, `style.css`, `logo.svg`, `reportWebVitals.js`, `App.test.js` (test roto de la plantilla original de Create React App).
- Se reorganizó `src/` en carpetas por dominio: `components/`, `pages/auth/`, `pages/tienda/`, `pages/perfil/`, `pages/admin/`, `pages/legal/`.
- Se renombraron los archivos con nombres crípticos a nombres descriptivos (`AdminMenu3.js` → `AdminProductosTab.js`, `Perfil5.js` → `PerfilFavoritosTab.js`, `CambiarPassword2.js` → `RecuperarRevisarCorreo.js`, etc.), incluyendo el nombre del componente interno, no solo el archivo.

> Nota: este README tenía referencias a archivos que nunca existieron en el código real (`Layout.js`, `Recibo2.js`, `Recibo3.js`, `DashboardAdmin.js`, ruta `/boletas`). Se corrigieron las secciones de estructura y de frontend para reflejar el código real, pero no se auditó línea por línea el resto del documento — conviene revisarlo antes de entregarlo.