# Recorte al proceso de Ventas — Sweet Cream Rose

El profesor pidió **un solo proceso**. Este paquete deja el sistema centrado en **Ventas** y retira **Despacho / inventario operativo**.

## Qué se quitó (Despacho)

- Pantallas admin **Personal** y **Horarios**
- API `/api/admin/personal` y horarios
- Entidades JPA `Personal` y `HorarioPersonal`
- Estados logísticos del pedido: Preparando (cocina) y Enviado (reparto)
- Reportes de personal y horarios
- Hueco de seguridad: `POST /api/admin/personal` estaba en `permitAll`

Las tablas SQL `personal` y `horario_personal` pueden quedar en el dump histórico; **el código ya no las usa**.

## Estados de venta (los que sí se quedan)

| Estado | Quién lo ve | Significado |
|---|---|---|
| Pendiente | Cliente y admin | Venta registrada, por confirmar |
| Confirmada | Cliente y admin | Venta aceptada / pagada |
| Completada | Cliente y admin | Venta cerrada |
| Cancelado | Cliente y admin | Venta anulada |

El admin cambia el estado en **Pedidos**. El cliente lo ve en **Mis pedidos** y en el **Recibo**.

## Qué se conservó (Ventas)

Catálogo, ofertas, carrito, checkout (dirección, recojo/delivery como dato de la venta, pago), órdenes, recibo, perfil del cliente, comentarios, dashboard de ventas, reportes de ventas/ganancias/productos, login de cliente y admin.
