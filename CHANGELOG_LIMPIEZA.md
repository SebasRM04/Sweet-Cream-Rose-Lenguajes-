# Registro de limpieza del proyecto Sweet Cream Rose

Este documento resume los cambios realizados sobre el proyecto original para
dejarlo ordenado antes de la entrega. No se modificó ninguna funcionalidad:
todos los cambios son de organización, nombres, eliminación de código muerto
y manejo de credenciales. Se verificaron automáticamente todas las rutas de
importación del frontend (216 en total) para confirmar que nada quedó roto.

## Backend (Spring Boot)

### Eliminado — código muerto confirmado
Se verificó con búsquedas en todo el código fuente que ninguno de estos
archivos era referenciado por otra clase antes de eliminarlos:

- `Controlador/mycontroller.java` — controlador que devolvía nombres de vista
  (`"index"`, `"login"`, `"registro"`) para ser resueltos por Thymeleaf, pero
  el proyecto no tiene la dependencia de Thymeleaf ni una carpeta `templates/`.
  Nunca pudo haber funcionado.
- `Modelo/Pedido.java`, `Modelo/PedidoDetalle.java`, `DAO/PedidoDAO.java`,
  `Repositorio/PedidoRepository.java` — módulo completo de "pedido" duplicado,
  sin ninguna referencia en el resto del código. La funcionalidad real de
  pedidos vive en `Orden`/`DetalleOrden`.
- `DAO/ComentarioDAO.java`, `DAO/DetalleOrdenDAO.java`, `DAO/MetodoPagoDAO.java`,
  `DAO/ProductoDAO.java`, `DAO/CarritoDAO.java` — interfaces DAO que nunca
  tuvieron una clase que las implementara ni fueron inyectadas en ningún
  Service o Controller.

### Corregido — credenciales hardcodeadas
En `application.properties`, estos valores estaban escritos directamente en
el archivo (y por lo tanto quedaban expuestos si el repositorio es público):

- Contraseña de la base de datos.
- Clave de firma JWT (`jwt.secret`).
- PIN de administrador (`admin.pin`).
- **Usuario y contraseña de aplicación de una cuenta de Gmail real.**

Ahora todos se leen desde variables de entorno (`${VARIABLE:valor_por_defecto}`),
con valores de desarrollo seguros como respaldo para que el proyecto siga
funcionando localmente sin configuración adicional. `docker-compose.yml` ya
inyectaba `SPRING_MAIL_USERNAME`/`SPRING_MAIL_PASSWORD` de esta forma; ahora
el resto de las propiedades sigue el mismo patrón.

**Importante:** si este repositorio ya fue subido a GitHub con la contraseña
de Gmail real, esa contraseña de aplicación debe revocarse y generarse una
nueva desde la cuenta de Google — cambiar el archivo no la invalida.

### Sin cambios (a propósito)
- La capa DAO que sí está en uso (`UsuarioDAOImpl`, `OrdenDAOImpl`,
  `DireccionDAOImpl`) se mantuvo intacta.
- No se tocó la lógica de negocio de ningún Service ni Controller.
- El stack de monitoreo (Prometheus/Grafana) se dejó como está — es una
  decisión de alcance del equipo, no un desorden de código. Si nadie del
  grupo lo puede explicar en la sustentación, es más seguro quitarlo antes
  de entregar (avísenme si quieren que lo haga).
- `UsuarioApiController.java` se mantuvo: aunque duplica parte del login de
  `AuthController`, su endpoint `GET /api/usuarios/perfil` sí es usado
  activamente por el panel de perfil del frontend.

## Frontend (React)

### Eliminado — archivos muertos o vacíos
- `Boletas.js` (archivo vacío, sin ninguna referencia).
- `App.css` (757 líneas, no importado por ningún archivo).
- `style.css` (vacío, con comentario propio diciendo que no se usaba).
- `logo.svg` (logo por defecto de Create React App, sin usar).
- `reportWebVitals.js` (no estaba siendo llamado desde `index.js`).
- `App.test.js` (test heredado de la plantilla de Create React App que
  buscaba el texto "learn react" — nunca iba a pasar en este proyecto).

### Reorganizado — estructura de carpetas
Antes, los ~40 archivos de `src/` estaban todos sueltos en un mismo nivel.
Ahora están agrupados por dominio:

