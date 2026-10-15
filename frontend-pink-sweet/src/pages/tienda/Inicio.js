import React, { useState, useEffect } from 'react';
import { API_BASE, apiGet, authHeaders, getToken, notificarCarrito } from '../../api';

import logoPrincipal from '../../assets/logo.png';
import dividerTitle from "../../assets/divider-title.png"; 
import iconOferta from "../../assets/icon-oferta.png"; 
import tortaFresa from "../../assets/products/torta de fresa.png";

// IMAGENES OFERTAS
import imgAClasico from '../../assets/products/a-clasico.png';
import imgTvClasicos from '../../assets/products/tv-clasicos.png';
import imgMeQueso from '../../assets/products/me-queso.png';
import imgTcChocolate from '../../assets/products/tc-chocolate.png';
import imgCArandano from '../../assets/products/c-arandano.png';
import imgTFresa from '../../assets/products/t-fresa.png';
import { resolverImagenProducto } from '../../utils/imagenProducto';

const FALLBACK_IMG = imgTcChocolate;

// Mapa de imágenes por nombre de producto (fallback)
const productImageMap = {
  'torta triple chocolate': imgTcChocolate,
  'tequeños clásicos': imgTvClasicos,
  'trufas de fresa': imgTFresa,
  'mini empanadas de queso': imgMeQueso,
  'alfajor clásico': imgAClasico,
  'cupcakes de arándano': imgCArandano,
};

// ─── Countdown Timer Component ────────────────────────────────
function CountdownTimer({ endDate, small }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!endDate) { setExpired(false); return; }

    const update = () => {
      const now = new Date().getTime();
      const end = new Date(endDate + 'T23:59:59').getTime();
      const diff = end - now;

      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
      setExpired(false);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (expired) return <span style={{ color: '#E74C3C', fontFamily: 'Poppins-Bold', fontSize: small ? '11px' : '13px' }}>🕐 FINALIZADO</span>;
  if (!timeLeft) return <span style={{ color: '#999', fontSize: small ? '11px' : '13px' }}>Cargando...</span>;

  const urgent = timeLeft.days <= 1;
  const color = urgent ? '#E74C3C' : '#5A3E41';

  if (small) {
    return (
      <span style={{ color, fontFamily: 'Poppins-Medium', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
        <i className="fa-regular fa-clock" style={{ color: urgent ? '#E74C3C' : '#C6676D' }}></i>
        {timeLeft.days > 0 ? `${timeLeft.days}d ${timeLeft.hours}h` : `${timeLeft.hours}h ${timeLeft.minutes}m`}
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {[
        { label: 'Días', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds },
      ].map((unit, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{
            backgroundColor: urgent ? '#FDEDEC' : '#F5F5F5',
            borderRadius: '8px',
            padding: '6px 10px',
            minWidth: '40px',
            border: `1px solid ${urgent ? '#F5B7B1' : '#EAEAEA'}`,
          }}>
            <span style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color }}>{String(unit.value).padStart(2, '0')}</span>
          </div>
          <span style={{ fontFamily: 'Poppins-Regular', fontSize: '9px', color: '#999', marginTop: '2px', display: 'block' }}>{unit.label}</span>
        </div>
      ))}
      {urgent && <span style={{ fontFamily: 'Poppins-Bold', fontSize: '10px', color: '#E74C3C', marginLeft: '5px', animation: 'pulse 1s infinite' }}>⚠️ ÚLTIMOS DÍAS</span>}
    </div>
  );
}

