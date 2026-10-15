# Sweet Cream Rose

Sistema web de ventas para una tienda de repostería. El cliente consulta el catálogo, arma su pedido y registra la compra. El administrador da seguimiento a las órdenes, las ofertas y los reportes.

## Cuentas para ingresar

Estas cuentas quedan cargadas al importar `Reposteria_VENTAS.sql`.

| Rol | Correo | Contraseña | Segundo paso |
|---|---|---|---|
| Administrador | admin@gmail.com | Admin123! | PIN `SweetCream2024!` |
| Cliente | maria@gmail.com | 123456 | — |
| Cliente | oscar123@gmail.com | 123456 | — |

El administrador entra por `/adminmenu`. El cliente entra por `/login`. También se puede crear una cuenta nueva desde `/registro`.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Interfaz | React (Create React App), puerto 3000 |
| API | Java 17, Spring Boot 3.4.1, puerto 8081 |
| Base de datos | MySQL 8 |
| Seguridad | Spring Security, JWT y BCrypt |
| Reportes | Excel (Apache POI) y PDF |

La interfaz consume una API REST. El backend está organizado en capas: controlador, servicio, DAO o repositorio, y modelo.

## Cómo ejecutarlo

Requisitos: JDK 17, Maven, Node.js y MySQL 8.

1. Crear la base e importar el script.

```sql
CREATE DATABASE IF NOT EXISTS reposteria;
```

Luego ejecutar `Reposteria.sql` sobre esa base.

2. La conexión local ya está prevista en `application.properties`: base `reposteria`, usuario `root` y contraseña `1234`, en `localhost:3306`. Si tu MySQL usa otros datos, defínelos antes de arrancar el backend:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/reposteria?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="tu_clave"
```

3. Backend, desde la carpeta `demoSpringBoot`:

```powershell
mvn spring-boot:run
```

La API queda en `http://localhost:8081`.

4. Frontend, desde la carpeta `frontend-pink-sweet`:

```powershell
npm install
npm start
```

La tienda queda en `http://localhost:3000`.

## Base de datos en la nube

La misma API puede usar MySQL en Aiven. No se modifica el código: en la misma terminal donde se arranca el backend se definen las tres variables con el host, el usuario `avnadmin` y la contraseña del servicio. La URL debe incluir `sslmode=require`.

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://HOST:PUERTO/defaultdb?sslmode=require&serverTimezone=UTC"
$env:SPRING_DATASOURCE_USERNAME="avnadmin"
$env:SPRING_DATASOURCE_PASSWORD="CLAVE_DEL_SERVICIO"
mvn spring-boot:run
```

El script preparado para importar en la base que entrega Aiven es `Reposteria_VENTAS_NUBE.sql`.

## Qué puede hacer cada rol

**Cliente:** ver el catálogo y las ofertas, buscar productos, usar el carrito, registrar la venta con dirección y medio de pago, consultar sus pedidos y administrar su perfil.

**Administrador:** ver el panel de ventas, gestionar productos, ofertas, pedidos y comentarios, y exportar reportes en Excel y PDF.

Los estados de una orden son `Pendiente`, `Confirmada`, `Completada` y `Cancelado`.

## Rutas de la interfaz

| Ruta | Pantalla |
|---|---|
| `/` | Inicio de la tienda |
| `/productos` | Catálogo |
| `/login` | Inicio de sesión |
| `/registro` | Crear cuenta |
| `/perfil` | Perfil del cliente |
| `/adminmenu` | Panel de administración |

## Estructura

```text
demoSpringBoot/          API Spring Boot
frontend-pink-sweet/     Interfaz React
monitoring/              Prometheus y Grafana (opcional)
Reposteria.sql           Script de la base de datos
```

Los paquetes del backend son `Controlador`, `service`, `DAO`, `Repositorio`, `Modelo`, `DTO`, `Seguridad` y `Configuracion`.
