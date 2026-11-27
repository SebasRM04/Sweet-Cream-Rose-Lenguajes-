import { API_BASE } from '../api';

import imgELimon from '../assets/products/e-limon.png';
import imgEGlaseadoEspejo from '../assets/products/e-glaseado-espejo.png';
import imgEFresa from '../assets/products/e-fresa.png';
import imgEMora from '../assets/products/e-mora.png';
import imgECoco from '../assets/products/e-coco.png';
import imgEMiniEntremets from '../assets/products/e-mini-entremets.png';
import imgTcTripleChocolate from '../assets/products/tc-triple-chocolate.png';
import imgTcVainillaConFrutas from '../assets/products/tc-vainilla-con-frutas.png';
import imgTcZanahoria from '../assets/products/tc-zanahoria.png';
import imgTcRedVelvet from '../assets/products/tc-red-velvet.png';
import imgTcChocolate from '../assets/products/tc-chocolate.png';
import imgTcMaracuya from '../assets/products/tc-maracuya.png';
import imgGFresa from '../assets/products/g-fresa.jpg';
import imgGPina from '../assets/products/g-pina.jpg';
import imgGManzana from '../assets/products/g-manzana.jpg';
import imgGChocolate from '../assets/products/g-chocolate.png';
import imgGAvenaYPasas from '../assets/products/g-avena-y-pasas.png';
import imgGPersonalizadas from '../assets/products/g-personalizadas.jpg';
import imgTvPollo from '../assets/products/tv-pollo.png';
import imgTvClasicos from '../assets/products/tv-clasicos.png';
import imgTvQuesoGouda from '../assets/products/tv-queso-gouda.png';
import imgTvGuayabaYQueso from '../assets/products/tv-guayaba-y-queso.png';
import imgTvJamonYQueso from '../assets/products/tv-jamon-y-queso.png';
import imgTvNuttela from '../assets/products/tv-nuttela.png';
import imgMsMiniSandwichesGourmet from '../assets/products/ms-mini-sandwiches-gourmet.png';
import imgMsMiniCroissantsRellenos from '../assets/products/ms-mini-croissants-rellenos.png';
import imgMsMiniSandwichesDelipe from '../assets/products/ms-mini-sandwiches-delipe.png';
import imgMsMiniBaguettas from '../assets/products/ms-mini-baguettas.png';
import imgMsMiniWraps from '../assets/products/ms-mini-wraps.png';
import imgMsMiniCiabattas from '../assets/products/ms-mini-ciabattas.png';
import imgMePollo from '../assets/products/me-pollo.png';
import imgMeQueso from '../assets/products/me-queso.png';
import imgMeCarne from '../assets/products/me-carne.png';
import imgMeEspinacaYQueso from '../assets/products/me-espinaca-y-queso.png';
import imgMeJamonYQueso from '../assets/products/me-jamon-y-queso.png';
import imgMeChampinones from '../assets/products/me-champinones.png';
import imgAClasico from '../assets/products/a-clasico.png';
import imgAChocolate from '../assets/products/a-chocolate.png';
import imgACoco from '../assets/products/a-coco.png';
import imgAManjarYNueces from '../assets/products/a-manjar-y-nueces.png';
import imgAChocolateBlanco from '../assets/products/a-chocolate-blanco.png';
import imgAColores from '../assets/products/a-colores.png';
import imgTClasicas from '../assets/products/t-clasicas.png';
import imgTFresa from '../assets/products/t-fresa.png';
import imgTOreo from '../assets/products/t-oreo.png';
import imgTMaracuya from '../assets/products/t-maracuya.png';
import imgTChocolateBelga from '../assets/products/t-chocolate-belga.png';
import imgTCoco from '../assets/products/t-coco.png';
import imgPfMini3LechesClasico from '../assets/products/pf-mini-3-leches-clasico.png';
import imgPfMini3LechesDeChocolate from '../assets/products/pf-mini-3-leches-de-chocolate.png';
import imgPfMini3LechesDeFresa from '../assets/products/pf-mini-3-leches-de-fresa.png';
import imgPfMini3LechesDeMaracuya from '../assets/products/pf-mini-3-leches-de-maracuya.png';
import imgPfVasitoDeOreoCream from '../assets/products/pf-vasito-de-oreo-cream.png';
import imgPfVasitoDeFresaYChantilly from '../assets/products/pf-vasito-de-fresa-y-chantilly.png';
import imgCChocolate from '../assets/products/c-chocolate.jpg';
import imgCVainilla from '../assets/products/c-vainilla.jpg';
import imgCZanahoria from '../assets/products/c-zanahoria.jpg';
import imgCFresa from '../assets/products/c-fresa.png';
import imgCOreo from '../assets/products/c-oreo.png';
import imgCArandano from '../assets/products/c-arandano.png';

