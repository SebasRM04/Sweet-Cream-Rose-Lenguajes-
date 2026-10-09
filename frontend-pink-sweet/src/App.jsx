import React, { useState } from "react";

// TUS COMPONENTES IMPORTADOS AQUÍ:
import Header from './components/Header';
import Footer from './components/Footer';

import Inicio from './pages/tienda/Inicio';
import Productos from './pages/tienda/Productos';
import Ofertas from './pages/tienda/Ofertas';
import Nosotros from './pages/tienda/Nosotros';
import PerfilPanel from './pages/perfil/PerfilPanel';

import Carrito from './pages/tienda/Carrito';
import Recibo from './pages/tienda/Recibo';

import TerminosCondiciones from './pages/legal/TerminosCondiciones';
import PreguntasFrecuentes from './pages/legal/PreguntasFrecuentes';
import PoliticasPrivacidad from './pages/legal/PoliticasPrivacidad';
import PoliticasEnvio from './pages/legal/PoliticasEnvio';

// ─── GLOBAL CSS ──────────────────────────────────────────
const globalCSS = `
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Lato',sans-serif; }
  .scr-btn-primary { background:#c8506a; color:#fff; border:none; padding:11px 28px; font-family:'Lato',sans-serif; font-weight:700; font-size:13px; letter-spacing:1.5px; cursor:pointer; border-radius:2px; text-decoration:none; transition:background .2s; display:inline-block; }
  .scr-btn-primary:hover { background:#a83858; }
  .scr-btn-outline { background:transparent; color:#c8506a; border:2px solid #c8506a; padding:9px 26px; font-family:'Lato',sans-serif; font-weight:700; font-size:13px; letter-spacing:1.5px; cursor:pointer; border-radius:2px; text-decoration:none; transition:background .2s,color .2s; display:inline-block; }
  .scr-btn-outline:hover { background:#c8506a; color:#fff; }
  .scr-btn-white { background:#fff; color:#c8506a; border:none; padding:11px 28px; font-family:'Lato',sans-serif; font-weight:700; font-size:13px; letter-spacing:1.5px; cursor:pointer; border-radius:2px; text-decoration:none; transition:background .2s; display:inline-block; }
  .scr-btn-white:hover { background:#f5e6ea; }
  .hero-slide { display:none; }
  .hero-slide.active { display:flex; }
  .dot { width:10px; height:10px; border-radius:50%; cursor:pointer; border:2px solid #c8506a; transition:background .2s; display:inline-block; }
  .product-card-img { width:100%; height:200px; object-fit:cover; display:block; border-radius:8px 8px 0 0; transition:transform .35s; }
  .product-card-wrap:hover .product-card-img { transform:scale(1.05); }
  .product-card-wrap { border-radius:8px; overflow:hidden; box-shadow:0 2px 12px rgba(200,80,106,.10); background:#fff; cursor:pointer; }
  .testimonial-card { background:#fdf7f8; border:1px solid #f0d0d8; border-radius:10px; padding:20px 22px; }
  .wishlist-btn { position:absolute; top:10px; right:10px; background:#fff; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer; font-size:15px; color:#c8506a; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,.12); transition:background .2s; z-index:2; }
  .wishlist-btn:hover { background:#fdf2f4; }
  .offer-card { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 14px rgba(200,80,106,.10); position:relative; transition:transform .25s,box-shadow .25s; }
  .offer-card:hover { transform:translateY(-4px); box-shadow:0 6px 24px rgba(200,80,106,.18); }
  .offer-card img { width:100%; height:210px; object-fit:cover; display:block; }
  .badge-discount { position:absolute; top:12px; left:12px; background:#c8506a; color:#fff; font-family:'Lato',sans-serif; font-size:13px; font-weight:700; padding:4px 10px; border-radius:20px; letter-spacing:.5px; z-index:2; }
  .btn-add-cart { width:100%; background:#2d1a10; color:#fff; border:none; padding:10px; font-family:'Lato',sans-serif; font-weight:700; font-size:12px; letter-spacing:1.5px; cursor:pointer; transition:background .2s; margin-top:12px; border-radius:4px; }
  .btn-add-cart:hover { background:#c8506a; }
  .prop-item { display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; }
  .prop-icon { width:52px; height:52px; border-radius:50%; background:#fdf2f4; border:2px solid #f0d0d8; display:flex; align-items:center; justify-content:center; font-size:20px; color:#c8506a; }
  @media(max-width:700px){
    .hero-slide.active{flex-direction:column!important;}
    .hero-text-block{padding:24px 20px!important;}
    .home-products-grid{grid-template-columns:repeat(2,1fr)!important;}
    .festi-row{flex-direction:column!important;}
    .testimonials-grid{grid-template-columns:1fr!important;}
    .offers-grid{grid-template-columns:repeat(2,1fr)!important;}
    .value-props-grid{grid-template-columns:repeat(2,1fr)!important;}
    .hero-offer-inner{flex-direction:column!important;}
  }
`;

// ─── ROOT APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("inicio");

  // ✅ CORRECCIÓN: función de navegación actualiza el badge al volver al carrito
  const navigateTo = p => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para actualizar el badge del carrito (se pasa al componente Carrito)
  const handleCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div style={{ fontFamily: "'Playfair Display','Georgia',serif", background: "#fff", color: "#2d1a10", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      <style>{globalCSS}</style>

      {/* HEADER */}
      <Header page={page} setPage={navigateTo} />

      {/* RUTAS */}
      {page === "inicio"    && <Inicio    setPage={navigateTo} />}
      {page === "productos" && <Productos setPage={navigateTo} />}
      {page === "ofertas"   && <Ofertas   setPage={navigateTo} />}
      {page === "nosotros"  && <Nosotros  setPage={navigateTo} />}
      {page === "perfil"    && <PerfilPanel    setPage={navigateTo} />}

      {/* ✅ CORRECCIÓN: Ruta carrito — se muestra al presionar "IR A PAGAR" */}
      {page === "carrito"   && (
        <Carrito
          setPage={navigateTo}
          onCartUpdate={handleCartUpdate}
        />
      )}

      {page === "preguntasFrecuentes"   && <PreguntasFrecuentes   setPage={navigateTo} />}
      {page === "recibo"                && <Recibo setPage={navigateTo} />}
      {page === "politicasEnvio"        && <PoliticasEnvio        setPage={navigateTo} />}
      {page === "terminosCondiciones"   && <TerminosCondiciones   setPage={navigateTo} />}
      {page === "politicasPrivacidad"   && <PoliticasPrivacidad   setPage={navigateTo} />}

      {/* FOOTER */}
      <Footer setPage={navigateTo} />
    </div>
  );
}