import React, { useState, useEffect } from 'react';
import logoPrincipal from '../../assets/logo.png';
import iconShop from '../../assets/icon-shop.png';
import dividerTitle from '../../assets/divider-title.png';
import dividerSub from '../../assets/divider-subtitle.png';
import dividerProduct from '../../assets/divider-product.png';
import iconOferta from '../../assets/icon-oferta.png';

// ICONOS
import iconEntremets from '../../assets/icon-entremets.png';
import iconTortas from '../../assets/icon-tortas-clasicas.png';
import iconGalletas from '../../assets/icon-galletas.png';
import iconTequenos from '../../assets/icon-tequenos.png';
import iconSandwiches from '../../assets/icon-mini-sandwiches.png';
import iconEmpanadas from '../../assets/icon-mini-empanadas.png';
import iconAlfajores from '../../assets/icon-alfajores.png';
import iconTrufas from '../../assets/icon-trufas.png';
import iconPostres from '../../assets/icon-postres-frios.png';
import iconCupcakes from '../../assets/icon-cupcakes.png';
import { resolverImagenProducto, onImgErrorFallback } from '../../utils/imagenProducto';

// IMÁGENES LOCALES (fallback mientras la BD no tenga imagenUrl reales subidas)
// ENTREMETS
import imgELimon from '../../assets/products/e-limon.png';
import imgEGlaseadoEspejo from '../../assets/products/e-glaseado-espejo.png';
import imgEFresa from '../../assets/products/e-fresa.png';
import imgEMora from '../../assets/products/e-mora.png';
import imgECoco from '../../assets/products/e-coco.png';
import imgEMiniEntremets from '../../assets/products/e-mini-entremets.png';

// TORTAS CLASICAS
import imgTcTripleChocolate from '../../assets/products/tc-triple-chocolate.png';
import imgTcVainillaConFrutas from '../../assets/products/tc-vainilla-con-frutas.png';
import imgTcZanahoria from '../../assets/products/tc-zanahoria.png';
import imgTcRedVelvet from '../../assets/products/tc-red-velvet.png';
import imgTcChocolate from '../../assets/products/tc-chocolate.png';
import imgTcMaracuya from '../../assets/products/tc-maracuya.png';

// GALLETAS
import imgGFresa from '../../assets/products/g-fresa.jpg';
import imgGPina from '../../assets/products/g-pina.jpg';
import imgGManzana from '../../assets/products/g-manzana.jpg';
import imgGChocolate from '../../assets/products/g-chocolate.png';
import imgGAvenaYPasas from '../../assets/products/g-avena-y-pasas.png';
import imgGPersonalizadas from '../../assets/products/g-personalizadas.jpg';

// TEQUENOS VARIADOS
import imgTvPollo from '../../assets/products/tv-pollo.png';
import imgTvClasicos from '../../assets/products/tv-clasicos.png';
import imgTvQuesoGouda from '../../assets/products/tv-queso-gouda.png';
import imgTvGuayabaYQueso from '../../assets/products/tv-guayaba-y-queso.png';
import imgTvJamonYQueso from '../../assets/products/tv-jamon-y-queso.png';
import imgTvNuttela from '../../assets/products/tv-nuttela.png';

// MINI SANDWICHES
import imgMsMiniSandwichesGourmet from '../../assets/products/ms-mini-sandwiches-gourmet.png';
import imgMsMiniCroissantsRellenos from '../../assets/products/ms-mini-croissants-rellenos.png';
import imgMsMiniSandwichesDelipe from '../../assets/products/ms-mini-sandwiches-delipe.png';
import imgMsMiniBaguettas from '../../assets/products/ms-mini-baguettas.png';
import imgMsMiniWraps from '../../assets/products/ms-mini-wraps.png';
import imgMsMiniCiabattas from '../../assets/products/ms-mini-ciabattas.png';

// MINI EMPANADAS
import imgMePollo from '../../assets/products/me-pollo.png';
import imgMeQueso from '../../assets/products/me-queso.png';
import imgMeCarne from '../../assets/products/me-carne.png';
import imgMeEspinacaYQueso from '../../assets/products/me-espinaca-y-queso.png';
import imgMeJamonYQueso from '../../assets/products/me-jamon-y-queso.png';
import imgMeChampinones from '../../assets/products/me-champinones.png';

// ALFAJORES
import imgAClasico from '../../assets/products/a-clasico.png';
import imgAChocolate from '../../assets/products/a-chocolate.png';
import imgACoco from '../../assets/products/a-coco.png';
import imgAManjarYNueces from '../../assets/products/a-manjar-y-nueces.png';
import imgAChocolateBlanco from '../../assets/products/a-chocolate-blanco.png';
import imgAColores from '../../assets/products/a-colores.png';