const CATALOGO = {
  'e-limon.png': imgELimon,
  'e-glaseado-espejo.png': imgEGlaseadoEspejo,
  'e-fresa.png': imgEFresa,
  'e-mora.png': imgEMora,
  'e-coco.png': imgECoco,
  'e-mini-entremets.png': imgEMiniEntremets,
  'tc-triple-chocolate.png': imgTcTripleChocolate,
  'tc-vainilla-con-frutas.png': imgTcVainillaConFrutas,
  'tc-zanahoria.png': imgTcZanahoria,
  'tc-red-velvet.png': imgTcRedVelvet,
  'tc-chocolate.png': imgTcChocolate,
  'tc-maracuya.png': imgTcMaracuya,
  'g-fresa.jpg': imgGFresa,
  'g-pina.jpg': imgGPina,
  'g-manzana.jpg': imgGManzana,
  'g-chocolate.png': imgGChocolate,
  'g-avena-y-pasas.png': imgGAvenaYPasas,
  'g-personalizadas.jpg': imgGPersonalizadas,
  'tv-pollo.png': imgTvPollo,
  'tv-clasicos.png': imgTvClasicos,
  'tv-queso-gouda.png': imgTvQuesoGouda,
  'tv-guayaba-y-queso.png': imgTvGuayabaYQueso,
  'tv-jamon-y-queso.png': imgTvJamonYQueso,
  'tv-nuttela.png': imgTvNuttela,
  'ms-mini-sandwiches-gourmet.png': imgMsMiniSandwichesGourmet,
  'ms-mini-croissants-rellenos.png': imgMsMiniCroissantsRellenos,
  'ms-mini-sandwiches-delipe.png': imgMsMiniSandwichesDelipe,
  'ms-mini-baguettas.png': imgMsMiniBaguettas,
  'ms-mini-wraps.png': imgMsMiniWraps,
  'ms-mini-ciabattas.png': imgMsMiniCiabattas,
  'me-pollo.png': imgMePollo,
  'me-queso.png': imgMeQueso,
  'me-carne.png': imgMeCarne,
  'me-espinaca-y-queso.png': imgMeEspinacaYQueso,
  'me-jamon-y-queso.png': imgMeJamonYQueso,
  'me-champinones.png': imgMeChampinones,
  'a-clasico.png': imgAClasico,
  'a-chocolate.png': imgAChocolate,
  'a-coco.png': imgACoco,
  'a-manjar-y-nueces.png': imgAManjarYNueces,
  'a-chocolate-blanco.png': imgAChocolateBlanco,
  'a-colores.png': imgAColores,
  't-clasicas.png': imgTClasicas,
  't-fresa.png': imgTFresa,
  't-oreo.png': imgTOreo,
  't-maracuya.png': imgTMaracuya,
  't-chocolate-belga.png': imgTChocolateBelga,
  't-coco.png': imgTCoco,
  'pf-mini-3-leches-clasico.png': imgPfMini3LechesClasico,
  'pf-mini-3-leches-de-chocolate.png': imgPfMini3LechesDeChocolate,
  'pf-mini-3-leches-de-fresa.png': imgPfMini3LechesDeFresa,
  'pf-mini-3-leches-de-maracuya.png': imgPfMini3LechesDeMaracuya,
  'pf-vasito-de-oreo-cream.png': imgPfVasitoDeOreoCream,
  'pf-vasito-de-fresa-y-chantilly.png': imgPfVasitoDeFresaYChantilly,
  'c-chocolate.jpg': imgCChocolate,
  'c-vainilla.jpg': imgCVainilla,
  'c-zanahoria.jpg': imgCZanahoria,
  'c-fresa.png': imgCFresa,
  'c-oreo.png': imgCOreo,
  'c-arandano.png': imgCArandano,
};

export function archivoDeUrl(imagenUrl) {
  if (!imagenUrl) return '';
  try {
    return decodeURIComponent(String(imagenUrl).split('?')[0].split('/').pop() || '').toLowerCase();
  } catch {
    return String(imagenUrl).split('/').pop() || '';
  }
}

export function resolverImagenProducto(imagenUrl, fallback = null) {
  if (imagenUrl && typeof imagenUrl === 'string' && !imagenUrl.startsWith('http') && !imagenUrl.startsWith('/')) {
    return imagenUrl;
  }
  const archivo = archivoDeUrl(imagenUrl);
  if (archivo && CATALOGO[archivo]) return CATALOGO[archivo];
  if (imagenUrl && (imagenUrl.startsWith('http://') || imagenUrl.startsWith('https://'))) return imagenUrl;
  if (imagenUrl && imagenUrl.startsWith('/')) return `${API_BASE}${imagenUrl}`;
  return fallback;
}

export function onImgErrorFallback(event, fallback) {
  const img = event.currentTarget;
  if (!img || img.dataset.fallbackApplied === '1') return;
  img.dataset.fallbackApplied = '1';
  if (fallback) img.src = fallback;
}