// ─── Skeleton Loader ───────────────────────────────────────────
function OfferSkeleton() {
  return (
    <div style={{ border: '2px solid #FADADD', borderRadius: '25px', overflow: 'hidden', backgroundColor: '#FFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '200px', backgroundColor: '#F5F5F5', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ padding: '25px' }}>
        <div style={{ height: '20px', backgroundColor: '#F0F0F0', borderRadius: '4px', marginBottom: '10px', width: '80%' }} />
        <div style={{ height: '14px', backgroundColor: '#F0F0F0', borderRadius: '4px', marginBottom: '20px', width: '100%' }} />
        <div style={{ height: '14px', backgroundColor: '#F0F0F0', borderRadius: '4px', marginBottom: '20px', width: '60%' }} />
        <div style={{ height: '40px', backgroundColor: '#F0F0F0', borderRadius: '10px', width: '100%' }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const Ofertas = ({ setPage }) => {
  // Favoritos: mismo sistema que Productos.js — se guardan bajo la MISMA llave 'favoritos_ids' en sessionStorage, así el corazón sale marcado igual en ambas páginas y en Perfil → Favoritos sin importar desde dónde se haya agregado.
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const saved = sessionStorage.getItem('favoritos_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleFavorito = async (p) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para guardar favoritos.');
      return;
    }
    // Las ofertas de boceto (sin producto real, prodId null) no se pueden guardar como favorito — solo pasa si el backend aún no tiene ofertas.
    if (!p.prodId) return;

    const esFavorito = favoritos.has(p.prodId);

    setFavoritos(prev => {
      const nuevo = new Set(prev);
      if (esFavorito) nuevo.delete(p.prodId);
      else nuevo.add(p.prodId);
      sessionStorage.setItem('favoritos_ids', JSON.stringify([...nuevo]));
      window.dispatchEvent(new Event('favoritosUpdated'));
      return nuevo;
    });

    try {
      if (esFavorito) {
        await fetch(`${API_BASE}/api/favoritos/${p.prodId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch(`${API_BASE}/api/favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productoId: p.prodId }),
        });
      }
    } catch {
      // Si falla el backend, revertimos el cambio local
      setFavoritos(prev => {
        const revertido = new Set(prev);
        if (esFavorito) revertido.add(p.prodId);
        else revertido.delete(p.prodId);
        sessionStorage.setItem('favoritos_ids', JSON.stringify([...revertido]));
        return revertido;
      });
    }
  };

  const [ofertasReales, setOfertasReales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [agregando, setAgregando] = useState(null); // productId being added
  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    setCargando(true);
    setError('');
    apiGet('/api/ofertas/vigentes')
      .then(data => {
        setOfertasReales(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error cargando ofertas:', err);
        setError('No pudimos cargar las ofertas. Mostrando ofertas de ejemplo.');
        setOfertasReales([]);
        setCargando(false);
      });
  }, []);

  const showNotification = (msg, type = 'success') => {
    setNotificacion({ msg, type });
    setTimeout(() => setNotificacion(null), 3000);
  };

  const anadirAlCarrito = async (prodId, offerTitle) => {
    if (!prodId) { setPage('productos'); return; }
    if (!getToken()) { 
      showNotification('Debes iniciar sesión para agregar productos al carrito.', 'error');
      return; 
    }
    setAgregando(prodId);
    try {
      const resp = await fetch(`${API_BASE}/api/carrito/agregar`, {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({ productoId: prodId, cantidad: 1 }),
      });
      if (!resp.ok) throw new Error();
      notificarCarrito();
      showNotification(`${offerTitle || 'Producto'} agregado al carrito con descuento aplicado! 🎉`);
    } catch { 
      showNotification('No se pudo agregar al carrito.', 'error');
    } finally {
      setAgregando(null);
    }
  };

  // Catálogo boceto de respaldo (se muestra SOLO si el backend aún no tiene ofertas reales)
  const offerProducts = [
    { id: 0, img: imgTcChocolate, name: "Torta Triple Chocolate", desc: "Delicioso bizcocho de chocolate con relleno y cobertura de ganache, decorado con crema de chocolate.", oldPrice: "80.00", newPrice: "64.00", discount: 20 },
    { id: 1, img: imgTvClasicos, name: "Tequeños Clásicos", desc: "La receta tradicional que nunca falla. Rellenos de queso blanco llanero, crujientes por fuera y derretidos por dentro.", oldPrice: "38.00", newPrice: "32.30", discount: 15 },
    { id: 2, img: imgTFresa, name: "Trufas de Fresa", desc: "Chocolate negro relleno de una suave crema de fresa natural. Dulces, frutales y absolutamente irresistibles.", oldPrice: "45.00", newPrice: "33.75", discount: 25 },
    { id: 3, img: imgMeQueso, name: "Mini Empanadas de Queso", desc: "Deliciosas empanadas rellenas de queso fundido, cremosas por dentro y doradas por fuera.", oldPrice: "36.00", newPrice: "30.60", discount: 15 },
    { id: 4, img: imgAClasico, name: "Alfajor Clásico", desc: "Delicadas tapitas artesanales con un suave relleno de dulce de leche y un toque de azúcar en polvo.", oldPrice: "28.00", newPrice: "22.40", discount: 20 },
    { id: 5, img: imgCArandano, name: "Cupcakes de Arándano", desc: "Delicioso y suave pastelito de miga fina con un toque de dulzor a chocolate, es ideal para decorar con crema batida y/o fondant.", oldPrice: "42.00", newPrice: "37.80", discount: 10 },
  ];

  // Mapear ofertas reales; si el backend todavía no tiene ninguna, cae al boceto de respaldo
  const listaMostrar = ofertasReales.length > 0 ? ofertasReales.map((o, i) => {
    const prod = o.producto;
    const prodId = prod?.id ?? null;
    const precio = prod?.precio != null ? Number(prod.precio) : 0;
    const descuento = o.oferDescuento != null ? Number(o.oferDescuento) : 0;
    const newPrice = descuento > 0 ? (precio * (1 - descuento / 100)).toFixed(2) : precio.toFixed(2);

    let imgUrl = resolverImagenProducto(prod?.imagenUrl, null);

    if (!imgUrl) {
      const nombreLower = (o.oferTitulo || prod?.nombre || '').toLowerCase();
      for (const [key, val] of Object.entries(productImageMap)) {
        if (nombreLower.includes(key)) { imgUrl = val; break; }
      }
    }

    return {
      id: o.oferId ?? i,
      prodId,
      img: imgUrl || FALLBACK_IMG,
      name: o.oferTitulo || prod?.nombre || 'Oferta',
      desc: o.oferDescripcion || prod?.descripcion || '',
      oldPrice: precio.toFixed(2),
      newPrice,
      discount: descuento,
      endDate: o.oferFechaFin || null,
      diasRestantes: o.diasRestantes ?? null,
    };
  }) : offerProducts.map(p => ({ ...p, prodId: null, endDate: null, diasRestantes: null }));

  // Calcular descuento máximo para el hero banner (si es el boceto, ya sale 25 solo porque ahí está el mayor)
  const maxDiscount = listaMostrar.reduce((max, p) => Math.max(max, p.discount || 0), 0);

  return (
    <div style={{ backgroundColor: '#FFEFEF', fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* NOTIFICACIÓN FLOTANTE */}
      {notificacion && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          backgroundColor: notificacion.type === 'error' ? '#FDEDEC' : '#E8F8F5',
          border: `1.5px solid ${notificacion.type === 'error' ? '#F5B7B1' : '#A3E4D7'}`,
          borderRadius: '12px', padding: '15px 25px',
          fontFamily: 'Poppins-Medium', fontSize: '14px',
          color: notificacion.type === 'error' ? '#E74C3C' : '#27AE60',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          animation: 'slideInRight 0.3s ease',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <i className={`fa-solid ${notificacion.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
          {notificacion.msg}
        </div>
      )}

      {/* KEYFRAMES ANIMATIONS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .offer-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.5s ease forwards;
        }
        .offer-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(198, 103, 109, 0.2);
          border-color: #C6676D !important;
        }
        .offer-card:hover .btn-add-cart {
          background-color: #B8555B !important;
          transform: scale(1.02);
        }
        .offer-img-container {
          overflow: hidden;
        }
        .offer-img-container img {
          transition: transform 0.5s ease;
        }
        .offer-card:hover .offer-img-container img {
          transform: scale(1.08);
        }
      `}</style>

      {/* HEADER */}
      <section style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '20px' }}>
        <img src={logoPrincipal} alt="Logo Sweet Cream Rose" style={{ width: '230px', objectFit: 'contain', marginBottom: '15px' }} />
        <h1 style={{ color: '#5A3E41', margin: '10 0 5px 30', fontFamily: 'Poppins-Bold', fontSize: '30px', letterSpacing: '2px' }}>OFERTAS</h1>
        <img src={dividerTitle} alt="divisor" style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 10px auto' }} />
      </section>

      {/* HERO BANNER */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 60px auto', backgroundColor: '#FACFD8', borderRadius: '25px', display: 'flex', overflow: 'hidden', position: 'relative', padding: '0 20px' }}>
        <div style={{ flex: '1', padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: '#C6676D', fontFamily: 'Poppins-Bold', fontSize: '13px', letterSpacing: '1px', marginBottom: '15px' }}>
            ♥ DESCUENTOS ESPECIALES
          </span>
          <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '46px', color: '#5A3E41', margin: '0 0 15px 0', lineHeight: '1.1' }}>
            Disfruta lo mejor<br/>por menos
          </h2>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '15px', color: '#5A3E41', margin: '0 0 30px 0', maxWidth: '350px', lineHeight: '1.5' }}>
            Aprovecha nuestras ofertas por tiempo limitado en tus productos favoritos.
          </p>
          <button onClick={() => setPage('productos')} style={{ alignSelf: 'flex-start', backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '12px 35px', fontFamily: 'Poppins-Bold', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
            APROVECHAR OFERTA <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
        
        <div style={{ flex: '1', position: 'relative' }}>
          <img src={tortaFresa} alt="Pastel en oferta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          
          <div style={{ 
            position: 'absolute', top: '30px', right: '40px', 
            width: '140px', height: '140px',
            backgroundImage: `url(${iconOferta})`, 
            backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
            color: 'white', transform: 'rotate(-5deg)'
          }}>
            <span style={{ fontFamily: 'Poppins-Medium', fontSize: '15px', marginTop: '-5px' }}>Hasta</span>
            <span style={{ fontFamily: 'Poppins-Bold', fontSize: '38px', lineHeight: '1' }}>{maxDiscount}%</span>
            <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px' }}>DSCTO.</span>
          </div>
        </div>
      </section>

      {/* TÍTULO */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 30px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-solid fa-tag" style={{ color: '#C6676D', fontSize: '26px', transform: 'scaleX(-1)' }}></i>
          <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '28px', color: '#5A3E41', margin: '0' }}>OFERTAS DESTACADAS</h2>
          {!cargando && listaMostrar.length > 0 && (
            <span style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#C6676D', backgroundColor: '#FCF0F2', padding: '3px 12px', borderRadius: '20px' }}>
              {listaMostrar.length} ofertas
            </span>
          )}
        </div>
        <img src={dividerTitle} alt="Divisor" style={{ width: '140px', objectFit: 'contain', marginLeft: '45px', marginTop: '5px' }} onError={e => e.target.style.display='none'} />
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ maxWidth: '1100px', margin: '0 auto 30px auto', padding: '15px 25px', backgroundColor: '#FDEDEC', borderRadius: '12px', border: '1px solid #F5B7B1', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#C6676D', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {/* SKELETON LOADER */}
      {cargando && (
        <section style={{ maxWidth: '1100px', margin: '0 auto 60px auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', padding: '0 20px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => <OfferSkeleton key={i} />)}
        </section>
      )}

      {/* EMPTY STATE - Sin ofertas activas */}
      {!cargando && listaMostrar.length === 0 && !error && (
        <section style={{
          maxWidth: '600px', margin: '0 auto 60px auto', padding: '50px 30px',
          textAlign: 'center', backgroundColor: '#FFF', borderRadius: '20px',
          border: '2px dashed #EAAFB8',
        }}>
          <i className="fa-solid fa-tag" style={{ fontSize: '40px', color: '#EAAFB8', marginBottom: '15px' }}></i>
          <h3 style={{ fontFamily: 'Poppins-Bold', color: '#5A3E41', margin: '0 0 8px 0' }}>
            Por ahora no hay ofertas activas
          </h3>
          <p style={{ fontFamily: 'Poppins-Regular', color: '#999', fontSize: '14px', margin: 0 }}>
            Vuelve pronto, estamos preparando promociones especiales para ti.
          </p>
        </section>
      )}

      {/* GRID DE OFERTAS */}
      {!cargando && (
        <section style={{ maxWidth: '1100px', margin: '0 auto 60px auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', padding: '0 20px' }}>
          {listaMostrar.map((p, index) => (
            <div key={p.id} className="offer-card" style={{ 
              border: '2px solid #EAAFB8', borderRadius: '25px', overflow: 'hidden', 
              backgroundColor: '#FFEFEF', display: 'flex', flexDirection: 'column',
              animationDelay: `${index * 0.1}s`,
            }}>
              
              {/* IMAGEN */}
              <div className="offer-img-container" style={{ position: 'relative', height: '240px' }}>
                <img 
                  src={p.img} 
                  alt={p.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                />
                
                {/* BADGE DESCUENTO */}
                <div style={{ 
                  position: 'absolute', top: '5px', left: '5px', 
                  width: '80px', height: '80px',
                  backgroundImage: `url(${iconOferta})`, 
                  backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  color: 'white', fontFamily: 'Poppins-Bold', fontSize: '20px' 
                }}>
                  -{p.discount}%
                </div>
                
                {/* FAVORITOS */}
                <div onClick={() => toggleFavorito(p)} title={p.prodId ? (favoritos.has(p.prodId) ? 'Quitar de favoritos' : 'Agregar a favoritos') : ''} style={{ 
                  position: 'absolute', top: '15px', right: '15px', 
                  backgroundColor: 'rgba(255,255,255,0.9)', width: '38px', height: '38px', 
                  borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                }}>
                  <i className={p.prodId && favoritos.has(p.prodId) ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                     style={{ color: '#C6676D', fontSize: '18px', marginTop: '1px' }}></i>
                </div>

              </div>

              {/* CONTENIDO */}
              <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#644444', margin: '0 0 8px 0' }}>{p.name}</h3>

                <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#644444', margin: '0 0 12px 0', lineHeight: '1.5', flexGrow: 1 }}>{p.desc}</p>

                {p.endDate && (
                  <div style={{ marginBottom: '12px', padding: '8px 12px', backgroundColor: 'rgba(198, 103, 109, 0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                    <CountdownTimer endDate={p.endDate} small={false} />
                  </div>
                )}
                
                {/* PRECIOS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ fontFamily: 'Poltawski-Nowy', fontSize: '20px', color: '#7C7978', textDecoration: 'line-through' }}>
                    S/. {p.oldPrice}
                  </span>
                  <span style={{ fontFamily: 'Poltawski-Nowy', fontSize: '22px', color: '#C6676D', fontWeight: 'bold' }}>
                    S/. {p.newPrice}
                  </span>
                  <span style={{ fontSize: '14px', color: '#59423CBA', fontFamily: 'Poppins-Medium' }}>por unidad</span>
                </div>

                <button 
                  onClick={() => anadirAlCarrito(p.prodId, p.name)} 
                  disabled={agregando === p.prodId}
                  className="btn-add-cart"
                  style={{ 
                    backgroundColor: agregando === p.prodId ? '#999' : '#C6676D', 
                    color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '10px', 
                    fontFamily: 'Poppins-Medium', fontSize: '18px', cursor: agregando === p.prodId ? 'not-allowed' : 'pointer', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%',
                    transition: 'all 0.2s',
                  }}>
                  {agregando === p.prodId ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> AGREGANDO...</>
                  ) : (
                    <><i className="fa-solid fa-cart-shopping"></i> AÑADIR AL CARRITO</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* BANNER INFERIOR */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 60px auto', backgroundColor: '#FACFD8', borderRadius: '20px', padding: '30px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #C6676D' }}>
            <i className="fa-regular fa-clock" style={{ fontSize: '35px', color: '#B14B47' }}></i>
          </div>
          <div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '24px', color: '#7D2530', margin: '0 0 5px 0' }}>¡OFERTAS POR TIEMPO LIMITADO!</h3>
            <p style={{ fontFamily: 'Poppins-Medium', fontSize: '15px', color: '#B14B47', margin: '0' }}>No te quedes sin tus favoritos.<br/>Promociones válidas hasta agotar stock</p>
          </div>
        </div>
        <button onClick={() => setPage('productos')} style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '12px 30px', fontFamily: 'Poppins-Bold', fontSize: '15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
          ¡APROVECHALOS YA!
        </button>
      </section>

      {/* VALOR PROPUESTA */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', padding: '30px 40px 0 40px', borderTop: '2px solid #FADADD' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-solid fa-cube" style={{ fontSize: '35px', color: '#EAAFB8' }}></i>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', maxWidth: '120px', lineHeight: '1.3' }}>Ingredientes de primera calidad</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-regular fa-heart" style={{ fontSize: '35px', color: '#EAAFB8' }}></i>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', maxWidth: '120px', lineHeight: '1.3' }}>Hecho con amor en cada detalle</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-solid fa-truck-fast" style={{ fontSize: '35px', color: '#EAAFB8' }}></i>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', maxWidth: '120px', lineHeight: '1.3' }}>Envíos seguros y rápidos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-regular fa-user" style={{ fontSize: '35px', color: '#EAAFB8' }}></i>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', maxWidth: '120px', lineHeight: '1.3' }}>Atención personalizada para ti</span>
        </div>
      </section>
    </div>
  );
};

export default Ofertas;