// TRUFAS
import imgTClasicas from '../../assets/products/t-clasicas.png';
import imgTFresa from '../../assets/products/t-fresa.png';
import imgTOreo from '../../assets/products/t-oreo.png';
import imgTMaracuya from '../../assets/products/t-maracuya.png';
import imgTChocolateBelga from '../../assets/products/t-chocolate-belga.png';
import imgTCoco from '../../assets/products/t-coco.png';

// POSTRES FRIOS
import imgPfMini3LechesClasico from '../../assets/products/pf-mini-3-leches-clasico.png';
import imgPfMini3LechesDeChocolate from '../../assets/products/pf-mini-3-leches-de-chocolate.png';
import imgPfMini3LechesDeFresa from '../../assets/products/pf-mini-3-leches-de-fresa.png';
import imgPfMini3LechesDeMaracuya from '../../assets/products/pf-mini-3-leches-de-maracuya.png';
import imgPfVasitoDeOreoCream from '../../assets/products/pf-vasito-de-oreo-cream.png';
import imgPfVasitoDeFresaYChantilly from '../../assets/products/pf-vasito-de-fresa-y-chantilly.png';

// CUPCAKES
import imgCChocolate from '../../assets/products/c-chocolate.jpg';
import imgCVainilla from '../../assets/products/c-vainilla.jpg';
import imgCZanahoria from '../../assets/products/c-zanahoria.jpg';
import imgCFresa from '../../assets/products/c-fresa.png';
import imgCOreo from '../../assets/products/c-oreo.png';
import imgCArandano from '../../assets/products/c-arandano.png';

// URL base del backend (donde vive /uploads y /api)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

// ─────────────────────────────────────────────────────────────────────────
// Configuración de categorías: id real (cat_id) <-> clave del frontend
// IMPORTANTE: estos ids deben coincidir con los cat_id generados al insertar
// en la tabla `categoria` (1=Entremets, 2=Tortas Clásicas, ... 10=Cupcakes)
// ─────────────────────────────────────────────────────────────────────────
const CATEGORIAS_CONFIG = [
  { catId: 1,  clave: 'entremets',  nombre: 'Entremets',        icono: iconEntremets,  titulo: 'ENTREMETS' },
  { catId: 2,  clave: 'tortas',     nombre: 'Tortas Clásicas',  icono: iconTortas,     titulo: 'TORTAS CLÁSICAS' },
  { catId: 3,  clave: 'galletas',   nombre: 'Galletas',         icono: iconGalletas,   titulo: 'GALLETAS' },
  { catId: 4,  clave: 'tequenos',   nombre: 'Tequeños',         icono: iconTequenos,   titulo: 'TEQUEÑOS VARIADOS' },
  { catId: 5,  clave: 'sandwiches', nombre: 'Mini Sandwiches',  icono: iconSandwiches, titulo: 'MINI SANDWICHES' },
  { catId: 6,  clave: 'empanadas',  nombre: 'Mini Empanadas',   icono: iconEmpanadas,  titulo: 'MINI EMPANADAS', col: undefined },
  { catId: 7,  clave: 'alfajores',  nombre: 'Alfajores',        icono: iconAlfajores,  titulo: 'ALFAJORES' },
  { catId: 8,  clave: 'trufas',     nombre: 'Trufas',           icono: iconTrufas,     titulo: 'TRUFAS' },
  { catId: 9,  clave: 'postres',    nombre: 'Postres Fríos',    icono: iconPostres,    titulo: 'POSTRES FRÍOS', col: '2 / 3' },
  { catId: 10, clave: 'cupcakes',   nombre: 'Cupcakes',         icono: iconCupcakes,   titulo: 'CUPCAKES', col: '3 / 4' },
];

// ─────────────────────────────────────────────────────────────────────────
// Fallback de imágenes locales por categoría, en el mismo orden en que se
// insertaron los productos en el SQL (poblar_productos.sql). Se usa solo si
// el producto no tiene imagenUrl válido o la imagen no carga.
// ─────────────────────────────────────────────────────────────────────────
const IMAGENES_FALLBACK = {
  entremets:  [imgELimon, imgEGlaseadoEspejo, imgEFresa, imgEMora, imgECoco, imgEMiniEntremets],
  tortas:     [imgTcTripleChocolate, imgTcVainillaConFrutas, imgTcZanahoria, imgTcRedVelvet, imgTcChocolate, imgTcMaracuya],
  galletas:   [imgGFresa, imgGPina, imgGManzana, imgGChocolate, imgGAvenaYPasas, imgGPersonalizadas],
  tequenos:   [imgTvPollo, imgTvClasicos, imgTvQuesoGouda, imgTvGuayabaYQueso, imgTvJamonYQueso, imgTvNuttela],
  sandwiches: [imgMsMiniSandwichesGourmet, imgMsMiniCroissantsRellenos, imgMsMiniSandwichesDelipe, imgMsMiniBaguettas, imgMsMiniWraps, imgMsMiniCiabattas],
  empanadas:  [imgMePollo, imgMeQueso, imgMeCarne, imgMeEspinacaYQueso, imgMeJamonYQueso, imgMeChampinones],
  alfajores:  [imgAClasico, imgAChocolate, imgACoco, imgAManjarYNueces, imgAChocolateBlanco, imgAColores],
  trufas:     [imgTClasicas, imgTFresa, imgTOreo, imgTMaracuya, imgTChocolateBelga, imgTCoco],
  postres:    [imgPfMini3LechesClasico, imgPfMini3LechesDeChocolate, imgPfMini3LechesDeFresa, imgPfMini3LechesDeMaracuya, imgPfVasitoDeOreoCream, imgPfVasitoDeFresaYChantilly],
  cupcakes:   [imgCChocolate, imgCVainilla, imgCZanahoria, imgCFresa, imgCOreo, imgCArandano],
};

