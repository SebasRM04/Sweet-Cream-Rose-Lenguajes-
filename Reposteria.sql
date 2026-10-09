CREATE DATABASE  IF NOT EXISTS `reposteria` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `reposteria`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: reposteria
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito_item`
--

DROP TABLE IF EXISTS `carrito_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_item` (
  `cantidad` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `pro_id_fk` int DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  `usu_id_fk` int DEFAULT NULL,
  `var_id_fk` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1nafb0gp4qnedympwoxrf14bs` (`pro_id_fk`),
  KEY `FKstisod8mjyapo2lba1bxa61g3` (`usu_id_fk`),
  KEY `FKbnjq7bqxp7xxdtijob18qnfq6` (`var_id_fk`),
  CONSTRAINT `FK1nafb0gp4qnedympwoxrf14bs` FOREIGN KEY (`pro_id_fk`) REFERENCES `producto` (`pro_id`),
  CONSTRAINT `FKbnjq7bqxp7xxdtijob18qnfq6` FOREIGN KEY (`var_id_fk`) REFERENCES `producto_variantes` (`var_id`),
  CONSTRAINT `FKstisod8mjyapo2lba1bxa61g3` FOREIGN KEY (`usu_id_fk`) REFERENCES `usuario` (`usu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_item`
--

LOCK TABLES `carrito_item` WRITE;
/*!40000 ALTER TABLE `carrito_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Entremets'),(2,'Tortas Clásicas'),(3,'Galletas'),(4,'Tequeños Variados'),(5,'Mini Sandwiches'),(6,'Mini Empanadas'),(7,'Alfajores'),(8,'Trufas'),(9,'Postres Fríos'),(10,'Cupcakes');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentarios` (
  `aprobado` bit(1) NOT NULL,
  `calificacion` int DEFAULT NULL,
  `pro_id_fk` int DEFAULT NULL,
  `usu_id_fk` int DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `contenido` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlk5mefq9awp2bfpqfjq2ibrp2` (`pro_id_fk`),
  KEY `FKh4gwpd2ecmd6y97hld3a5m96y` (`usu_id_fk`),
  CONSTRAINT `FKh4gwpd2ecmd6y97hld3a5m96y` FOREIGN KEY (`usu_id_fk`) REFERENCES `usuario` (`usu_id`),
  CONSTRAINT `FKlk5mefq9awp2bfpqfjq2ibrp2` FOREIGN KEY (`pro_id_fk`) REFERENCES `producto` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_orden`
--

DROP TABLE IF EXISTS `detalles_orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_orden` (
  `deto_cantidad` int DEFAULT NULL,
  `deto_id` int NOT NULL AUTO_INCREMENT,
  `deto_precio` double DEFAULT NULL,
  `deto_sub_total` double DEFAULT NULL,
  `ord_id_fk` int DEFAULT NULL,
  `pro_id_fk` int DEFAULT NULL,
  `var_id_fk` int DEFAULT NULL,
  PRIMARY KEY (`deto_id`),
  KEY `FKnpi5gcmfi0korrinio9rua75o` (`ord_id_fk`),
  KEY `FKgpqc5pfp9rbw8n5fffdrpdg10` (`pro_id_fk`),
  KEY `FK718q3qiqy9w2fsrm6xxb82rkh` (`var_id_fk`),
  CONSTRAINT `FK718q3qiqy9w2fsrm6xxb82rkh` FOREIGN KEY (`var_id_fk`) REFERENCES `producto_variantes` (`var_id`),
  CONSTRAINT `FKgpqc5pfp9rbw8n5fffdrpdg10` FOREIGN KEY (`pro_id_fk`) REFERENCES `producto` (`pro_id`),
  CONSTRAINT `FKnpi5gcmfi0korrinio9rua75o` FOREIGN KEY (`ord_id_fk`) REFERENCES `orden` (`ord_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_orden`
--

LOCK TABLES `detalles_orden` WRITE;
/*!40000 ALTER TABLE `detalles_orden` DISABLE KEYS */;
INSERT INTO `detalles_orden` VALUES (2,1,3.5,7,1,14,NULL),(2,2,4.5,9,1,55,NULL);
/*!40000 ALTER TABLE `detalles_orden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horario_personal`
--

DROP TABLE IF EXISTS `horario_personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horario_personal` (
  `hor_entrada` time(6) NOT NULL,
  `hor_id` int NOT NULL AUTO_INCREMENT,
  `hor_salida` time(6) NOT NULL,
  `per_id_fk` int NOT NULL,
  `hor_dia` enum('Domingo','Jueves','Lunes','Martes','Miercoles','Sabado','Viernes') NOT NULL,
  PRIMARY KEY (`hor_id`),
  KEY `FKiy0fi5kwhjcnppvutox6hd96h` (`per_id_fk`),
  CONSTRAINT `FKiy0fi5kwhjcnppvutox6hd96h` FOREIGN KEY (`per_id_fk`) REFERENCES `personal` (`per_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horario_personal`
--

LOCK TABLES `horario_personal` WRITE;
/*!40000 ALTER TABLE `horario_personal` DISABLE KEYS */;
/*!40000 ALTER TABLE `horario_personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oferta`
--

DROP TABLE IF EXISTS `oferta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oferta` (
  `ofer_activa` bit(1) NOT NULL,
  `ofer_descuento` decimal(5,2) NOT NULL,
  `ofer_fecha_fin` date NOT NULL,
  `ofer_fecha_inicio` date NOT NULL,
  `ofer_id` int NOT NULL AUTO_INCREMENT,
  `pro_id_fk` int DEFAULT NULL,
  `ofer_titulo` varchar(100) NOT NULL,
  `ofer_descripcion` text,
  PRIMARY KEY (`ofer_id`),
  KEY `FKb5f2w92s6kt05pwypi12snyml` (`pro_id_fk`),
  CONSTRAINT `FKb5f2w92s6kt05pwypi12snyml` FOREIGN KEY (`pro_id_fk`) REFERENCES `producto` (`pro_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oferta`
--

LOCK TABLES `oferta` WRITE;
/*!40000 ALTER TABLE `oferta` DISABLE KEYS */;
INSERT INTO `oferta` VALUES (_binary '',20.00,'2026-08-31','2026-07-01',1,7,'Torta Triple Chocolate en oferta','Delicioso bizcocho de chocolate con relleno y cobertura de ganache, decorado con crema de chocolate.'),(_binary '',15.00,'2026-08-31','2026-07-01',2,20,'Tequeños Clásicos en oferta','La receta tradicional que nunca falla. Rellenos de queso blanco llanero, crujientes por fuera y derretidos por dentro.'),(_binary '',25.00,'2026-08-31','2026-07-01',3,44,'Trufas de Fresa en oferta','Chocolate negro relleno de una suave crema de fresa natural. Dulces, frutales y absolutamente irresistibles.'),(_binary '',15.00,'2026-08-31','2026-07-01',4,32,'Mini Empanadas de Queso en oferta','Deliciosas empanadas rellenas de queso fundido, cremosas por dentro y doradas por fuera.'),(_binary '',20.00,'2026-08-31','2026-07-01',5,37,'Alfajor Clásico en oferta','Delicadas tapitas artesanales con un suave relleno de dulce de leche y un toque de azúcar en polvo.'),(_binary '',10.00,'2026-08-31','2026-07-01',6,60,'Cupcakes de Arándano en oferta','Delicioso y suave pastelito de miga fina con un toque de dulzor a chocolate.');
/*!40000 ALTER TABLE `oferta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden`
--

DROP TABLE IF EXISTS `orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden` (
  `ord_id` int NOT NULL AUTO_INCREMENT,
  `ord_total` double DEFAULT NULL,
  `usu_id_fk` int DEFAULT NULL,
  `ord_fecha` datetime(6) DEFAULT NULL,
  `ord_direccion_entrega` text,
  `ord_estado` enum('Cancelado','Completada','Confirmada','Pendiente') DEFAULT NULL,
  `ord_metodo_pago` enum('Efectivo','Tarjeta','Transferencia','Yape') DEFAULT NULL,
  PRIMARY KEY (`ord_id`),
  KEY `FKjmspfe4pkkc1lt3lvry7mwpk3` (`usu_id_fk`),
  CONSTRAINT `FKjmspfe4pkkc1lt3lvry7mwpk3` FOREIGN KEY (`usu_id_fk`) REFERENCES `usuario` (`usu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden`
--

LOCK TABLES `orden` WRITE;
/*!40000 ALTER TABLE `orden` DISABLE KEYS */;
INSERT INTO `orden` VALUES (1,16,5,'2026-06-14 04:34:41.828336','Dirección registrada','Pendiente','Yape');
/*!40000 ALTER TABLE `orden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_detalles`
--

DROP TABLE IF EXISTS `pedido_detalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_detalles` (
  `cantidad` int DEFAULT NULL,
  `producto_id` int DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnnxrhaa3hfk0jlpn5fb849flt` (`pedido_id`),
  KEY `FKmote3ewyitfqavlb8v45xlrmc` (`producto_id`),
  CONSTRAINT `FKmote3ewyitfqavlb8v45xlrmc` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`pro_id`),
  CONSTRAINT `FKnnxrhaa3hfk0jlpn5fb849flt` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_detalles`
--

LOCK TABLES `pedido_detalles` WRITE;
/*!40000 ALTER TABLE `pedido_detalles` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_detalles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `total` double DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  `nro_pedido` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKonf32qpq8pb2950dfgiyevy1h` (`usuario_id`),
  CONSTRAINT `FKonf32qpq8pb2950dfgiyevy1h` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal`
--

DROP TABLE IF EXISTS `personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal` (
  `per_fecha_ingreso` date DEFAULT NULL,
  `per_id` int NOT NULL AUTO_INCREMENT,
  `per_telefono` varchar(20) DEFAULT NULL,
  `per_apellido` varchar(100) NOT NULL,
  `per_nombre` varchar(100) NOT NULL,
  `per_correo` varchar(150) NOT NULL,
  `per_estado` enum('Activo','Inactivo') NOT NULL,
  `per_rol` enum('Administrador','Atencion','Caja','Repartidor','Repostero') NOT NULL,
  PRIMARY KEY (`per_id`),
  UNIQUE KEY `UKsciwouu88lgmbkhac0ns0t9rm` (`per_correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal`
--

LOCK TABLES `personal` WRITE;
/*!40000 ALTER TABLE `personal` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `cat_id_fk` int DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `pro_id` int NOT NULL AUTO_INCREMENT,
  `pro_nombre` varchar(50) NOT NULL,
  `imagen_url` varchar(300) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pro_id`),
  KEY `FKg6x8a46hwa3qwrcdtqvnfv50k` (`cat_id_fk`),
  CONSTRAINT `FKg6x8a46hwa3qwrcdtqvnfv50k` FOREIGN KEY (`cat_id_fk`) REFERENCES `categoria` (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,12,1,'Limón','/uploads/productos/e-limon.png','Suave entremet de limón con un corazón de curd de limón y un bizzocho de vainilla ligero y esponjoso.'),(1,12,2,'Glaseado Espejo','/uploads/productos/e-glaseado-espejo.png','Elegante entremet con mousse de frutos del bosque y un interior de crema de vainilla con mermelada de arándanos. Acabado en glaseado espejo brillante.'),(1,12,3,'Fresa','/uploads/productos/e-fresa.png','Fusión perfecta de mousse de fresa cremosa y un interior suave de vainilla con gelée de fresa natural.'),(1,12,4,'Mora','/uploads/productos/e-mora.png','Exquisito entremet de mora con mousse ligera y un corazón de gel de mora silvestre sobre bizcocho de chocolate.'),(1,12,5,'Coco','/uploads/productos/e-coco.png','Delicado entremet de coco con relleno tropical de maracuyá y bizcocho de vainilla húmedo.'),(1,15,6,'Mini Entremets','/uploads/productos/e-mini-entremets.png','Pequeños corazones de mousse y gelatina en diferentes sabores. Ideales para detalles únicos y celebraciones especiales.'),(2,45,7,'Triple Chocolate','/uploads/productos/tc-triple-chocolate.png','Delicioso bizcocho de chocolate con relleno y cobertura de ganache, decorado con crema de chocolate.'),(2,40,8,'Vainilla con Frutas','/uploads/productos/tc-vainilla-con-frutas.png','Bizcocho de vainilla esponjoso con relleno de crema chantilly y frutas frescas de temporada.'),(2,38,9,'Zanahoria','/uploads/productos/tc-zanahoria.png','Húmeda torta de zanahoria con nueces y pasas, cubierta con frosting de queso crema.'),(2,42,10,'Red Velvet','/uploads/productos/tc-red-velvet.png','Clásica torta red velvet con capas de bizcocho rojo y frosting de queso crema.'),(2,35,11,'Chocolate','/uploads/productos/tc-chocolate.png','Bizcocho de chocolate intenso con relleno y cobertura de ganache de chocolate belga.'),(2,38,12,'Maracuyá','/uploads/productos/tc-maracuya.png','Suave bizcocho de vainilla con mousse de maracuyá y cobertura de pulpa natural.'),(3,3.5,13,'Fresa','/uploads/productos/g-fresa.jpg','Deliciosas galletas de fresa con copos de avena, mermelada en figuras y un toque de vainilla.'),(3,3.5,14,'Piña','/uploads/productos/g-pina.jpg','Galletas deliciosas de piña, avena, bañadas en una crema de coco y vainilla para disfrutar el paladar.'),(3,3.5,15,'Manzana','/uploads/productos/g-manzana.jpg','Deliciosas galletas de manzana, vainilla, nuez, almendras y avena bañadas en crema de caramelo.'),(3,4,16,'Chocolate','/uploads/productos/g-chocolate.png','Galletas deliciosas de piña, avena, bañadas en una crema de coco y vainilla para disfrutar el paladar.'),(3,3.5,17,'Avena y Pasas','/uploads/productos/g-avena-y-pasas.png','Deliciosas galletas de manzana, vainilla, nuez, almendras y avena bañadas en crema de caramelo.'),(3,5,18,'Personalizadas','/uploads/productos/g-personalizadas.jpg','Galletas artesanales personalizadas, decoradas con diseños únicos ideales para baby showers, cumpleaños, quinceañeros y momentos especiales. Cada detalle es hecho con amor para sorprender y endulzar tus celebraciones.'),(4,8,19,'Pollo','/uploads/productos/tv-pollo.png','Deliciosos tequeños rellenos de pollo desmechado con un toque de especias. ¡Irresistibles!'),(4,7,20,'Clásicos','/uploads/productos/tv-clasicos.png','La receta tradicional que nunca falla. Rellenos de queso blanco llanero, crujientes por fuera y derretidos por dentro.'),(4,9,21,'Queso Gouda','/uploads/productos/tv-queso-gouda.png','Rellenos con cremoso queso gouda que se derrite perfectamente, creando un sabor suave y delicioso.'),(4,8.5,22,'Guayaba y Queso','/uploads/productos/tv-guayaba-y-queso.png','La combinación perfecta entre lo dulce y lo salado. Queso blanco llanero con dulce de guayaba.'),(4,8.5,23,'Jamón y Queso','/uploads/productos/tv-jamon-y-queso.png','Rellenos de jamón de calidad y queso derretido. Un clásico que siempre encanta.'),(4,9.5,24,'Nutella','/uploads/productos/tv-nuttela.png','Para los amantes de lo dulce. Rellenos de Nutella cremosa y envueltos en nuestra masa crujiente.'),(5,10,25,'Gourmet','/uploads/productos/ms-mini-sandwiches-gourmet.png','Una selección de delgados mini sándwiches elaborados con ingredientes gourmet. ¡Perfectos para cualquier ocasión!'),(5,12,26,'Croissants Rellenos','/uploads/productos/ms-mini-croissants-rellenos.png','Crujientes mini croissants rellenos de queso, jamón, tomate y lechuga fresca.'),(5,9,27,'Delipe','/uploads/productos/ms-mini-sandwiches-delipe.png','Una selección de mágicos mini sándwiches elaborados con ingredientes premium. ¡Perfectos para cualquier evento!'),(5,11,28,'Mini Baguettas','/uploads/productos/ms-mini-baguettas.png','Mini baguettes rellenas de pollo, jamón, queso, lechuga, tomate y aderezos suaves. ¡La elección ideal para los amantes del buen sabor!'),(5,10.5,29,'Mini Wraps','/uploads/productos/ms-mini-wraps.png','Suaves wraps rellenos de pollo, jamón, queso crema y vegetales frescos. Prácticos, saludables y deliciosos.'),(5,11.5,30,'Mini Ciabattas','/uploads/productos/ms-mini-ciabattas.png','Pan ciabatta artesanal con rellenos de jamón serrano, queso, rúcula y tomate seco. ¡Una combinación irresistible!'),(6,5,31,'Pollo','/uploads/productos/me-pollo.png','Una selección de mini empanadas rellenas con jugoso pollo desmenuzado, sazonado con especias y un toque de cebolla.'),(6,5,32,'Queso','/uploads/productos/me-queso.png','Deliciosas empanadas rellenas de queso fundido, cremosas por dentro y doradas por fuera.'),(6,5,33,'Carne','/uploads/productos/me-carne.png','Rellenas con carne molida sazonada, cebolla, ajíes y especias. ¡El sabor tradicional que te encantará!'),(6,5,34,'Espinaca y Queso','/uploads/productos/me-espinaca-y-queso.png','Una combinación perfecta de espinaca fresca y queso derretido, envuelta en una masa crujiente y doradita.'),(6,5,35,'Jamón y Queso','/uploads/productos/me-jamon-y-queso.png','Suaves mini empanadas rellenas de jamón cocido y queso derretido. Clásicas y deliciosas.'),(6,5,36,'Champiñones','/uploads/productos/me-champinones.png','Rellenas de champiñones salteados con cebolla, ajo y un toque de crema. ¡Delicadas y llenas de sabor!'),(7,2.5,37,'Clásico','/uploads/productos/a-clasico.png','Delicadas tapitas artesanales con un suave relleno de dulce de leche y un toque de azúcar en polvo.'),(7,3,38,'Chocolate','/uploads/productos/a-chocolate.png','Exquisitas tapitas de cacao con un relleno cremoso de dulce de leche, bañadas en chocolate semiamargo.'),(7,2.5,39,'Coco','/uploads/productos/a-coco.png','Tiernas tapitas rellenas de dulce de leche y cubiertas con baño de chocolate blanco y coco rallado.'),(7,3.5,40,'Manjar y Nueces','/uploads/productos/a-manjar-y-nueces.png','Relleno de manjar blanco cremoso y bordes cubiertos con crocantes nueces picadas.'),(7,3,41,'Chocolate Blanco','/uploads/productos/a-chocolate-blanco.png','Relleno de dulce de leche cubierto con chocolate blanco y delicadas lineas de chocolate oscuro.'),(7,2.5,42,'Colores','/uploads/productos/a-colores.png','Clásico alfajor relleno de dulce de leche y decorado con coloridos granitos que lo hacen irresistible.'),(8,1.5,43,'Clásicas','/uploads/productos/t-clasicas.png','Deliciosas trufas de chocolate semi amargo con un interior suave y cremoso. El clásico que nunca pasa de moda.'),(8,1.5,44,'Fresa','/uploads/productos/t-fresa.png','Chocolate negro relleno de una suave crema de fresa natural. Dulces, frutales y absolutamente irresistibles.'),(8,2,45,'Oreo','/uploads/productos/t-oreo.png','Combinación perfecta de chocolate blanco y galletas Oreo. Cremosas, crujientes y llenas de sabor.'),(8,1.5,46,'Maracuyá','/uploads/productos/t-maracuya.png','Chocolate blanco con un corazón cremoso de maracuyá. Dulce, tropical y refrescante.'),(8,2.5,47,'Chocolate Belga','/uploads/productos/t-chocolate-belga.png','Intenso chocolate belga con un interior suave y sedoso. Para los verdaderos amantes del chocolate.'),(8,1.5,48,'Coco','/uploads/productos/t-coco.png','Chocolate blanco con un delicado relleno de coco. Suaves, cremosas y con un toque exótico.'),(9,6,49,'Mini 3 Leches Clásico','/uploads/productos/pf-mini-3-leches-clasico.png','Suave bizcocho bañado en tres leches con crema chantilly y un toque de canela.'),(9,6.5,50,'3 Leches de Chocolate','/uploads/productos/pf-mini-3-leches-de-chocolate.png','Delicioso bizcocho de chocolate con tres leches, crema chantilly y virutas de chocolate.'),(9,6.5,51,'3 Leches de Fresa','/uploads/productos/pf-mini-3-leches-de-fresa.png','Esponjoso bizcocho de vainilla con tres leches, crema chantilly y cubierta de fresa natural.'),(9,6.5,52,'3 Leches de Maracuyá','/uploads/productos/pf-mini-3-leches-de-maracuya.png','Bizcocho bañado en tres leches con crema chantilly y un toque tropical de maracuyá.'),(9,5.5,53,'Vasito Oreo Cream','/uploads/productos/pf-vasito-de-oreo-cream.png','Copas de crema de vainilla y trocitos de Oreo sobre base de chocolate húmedo.'),(9,5.5,54,'Vasito Fresa y Chantilly','/uploads/productos/pf-vasito-de-fresa-y-chantilly.png','Fresas frescas con crema chantilly y suave bizcocho de vanilla.'),(10,4.5,55,'Chocolate','/uploads/productos/c-chocolate.jpg','Bizcocho de vainilla, chocolate o red velvet con betún de mantequilla o chocolate y chispas de azúcar.'),(10,4,56,'Vainilla','/uploads/productos/c-vainilla.jpg','Delicioso y suave pastelito de miga fina con un toque de dulzor a chocolate, es ideal para decorar con crema batida y/o fondant. Se pueden utilizar para crear pasteles y postres.'),(10,5,57,'Zanahoria','/uploads/productos/c-zanahoria.jpg','Relleno y decorado con betún de queso crema, mucha nuez y coco rallado.'),(10,4.5,58,'Fresa','/uploads/productos/c-fresa.png','Delicioso y suave pastelito de miga fina con un toque de dulzor a chocolate, es ideal para decorar con crema batida y/o fondant. Se pueden utilizar para crear pasteles y postres.'),(10,5,59,'Oreo','/uploads/productos/c-oreo.png','Relleno y decorado con betún de queso crema, mucha nuez y coco rallado.'),(10,5,60,'Arándano','/uploads/productos/c-arandano.png','Delicioso y suave pastelito de miga fina con un toque de dulzor a chocolate, es ideal para decorar con crema batida y/o fondant. Se pueden utilizar para crear pasteles y postres.');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_variantes`
--

DROP TABLE IF EXISTS `producto_variantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_variantes` (
  `pro_id_fk` int DEFAULT NULL,
  `var_id` int NOT NULL AUTO_INCREMENT,
  `var_precio_adicional` double DEFAULT NULL,
  `var_nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`var_id`),
  KEY `FKa2sbwi1bdwkhfxwiy1y757tva` (`pro_id_fk`),
  CONSTRAINT `FKa2sbwi1bdwkhfxwiy1y757tva` FOREIGN KEY (`pro_id_fk`) REFERENCES `producto` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_variantes`
--

LOCK TABLES `producto_variantes` WRITE;
/*!40000 ALTER TABLE `producto_variantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `producto_variantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `rol_descripcion` varchar(25) NOT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Cliente'),(2,'Admin');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `rol_id_fk` int DEFAULT NULL,
  `usu_id` int NOT NULL AUTO_INCREMENT,
  `reset_token_expiry` datetime(6) DEFAULT NULL,
  `usu_telefono` varchar(20) DEFAULT NULL,
  `usu_apellido` varchar(100) DEFAULT NULL,
  `usu_nombre` varchar(100) NOT NULL,
  `usu_correo` varchar(150) NOT NULL,
  `reset_token` varchar(200) DEFAULT NULL,
  `usu_contrasena` varchar(255) NOT NULL,
  `usu_fecha_nacimiento` date DEFAULT NULL,
  `usu_fecha_registro` datetime(6) DEFAULT NULL,
  `usu_genero` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`usu_id`),
  UNIQUE KEY `UK8kqitavudrjll3kpaisfvx3dc` (`usu_correo`),
  KEY `FKejbksny8rr466jadbmtcdh7g7` (`rol_id_fk`),
  CONSTRAINT `FKejbksny8rr466jadbmtcdh7g7` FOREIGN KEY (`rol_id_fk`) REFERENCES `rol` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,5,NULL,'234890654','Nieves','Maria','maria@gmail.com',NULL,'$2a$10$7jIvbWPB0fPH44efEuXTxO9YSfOeFQvevWkFCxeA0Y2UXDx6f.3HK','2004-04-09','2026-06-14 01:15:13.424708','Femenino'),(1,6,NULL,NULL,'Acuña','Oscar','oscar123@gmail.com',NULL,'$2a$10$MeyxIHyAxkEdSGw3JT81R./YJMg4kpQqJTom5vWmm19hlf09E5vIC',NULL,'2026-06-14 06:25:03.158479',NULL),(2,7,NULL,NULL,'Sistema','Admin','admin@gmail.com',NULL,'$2a$10$kQXmwJ3qkhotpk7L1b4He.8arNcokPzlUDzaGGc8rul.FYv4Xcye6',NULL,'2026-07-11 23:38:52.273729',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_direccion`
--

DROP TABLE IF EXISTS `usuario_direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_direccion` (
  `es_principal` bit(1) NOT NULL,
  `usu_id_fk` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `distrito` varchar(100) DEFAULT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKaelxb6ivavm60f4vffli3snel` (`usu_id_fk`),
  CONSTRAINT `FKaelxb6ivavm60f4vffli3snel` FOREIGN KEY (`usu_id_fk`) REFERENCES `usuario` (`usu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_direccion`
--

LOCK TABLES `usuario_direccion` WRITE;
/*!40000 ALTER TABLE `usuario_direccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_metodo_pago`
--

DROP TABLE IF EXISTS `usuario_metodo_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_metodo_pago` (
  `es_principal` bit(1) NOT NULL,
  `usu_id_fk` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ultimos_digitos` varchar(10) DEFAULT NULL,
  `alias` varchar(80) NOT NULL,
  `banco` varchar(80) DEFAULT NULL,
  `titular` varchar(100) DEFAULT NULL,
  `tipo` enum('BANCO','VISA','YAPE') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKe2b16rg7qwoorf1xvhc1gwr1g` (`usu_id_fk`),
  CONSTRAINT `FKe2b16rg7qwoorf1xvhc1gwr1g` FOREIGN KEY (`usu_id_fk`) REFERENCES `usuario` (`usu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_metodo_pago`
--

LOCK TABLES `usuario_metodo_pago` WRITE;
/*!40000 ALTER TABLE `usuario_metodo_pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_metodo_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'reposteria'
--

--
-- Dumping routines for database 'reposteria'
--
/*!50003 DROP PROCEDURE IF EXISTS `drop_column_if_exists` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `drop_column_if_exists`(IN tbl VARCHAR(64), IN col VARCHAR(64))
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = tbl
          AND COLUMN_NAME = col
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', tbl, '` DROP COLUMN `', col, '`');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-11  19:16:00