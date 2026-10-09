-- Alinear estados de orden al proceso de VENTAS (ejecutar si la BD ya existía).
-- Pendiente se mantiene. Estados de despacho se convierten a estados comerciales.

ALTER TABLE `orden`
  MODIFY `ord_estado` VARCHAR(20) NULL;

UPDATE `orden` SET `ord_estado` = 'Confirmada' WHERE `ord_estado` IN ('Preparando', 'Enviado');
UPDATE `orden` SET `ord_estado` = 'Completada' WHERE `ord_estado` IN ('Entregado');

ALTER TABLE `orden`
  MODIFY `ord_estado` ENUM('Cancelado','Completada','Confirmada','Pendiente') NULL;