// ==============================================================================
// CATÁLOGO DE RESPALDO
// Si el backend está apagado, la app cargará esto para que no se rompa el diseño
// ==============================================================================
const CATALOGO_ESTATICO = {
  entremets: [
    { id: 'e1', nombre: "Limón", descripcion: "Suave entremet de limón con un corazón de curd de limón y un bizzocho de vainilla ligero y esponjoso.", precio: "12.00", img: imgELimon },
    { id: 'e2', nombre: "Glaseado Espejo", descripcion: "Elegante entremet con mousse de frutos del bosque y un interior de crema de vainilla con mermelada de arándanos.", precio: "12.00", img: imgEGlaseadoEspejo },
    { id: 'e3', nombre: "Fresa", descripcion: "Fusión perfecta de mousse de fresa cremosa y un interior suave de vainilla con gelée de fresa natural.", precio: "12.00", img: imgEFresa },
    { id: 'e4', nombre: "Mora", descripcion: "Exquisito entremet de mora con mousse ligera y un corazón de gel de mora silvestre sobre bizcocho de chocolate.", precio: "12.00", img: imgEMora },
    { id: 'e5', nombre: "Coco", descripcion: "Delicado entremet de coco con relleno tropical de maracuyá y bizcocho de vainilla húmedo.", precio: "12.00", img: imgECoco },
    { id: 'e6', nombre: "Mini Entremets", descripcion: "Pequeños corazones de mousse y gelatina en diferentes sabores. Ideales para detalles únicos y celebraciones especiales.", precio: "15.00", img: imgEMiniEntremets },
  ],
  tortas: [
    { id: 'tc1', nombre: "Triple Chocolate", descripcion: "Delicioso bizcocho de chocolate con relleno y cobertura de ganache, decorado con crema de chocolate.", precio: "45.00", img: imgTcTripleChocolate },
    { id: 'tc2', nombre: "Vainilla con Frutas", descripcion: "Bizcocho de vainilla esponjoso con relleno de crema chantilly y frutas frescas de temporada.", precio: "40.00", img: imgTcVainillaConFrutas },
    { id: 'tc3', nombre: "Zanahoria", descripcion: "Húmeda torta de zanahoria con nueces y pasas, cubierta con frosting de queso crema.", precio: "38.00", img: imgTcZanahoria },
    { id: 'tc4', nombre: "Red Velvet", descripcion: "Clásica torta red velvet con capas de bizcocho rojo y frosting de queso crema.", precio: "42.00", img: imgTcRedVelvet },
    { id: 'tc5', nombre: "Chocolate", descripcion: "Bizcocho de chocolate intenso con relleno y cobertura de ganache de chocolate belga.", precio: "35.00", img: imgTcChocolate },
    { id: 'tc6', nombre: "Maracuyá", descripcion: "Suave bizcocho de vainilla con mousse de maracuyá y cobertura de pulpa natural.", precio: "38.00", img: imgTcMaracuya },
  ],
  galletas: [
    { id: 'g1', nombre: "Fresa", descripcion: "Deliciosas galletas de fresa con copos de avena, mermelada en figuras y un toque de vainilla.", precio: "3.50", img: imgGFresa },
    { id: 'g2', nombre: "Piña", descripcion: "Galletas deliciosas de piña, avena, bañadas en una crema de coco y vainilla para disfrutar el paladar.", precio: "3.50", img: imgGPina },
    { id: 'g3', nombre: "Manzana", descripcion: "Deliciosas galletas de manzana, vainilla, nuez, almendras y avena bañadas en crema de caramelo.", precio: "3.50", img: imgGManzana },
    { id: 'g4', nombre: "Chocolate", descripcion: "Galletas deliciosas de piña, avena, bañadas en una crema de coco y vainilla para disfrutar el paladar.", precio: "4.00", img: imgGChocolate },
    { id: 'g5', nombre: "Avena y Pasas", descripcion: "Deliciosas galletas de manzana, vainilla, nuez, almendras y avena bañadas en crema de caramelo.", precio: "3.50", img: imgGAvenaYPasas },
    { id: 'g6', nombre: "Personalizadas", descripcion: "Galletas artesanales personalizadas, decoradas con diseños únicos ideales para eventos.", precio: "5.00", img: imgGPersonalizadas },
  ],
  tequenos: [
    { id: 'tv1', nombre: "Pollo", descripcion: "Deliciosos tequeños rellenos de pollo desmechado con un toque de especias. ¡Irresistibles!", precio: "8.00", img: imgTvPollo },
    { id: 'tv2', nombre: "Clásicos", descripcion: "La receta tradicional que nunca falla. Rellenos de queso blanco llanero, crujientes por fuera.", precio: "7.00", img: imgTvClasicos },
    { id: 'tv3', nombre: "Queso Gouda", descripcion: "Rellenos con cremoso queso gouda que se derrite perfectamente, creando un sabor suave.", precio: "9.00", img: imgTvQuesoGouda },
    { id: 'tv4', nombre: "Guayaba y Queso", descripcion: "La combinación perfecta entre lo dulce y lo salado. Queso blanco llanero con dulce de guayaba.", precio: "8.50", img: imgTvGuayabaYQueso },
    { id: 'tv5', nombre: "Jamón y Queso", descripcion: "Rellenos de jamón de calidad y queso derretido. Un clásico que siempre encanta.", precio: "8.50", img: imgTvJamonYQueso },
    { id: 'tv6', nombre: "Nutella", descripcion: "Para los amantes de lo dulce. Rellenos de Nutella cremosa y envueltos en nuestra masa crujiente.", precio: "9.50", img: imgTvNuttela },
  ],
  sandwiches: [
    { id: 'ms1', nombre: "Gourmet", descripcion: "Una selección de delgados mini sándwiches elaborados con ingredientes gourmet. ¡Perfectos!", precio: "10.00", img: imgMsMiniSandwichesGourmet },
    { id: 'ms2', nombre: "Croissants Rellenos", descripcion: "Crujientes mini croissants rellenos de queso, jamón, tomate y lechuga fresca.", precio: "12.00", img: imgMsMiniCroissantsRellenos },
    { id: 'ms3', nombre: "Delipe", descripcion: "Una selección de mágicos mini sándwiches elaborados con ingredientes premium.", precio: "9.00", img: imgMsMiniSandwichesDelipe },
    { id: 'ms4', nombre: "Mini Baguettas", descripcion: "Mini baguettes rellenas de pollo, jamón, queso, lechuga, tomate y aderezos suaves.", precio: "11.00", img: imgMsMiniBaguettas },
    { id: 'ms5', nombre: "Mini Wraps", descripcion: "Suaves wraps rellenos de pollo, jamón, queso crema y vegetales frescos.", precio: "10.50", img: imgMsMiniWraps },
    { id: 'ms6', nombre: "Mini Ciabattas", descripcion: "Pan ciabatta artesanal con rellenos de jamón serrano, queso, rúcula y tomate seco.", precio: "11.50", img: imgMsMiniCiabattas },
  ],
  empanadas: [
    { id: 'me1', nombre: "Pollo", descripcion: "Una selección de mini empanadas rellenas con jugoso pollo desmenuzado y especias.", precio: "5.00", img: imgMePollo },
    { id: 'me2', nombre: "Queso", descripcion: "Deliciosas empanadas rellenas de queso fundido, cremosas por dentro y doradas por fuera.", precio: "5.00", img: imgMeQueso },
    { id: 'me3', nombre: "Carne", descripcion: "Rellenas con carne molida sazonada, cebolla, ajíes y especias. ¡Sabor tradicional!", precio: "5.00", img: imgMeCarne },
    { id: 'me4', nombre: "Espinaca y Queso", descripcion: "Una combinación perfecta de espinaca fresca y queso derretido en masa crujiente.", precio: "5.00", img: imgMeEspinacaYQueso },
    { id: 'me5', nombre: "Jamón y Queso", descripcion: "Suaves mini empanadas rellenas de jamón cocido y queso derretido. Clásicas y deliciosas.", precio: "5.00", img: imgMeJamonYQueso },
    { id: 'me6', nombre: "Champiñones", descripcion: "Rellenas de champiñones salteados con cebolla, ajo y crema. ¡Llenas de sabor!", precio: "5.00", img: imgMeChampinones },
  ],
  alfajores: [
    { id: 'a1', nombre: "Clásico", descripcion: "Delicadas tapitas artesanales con un suave relleno de dulce de leche y un toque de azúcar en polvo.", precio: "2.50", img: imgAClasico },
    { id: 'a2', nombre: "Chocolate", descripcion: "Exquisitas tapitas de cacao con un relleno cremoso de dulce de leche, bañadas en chocolate.", precio: "3.00", img: imgAChocolate },
    { id: 'a3', nombre: "Coco", descripcion: "Tiernas tapitas rellenas de dulce de leche y cubiertas con baño de chocolate blanco y coco.", precio: "2.50", img: imgACoco },
    { id: 'a4', nombre: "Manjar y Nueces", descripcion: "Relleno de manjar blanco cremoso y bordes cubiertos con crocantes nueces picadas.", precio: "3.50", img: imgAManjarYNueces },
    { id: 'a5', nombre: "Chocolate Blanco", descripcion: "Relleno de dulce de leche cubierto con chocolate blanco y lineas de chocolate oscuro.", precio: "3.00", img: imgAChocolateBlanco },
    { id: 'a6', nombre: "Colores", descripcion: "Clásico alfajor relleno de dulce de leche y decorado con coloridos granitos.", precio: "2.50", img: imgAColores },
  ],
  trufas: [
    { id: 't1', nombre: "Clásicas", descripcion: "Deliciosas trufas de chocolate semi amargo con un interior suave y cremoso.", precio: "1.50", img: imgTClasicas },
    { id: 't2', nombre: "Fresa", descripcion: "Chocolate negro relleno de una suave crema de fresa natural. Dulces e irresistibles.", precio: "1.50", img: imgTFresa },
    { id: 't3', nombre: "Oreo", descripcion: "Combinación perfecta de chocolate blanco y galletas Oreo. Cremosas y crujientes.", precio: "2.00", img: imgTOreo },
    { id: 't4', nombre: "Maracuyá", descripcion: "Chocolate blanco con un corazón cremoso de maracuyá. Dulce, tropical y refrescante.", precio: "1.50", img: imgTMaracuya },
    { id: 't5', nombre: "Chocolate Belga", descripcion: "Intenso chocolate belga con un interior suave y sedoso. Para verdaderos amantes del cacao.", precio: "2.50", img: imgTChocolateBelga },
    { id: 't6', nombre: "Coco", descripcion: "Chocolate blanco con un delicado relleno de coco. Suaves, cremosas y exóticas.", precio: "1.50", img: imgTCoco },
  ],
  postres: [
    { id: 'pf1', nombre: "Mini 3 Leches Clásico", descripcion: "Suave bizcocho bañado en tres leches con crema chantilly y un toque de canela.", precio: "6.00", img: imgPfMini3LechesClasico },
    { id: 'pf2', nombre: "3 Leches de Chocolate", descripcion: "Delicioso bizcocho de chocolate con tres leches, crema chantilly y virutas.", precio: "6.50", img: imgPfMini3LechesDeChocolate },
    { id: 'pf3', nombre: "3 Leches de Fresa", descripcion: "Esponjoso bizcocho de vainilla con tres leches, crema chantilly y cubierta de fresa natural.", precio: "6.50", img: imgPfMini3LechesDeFresa },
    { id: 'pf4', nombre: "3 Leches de Maracuyá", descripcion: "Bizcocho bañado en tres leches con crema chantilly y un toque tropical de maracuyá.", precio: "6.50", img: imgPfMini3LechesDeMaracuya },
    { id: 'pf5', nombre: "Vasito Oreo Cream", descripcion: "Copas de crema de vainilla y trocitos de Oreo sobre base de chocolate húmedo.", precio: "5.50", img: imgPfVasitoDeOreoCream },
    { id: 'pf6', nombre: "Vasito Fresa y Chantilly", descripcion: "Fresas frescas con crema chantilly y suave bizcocho de vanilla.", precio: "5.50", img: imgPfVasitoDeFresaYChantilly },
  ],
  cupcakes: [
    { id: 'c1', nombre: "Chocolate", descripcion: "Bizcocho con betún de mantequilla o chocolate y chispas de azúcar.", precio: "4.50", img: imgCChocolate },
    { id: 'c2', nombre: "Vainilla", descripcion: "Suave pastelito de miga fina con un toque de dulzor, ideal para decorar con crema batida.", precio: "4.00", img: imgCVainilla },
    { id: 'c3', nombre: "Zanahoria", descripcion: "Relleno y decorado con betún de queso crema, mucha nuez y coco rallado.", precio: "5.00", img: imgCZanahoria },
    { id: 'c4', nombre: "Fresa", descripcion: "Bizcocho con un toque de dulzor a fresa natural y crema batida.", precio: "4.50", img: imgCFresa },
    { id: 'c5', nombre: "Oreo", descripcion: "Relleno y decorado con betún de queso crema y trozos de galleta oreo.", precio: "5.00", img: imgCOreo },
    { id: 'c6', nombre: "Arándano", descripcion: "Pastelito de vainilla con arándanos frescos y crema suave.", precio: "5.00", img: imgCArandano },
  ]
};