```
src/
├── components/     Header, Footer (compartidos)
├── pages/
│   ├── auth/       Login, Registro, recuperación de contraseña
│   ├── tienda/     Inicio, Productos, Ofertas, Carrito, Recibo, Nosotros
│   ├── perfil/     Panel de perfil del cliente y sus pestañas
│   ├── admin/      Panel de administración y sus pestañas
│   └── legal/      Términos, políticas, preguntas frecuentes
├── assets/
├── App.jsx, api.js, index.js  (raíz)
```

### Renombrado — de nombres crípticos a descriptivos
Los archivos numerados no eran duplicados (se verificó que cada uno se usa
como pestaña dentro de su panel), pero los nombres no decían nada de lo que
hacían. Se renombraron tanto el archivo como el componente interno:

| Antes | Ahora |
|---|---|
| `AdminMenu.js` | `AdminPanel.js` |
| `AdminMenu1.js` … `AdminMenu11.js` | `AdminDashboardTab.js`, `AdminPedidosTab.js`, `AdminProductosTab.js`, `AdminVentasTab.js`, `AdminPersonalTab.js`, `AdminHorariosTab.js`, `AdminOfertasTab.js`, `AdminGananciasTab.js`, `AdminReportesTab.js`, `AdminComentariosTab.js`, `AdminConfiguracionTab.js` |
| `Perfil.js` | `PerfilPanel.js` |
| `Perfil1.js` … `Perfil6.js` | `PerfilInfoTab.js`, `PerfilPedidosTab.js`, `PerfilDireccionesTab.js`, `PerfilPagosTab.js`, `PerfilFavoritosTab.js`, `PerfilConfiguracionTab.js` |
| `CambiarPassword1.js` … `CambiarPassword4.js` | `RecuperarSolicitar.js`, `RecuperarRevisarCorreo.js`, `RecuperarNuevaContrasena.js`, `RecuperarExito.js` |

Este mapeo se puede necesitar si algún compañero tiene una rama con el
código viejo y hay que fusionar cambios.

### Verificación
Se corrió un script que revisó las 216 rutas de importación relativas del
proyecto después de mover y renombrar todo, confirmando que cada una resuelve
a un archivo real. También se revisó manualmente que ningún identificador
viejo (`AdminMenu3`, `Perfil5`, etc.) quedara suelto en el código funcional.

**Corrección posterior:** el script de verificación inicial usaba una
expresión regular que no contemplaba nombres de archivo con espacios (por
ejemplo `Ofertas_check verde.png`, `torta de fresa.png`). Esto dejó 2
imports de imágenes sin corregir tras la reorganización
(`pages/auth/RecuperarExito.js` y `pages/tienda/Ofertas.js`), detectado al
correr `npm start` y ver el error "Module not found" en el navegador. Se
corrigieron ambas rutas y se volvió a verificar con un script mejorado que sí
soporta espacios — ahora son 218 imports verificados en total, todos
resuelven correctamente.

## Otros archivos de la raíz

- Se agregó `.gitignore` en la raíz del proyecto (antes no existía) para
  evitar que `.env`, `target/`, `node_modules/`, logs y builds se suban al
  repositorio.
- Se agregó `.env.example` como plantilla; el `.env` real con la contraseña
  de Gmail fue eliminado del paquete.
- Se eliminaron `backend_logs.txt`, `logs/` y un `package-lock.json` vacío
  en la raíz — son artefactos de ejecución, no código fuente.
- `README.md` se actualizó en las secciones de estructura de carpetas,
  DAOs y frontend para reflejar el proyecto real (tenía referencias a
  archivos que nunca existieron, como `Layout.js` o `DashboardAdmin.js`,
  probablemente de una versión anterior del documento). El resto del
  README no fue auditado línea por línea.

## Lo que se decidió NO tocar (y por qué)

- **La inconsistencia entre Service→DAO y Controller→Repository directo**
  (por ejemplo, `ProductoController` no pasa por un Service). Corregirlo
  significa reescribir la lógica de varios controladores sin poder compilar
  el proyecto para verificarlo en este entorno — el riesgo de romper algo
  que sí funciona es mayor que el beneficio. Queda documentado en el README
  como una nota de arquitectura para que lo puedan explicar si preguntan.
- **El stack de Prometheus/Grafana.** Es una funcionalidad completa y
  funcional, no desorden. Se las señalo como una decisión pendiente del
  equipo, no algo que haya decidido borrar por mi cuenta.