const Productos = ({ setPage }) => {
  const [categoriaActiva, setCategoriaActiva] = useState('empanadas');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState(() => sessionStorage.getItem('busquedaProductos') || '');

  // cantidades por producto (id -> cantidad)
  const [cantidades, setCantidades] = useState({});

  // NUEVO: set de IDs de productos marcados como favoritos
  const [favoritos, setFavoritos] = useState(() => {
    // Inicializar desde sessionStorage para persistencia entre páginas
    try {
      const saved = sessionStorage.getItem('favoritos_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        const resp = await fetch(`${API_BASE}/api/productos`);
        if (!resp.ok) throw new Error('Falló el backend');
        const data = await resp.json();
        setProductos(data);
        setError(null);
      } catch (err) {
        console.warn('Backend inactivo, cargando catálogo estático de respaldo para maquetación...');
        
        // INYECCIÓN DE EMERGENCIA: Mapeamos el catálogo al formato del backend
        let datosDeRespaldo = [];
        CATEGORIAS_CONFIG.forEach(catConfig => {
          const itemsEstaticos = CATALOGO_ESTATICO[catConfig.clave];
          if (itemsEstaticos) {
            itemsEstaticos.forEach(item => {
              datosDeRespaldo.push({
                id: item.id, // ID estático
                nombre: item.nombre,
                descripcion: item.descripcion,
                precio: parseFloat(item.precio),
                imagenUrl: null, // Forzamos a que use las imágenes locales
                imagenLocalDirecta: item.img, // Pasamos la foto directamente
                categoria: { id: catConfig.catId } // Relacionamos con la categoría correcta
              });
            });
          }
        });

        setProductos(datosDeRespaldo);
        setError(null); // Borramos el error para que deje ver la página
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    const syncBusqueda = () => setBusqueda(sessionStorage.getItem('busquedaProductos') || '');
    window.addEventListener('busquedaProductos', syncBusqueda);
    return () => window.removeEventListener('busquedaProductos', syncBusqueda);
  }, []);

  const limpiarBusqueda = () => {
    sessionStorage.removeItem('busquedaProductos');
    setBusqueda('');
  };

  const obtenerCantidad = (productoId) => cantidades[productoId] ?? 1;

  const cambiarCantidad = (productoId, valor) => {
    const num = parseInt(valor, 10);
    setCantidades((prev) => ({
      ...prev,
      [productoId]: isNaN(num) || num < 1 ? 1 : num,
    }));
  };

  const resolverImagen = (producto, claveCategoria, indice) => {
    if (producto.imagenLocalDirecta) {
      return producto.imagenLocalDirecta;
    }
    const fallbackList = IMAGENES_FALLBACK[claveCategoria];
    const fallback = fallbackList && fallbackList[indice % fallbackList.length]
      ? fallbackList[indice % fallbackList.length]
      : null;
    return resolverImagenProducto(producto.imagenUrl, fallback);
  };

  const handleComprar = async (producto) => {
    const cantidad = obtenerCantidad(producto.id);
    const token = sessionStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/api/carrito/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productoId: producto.id,
          cantidad: cantidad,
        }),
      });

      if (!resp.ok) throw new Error('No se pudo agregar al carrito');

      alert(`"${producto.nombre}" agregado al carrito (x${cantidad}).`);
    } catch (err) {
      console.error('Error agregando al carrito:', err);
      alert('Ocurrió un error al agregar el producto al carrito.');
    }
  };

  // NUEVO: Toggle favorito — llama al backend y actualiza estado local
  const toggleFavorito = async (producto) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para guardar favoritos.');
      return;
    }
    const esFavorito = favoritos.has(producto.id);

    // Actualizar estado local inmediatamente (optimista)
    setFavoritos(prev => {
      const nuevo = new Set(prev);
      if (esFavorito) nuevo.delete(producto.id);
      else nuevo.add(producto.id);
      
      sessionStorage.setItem('favoritos_ids', JSON.stringify([...nuevo]));
      // Notificar a Perfil5.js para que recargue la lista al instante
      window.dispatchEvent(new Event('favoritosUpdated'));
      return nuevo;
    });

    try {
      if (esFavorito) {
        // Quitar de favoritos
        await fetch(`${API_BASE}/api/favoritos/${producto.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Agregar a favoritos
        await fetch(`${API_BASE}/api/favoritos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productoId: producto.id }),
        });
      }
    } catch {
      // Si falla el backend, revertir el cambio local
      setFavoritos(prev => {
        const revertido = new Set(prev);
        if (esFavorito) revertido.add(producto.id);
        else revertido.delete(producto.id);
        sessionStorage.setItem('favoritos_ids', JSON.stringify([...revertido]));
        return revertido;
      });
    }
  };

  const categoriaActivaConfig = CATEGORIAS_CONFIG.find((c) => c.clave === categoriaActiva);
  const q = busqueda.trim().toLowerCase();

  const productosDeCategoria = q
    ? productos.filter((p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q) ||
        (p.categoria?.descripcion || '').toLowerCase().includes(q)
      )
    : productos.filter(
        (p) => p.categoria && p.categoria.id === categoriaActivaConfig?.catId
      );

  return (
    <div style={{ backgroundColor: '#FFEFEF', fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>

      <section style={{ textAlign: 'center', padding: '40px 20px' }}>
        <img src={logoPrincipal} alt="Logo Sweet Cream Rose" style={{ width: '230px', objectFit: 'contain', marginBottom: '15px' }} />
        <h2 style={{ color: '#5A3E41', margin: '10 0 25px 30', fontFamily: 'Poppins-Bold', fontSize: '30px' }}>PRODUCTOS</h2>
        <img src={dividerTitle} alt="divisor" style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 20px auto' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', maxWidth: '850px', margin: '0 auto', justifyContent: 'center' }}>

          {CATEGORIAS_CONFIG.map((cat) => (
            <div
              key={cat.clave}
              onClick={() => { limpiarBusqueda(); setCategoriaActiva(cat.clave); }}
              style={{
                gridColumn: cat.col ? cat.col : 'auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '90px',
                border: '2px solid #DE788E', borderRadius: '10px', padding: '0 15px',
                fontFamily: 'Poppins-SemiBold', cursor: 'pointer', fontWeight: 'bold',
                backgroundColor: categoriaActiva === cat.clave ? '#DE788E' : '#FFEFEF',
                color: categoriaActiva === cat.clave ? 'white' : '#984350',
              }}
            >
              <img
                src={cat.icono}
                alt="Icono"
                style={{
                  width: '60px', height: '60px', objectFit: 'contain',
                  filter: categoriaActiva === cat.clave ? 'brightness(0) invert(1)' : 'none'
                }}
              />
              {cat.nombre}
            </div>
          ))}

        </div>
      </section>

      {categoriaActivaConfig && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', marginTop: '30px', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
            <img src={categoriaActivaConfig.icono} alt={`Icono ${categoriaActivaConfig.titulo}`} style={{ width: '80px', height: '80px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ color: '#5A3E41', fontSize: '40px', fontFamily: 'Poppins-Bold', margin: '0' }}>
                {q ? `RESULTADOS: “${busqueda.trim()}”` : categoriaActivaConfig.titulo}
              </h1>
              {q && (
                <button
                  onClick={limpiarBusqueda}
                  style={{
                    marginTop: 8, alignSelf: 'flex-start', background: 'white',
                    color: '#C3666D', border: '1.5px solid #C3666D', borderRadius: 8,
                    padding: '6px 12px', cursor: 'pointer', fontFamily: 'Poppins-Medium', fontSize: 13
                  }}
                >
                  Limpiar búsqueda
                </button>
              )}
              <img src={dividerSub} alt="Divisor Subtitulo" style={{ width: '100%', height: '26px', marginTop: '-10px', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}

      <main style={{ maxWidth: '1100px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '60px', padding: '0 20px' }}>

        {cargando && (
          <p style={{ textAlign: 'center', color: '#5A3E41', fontFamily: 'Poppins-Medium', fontSize: '18px' }}>
            Cargando productos...
          </p>
        )}

        {!cargando && error && (
          <p style={{ textAlign: 'center', color: '#C3666D', fontFamily: 'Poppins-Medium', fontSize: '18px' }}>
            {error}
          </p>
        )}

        {!cargando && !error && productosDeCategoria.length === 0 && (
          <p style={{ textAlign: 'center', color: '#5A3E41', fontFamily: 'Poppins-Medium', fontSize: '18px' }}>
            {q ? `No encontramos productos para “${busqueda.trim()}”.` : 'Todavía no hay productos en esta categoría.'}
          </p>
        )}

        {!cargando && !error && productosDeCategoria.map((prod, index) => {

          const isEven = index % 2 === 0;
          const imagenSrc = resolverImagen(prod, categoriaActiva, index);
          const cantidad = obtenerCantidad(prod.id);
          const precioOriginal = Number(prod.precio);
          // Estos dos campos ya vienen calculados desde el backend (ProductoController → OfertaService)
          const tieneOferta = prod.tieneOferta === true && prod.precioConDescuento != null;
          const precioConDescuento = tieneOferta ? Number(prod.precioConDescuento) : precioOriginal;
          const descuentoPct = tieneOferta ? Math.round((1 - precioConDescuento / precioOriginal) * 100) : 0;

          return (
            <div key={prod.id} style={{
              display: 'flex',
              flexDirection: isEven ? 'row' : 'row-reverse',
              height: '320px',
              backgroundColor: '#FFEFEF', border: '2px solid #C3666D', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>

              <div style={{ flex: '1.3', position: 'relative' }}>
                {imagenSrc ? (
                  <img
                    src={imagenSrc}
                    alt={prod.nombre}
                    onError={(e) => onImgErrorFallback(e, IMAGENES_FALLBACK[categoriaActiva]?.[index])}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#EAAFB8' }} />
                )}

                {tieneOferta && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: isEven ? '8px' : 'auto',
                    right: isEven ? 'auto' : '8px',
                    width: '88px',
                    height: '88px',
                    backgroundImage: `url(${iconOferta})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontFamily: 'Poppins-Bold',
                    fontSize: '20px',
                  }}>
                    -{descuentoPct}%
                  </div>
                )}
              </div>

              <div style={{ flex: '1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: isEven ? 'left' : 'right' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isEven ? 'row' : 'row-reverse' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isEven ? 'flex-start' : 'flex-end' }}>
                    <h2 style={{ color: '#5A3E41', fontSize: '32px', margin: '0 0 5px 0', fontFamily: 'Poppins-Bold' }}>{prod.nombre}</h2>
                    <img src={dividerProduct} alt="Divisor de Producto" style={{ width: '160px', height: '26px', marginTop: '-5px', objectFit: 'contain' }} />
                  </div>
                  {/* NUEVO CORAZÓN FUNCIONAL */}
                  <div
                    onClick={() => toggleFavorito(prod)}
                    title={favoritos.has(prod.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    style={{ width: '45px', height: '45px', borderRadius: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0px 5px rgba(0,0,0,0.1)', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <i 
                      className={favoritos.has(prod.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                      style={{ color: '#C3666D', fontSize: '24px', marginTop: '2px' }}
                    ></i>
                  </div>
                </div>

                <p style={{ color: '#222', fontSize: '15px', fontFamily: 'Poppins-Medium', lineHeight: '1.6', margin: '10px 0' }}>
                  {prod.descripcion}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isEven ? 'flex-start' : 'flex-end' }}>
                  {tieneOferta ? (
                    <>
                      <span style={{ fontSize: '18px', color: '#999', fontFamily: 'Poltawski-Nowy', textDecoration: 'line-through' }}>S/. {precioOriginal.toFixed(2)}</span>
                      <span style={{ fontSize: '24px', color: '#C3666D', fontFamily: 'Poltawski-Nowy', fontWeight: 'bold' }}>S/. {precioConDescuento.toFixed(2)}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '24px', color: '#5A3E41', fontFamily: 'Poltawski-Nowy' }}>S/. {precioOriginal.toFixed(2)}</span>
                  )}
                  <span style={{ fontSize: '14px', color: '#59423CBA', fontFamily: 'Poppins-Medium' }}>por unidad</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', justifyContent: isEven ? 'flex-start' : 'flex-end' }}>
                  <label style={{ fontSize: '15px', fontFamily: 'Poppins-Medium', color: '#000000' }}>Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => cambiarCantidad(prod.id, e.target.value)}
                    style={{ width: '110px', backgroundColor: '#EAAFB8', border: '1px solid #C3666D', borderRadius: '0px', padding: '5px', color: 'white', fontFamily: 'Poppins-Medium', textAlign: 'center' }}
                  />
                  <button
                    onClick={() => handleComprar(prod)}
                    style={{ backgroundColor: '#C3666D', color: 'white', border: 'none', padding: '6px 26px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Poppins-Medium', fontSize: '15px' }}
                  >
                    Comprar
                  </button>
                </div>
              </div>

            </div>
          );
        })}

      </main>

      <section style={{ backgroundColor: '#FACFD8', padding: '0 70px', margin: '80px auto 0', maxWidth: '940px', height: '175px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ width: '130px', height: '130px', flexShrink: 0, backgroundColor: 'white', border: '4px solid #EAAFB8', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <img src={iconShop} alt="Icono Tienda" style={{ width: '65%', height: 'auto', objectFit: 'contain' }} />
          </div>
          <div>
            <h3 style={{ color: '#7D2530', margin: '0 0 5px 0', fontSize: '22px', fontFamily: 'Poppins-SemiBold' }}>¿No encuentras lo que buscas?</h3>
            <p style={{ margin: '0', color: '#B14B47', fontSize: '19px', fontFamily: 'Signika-Regular', maxWidth: '400px', lineHeight: '1.2' }}>Contáctanos y con gusto te ayudamos a crear el postre perfecto</p>
          </div>
        </div>
        <button 
          onClick={() => setPage('nosotros')} 
          style={{ backgroundColor: '#C3666D', color: 'white', fontSize: '16px', fontFamily: 'Poppins-Bold', border: 'none', padding: '12px 30px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}
        >
          CONTACTAR <span style={{ fontSize: '18px' }}>›</span>
        </button>
      </section>

    </div>
  );
};

export default Productos;