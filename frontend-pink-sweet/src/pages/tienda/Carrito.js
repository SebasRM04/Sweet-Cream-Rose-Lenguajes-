// Carrito.js — Página de CARRITO / PROCEDIMIENTO DE PAGO

import React, { useState, useEffect } from 'react';
import { getUsuarioId } from '../../api';
import logoPrincipal from '../../assets/logo.png';
import dividerTitle from '../../assets/divider-title.png';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

// ── Opciones de envío (según boceto "OPCIONES DE ENVÍO") ──────────────────
const OPCIONES_ENVIO = [
  { id: 'estandar', tipo: 'Delivery', icono: 'fa-motorcycle', etiqueta: 'Entrega estándar', detalle: 'Recibe tu pedido de forma rápida y segura.', tiempo: '45 - 90 minutos', costo: 8.00, nota: 'Ideal para la mayoría de pedidos' },
  { id: 'express',  tipo: 'Delivery', icono: 'fa-bolt',       etiqueta: 'Entrega express',  detalle: 'Prioridad en preparación y envío. Recibe tu pedido lo antes posible.', tiempo: '30 - 60 minutos', costo: 12.00, nota: 'Lo más rápido disponible' },
  { id: 'recojo',   tipo: 'Recojo',   icono: 'fa-store',      etiqueta: 'Recojo en tienda', detalle: 'Recoge tu pedido en nuestro local sin costo adicional.', tiempo: '20 - 40 minutos', costo: 0.00, nota: 'Sin costo de envío' },
];

// Métodos de pago genéricos, se usan solo si el usuario no tiene ninguno guardado
const METODOS_PAGO_FALLBACK = [
  { id: 'fallback-tarjeta', tipo: 'VISA', alias: 'Tarjeta de banco', ultimosDigitos: null, icono: 'fa-regular fa-credit-card', descripcion: 'Visa, Mastercard, American Express' },
  { id: 'fallback-yape',    tipo: 'YAPE', alias: 'Yape',             ultimosDigitos: null, icono: 'fa-solid fa-mobile-screen-button', descripcion: 'Paga con tu aplicación Yape' },
];

// Un método guardado (VISA/BANCO/YAPE) se traduce al enum que acepta el backend
const metodoOrdenDesde = (tipo) => (tipo === 'YAPE' ? 'Yape' : 'Tarjeta');

function Carrito({ setPage, onCartUpdate }) {
  // ── Carrito ────────────────────────────────────────────────────────────
  const [items, setItems]       = useState([]);
  const [cargando, setCargando] = useState(true);
  const [comentario, setComentario] = useState('');

  // ── Comprobante de pago ────────────────────────────────────────────────
  const [comprobante, setComprobante]           = useState('boleta');
  const [nombreComprobante, setNombreComprobante] = useState('');
  const [dniComprobante, setDniComprobante]       = useState('');
  const [razonSocial, setRazonSocial]             = useState('');
  const [ruc, setRuc]                             = useState('');
  const [direccionFiscal, setDireccionFiscal]     = useState('');

  // ── Dirección ──────────────────────────────────────────────────────────
  const [direcciones, setDirecciones]             = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [modalDireccion, setModalDireccion]       = useState(false);
  const [direccionTemp, setDireccionTemp]         = useState(null); // selección dentro del modal

  // ── Opción de envío ────────────────────────────────────────────────────
  const [opcionEnvio, setOpcionEnvio]     = useState(null);
  const [modalEnvio, setModalEnvio]       = useState(false);
  const [envioTemp, setEnvioTemp]         = useState(null);

  // ── Método de pago ─────────────────────────────────────────────────────
  const [metodosPago, setMetodosPago]                 = useState([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null);
  const [modalPago, setModalPago]                     = useState(false);
  const [metodoPagoTemp, setMetodoPagoTemp]           = useState(null);

  // ── Navegación interna del checkout ───────────────────────────────────
  const [vista, setVista]         = useState('carrito'); // carrito | confirmar
  const [pagando, setPagando]     = useState(false);

  const token = sessionStorage.getItem('token');

  const [usuarioId, setUsuarioId] = useState(getUsuarioId());

  useEffect(() => {
    if (!token || usuarioId) return;
    fetch(`${API_BASE}/api/perfil/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.id) {
          sessionStorage.setItem('usuarioId', data.id);
          setUsuarioId(data.id);
        }
      })
      .catch(() => {});
  }, [token, usuarioId]);

  // ── Cargar carrito ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { setCargando(false); return; }
    fetch(`${API_BASE}/api/carrito`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        const mapeados = (Array.isArray(data) ? data : []).map(ci => ({
          id:         ci.producto?.id,
          img:        ci.producto?.imagenUrl ? `${API_BASE}${ci.producto.imagenUrl}` : '/assets/products/logo.png',
          nombre:     ci.producto?.nombre || 'Producto',
          desc:       ci.producto?.descripcion || '',
          precio:     Number(ci.producto?.precio || 0),
          cantidad:   ci.cantidad || 1,
          tieneOferta: ci.tieneOferta || false,
          precioConDescuento: ci.precioConDescuento || null,
        }));
        setItems(mapeados);
      })
      .catch(() => setItems([]))
      .finally(() => setCargando(false));
  }, [token]);

  // ── Cargar direcciones guardadas ───────────────────────────────────────
  useEffect(() => {
    if (!token || !usuarioId) return;
    fetch(`${API_BASE}/api/direcciones/usuario/${usuarioId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        const lista = Array.isArray(data) ? data : [];
        setDirecciones(lista);
        const principal = lista.find(d => d.esPrincipal) || lista[0] || null;
        setDireccionSeleccionada(principal);
      })
      .catch(() => setDirecciones([]));
  }, [token, usuarioId]);

  // ── Cargar métodos de pago guardados ───────────────────────────────────
  useEffect(() => {
    if (!token || !usuarioId) return;
    fetch(`${API_BASE}/api/metodos-pago/usuario/${usuarioId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : []))
      .then(data => setMetodosPago(Array.isArray(data) ? data : []))
      .catch(() => setMetodosPago([]));
  }, [token, usuarioId]);

  // ── Cambiar cantidad ──────────────────────────────────────────────────
  const cambiarCantidad = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nueva = item.cantidad + delta;
      if (nueva < 1) return item;
      if (token) {
        fetch(`${API_BASE}/api/carrito/actualizar-cantidad?productoId=${id}&nuevaCantidad=${nueva}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).then(() => onCartUpdate && onCartUpdate()).catch(() => {});
      }
      return { ...item, cantidad: nueva };
    }));
  };

  const eliminar = (id) => {
    if (token) {
      fetch(`${API_BASE}/api/carrito/eliminar/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => onCartUpdate && onCartUpdate()).catch(() => {});
    }
    setItems(prev => prev.filter(item => item.id !== id));
    if (onCartUpdate) onCartUpdate();
  };

  // ── Totales ──────────────────────────────────────────────────────────
  const getPrecioEfectivo = (item) => (item.tieneOferta && item.precioConDescuento ? item.precioConDescuento : item.precio);
  const subtotal    = items.reduce((acc, item) => acc + getPrecioEfectivo(item) * item.cantidad, 0);
  const ahorroTotal = items.reduce((acc, item) => (item.tieneOferta && item.precioConDescuento ? acc + (item.precio - item.precioConDescuento) * item.cantidad : acc), 0);
  const envio        = opcionEnvio ? opcionEnvio.costo : 0;
  const igv           = subtotal * 0.18;
  const total          = subtotal + envio + igv;
  const totalProductos = items.reduce((acc, item) => acc + item.cantidad, 0);

  // ── Ir a pagar: valida requisitos antes de abrir el modal de método de pago ──
  const irAPagar = () => {
    if (!token) { alert('Debes iniciar sesión para pagar.'); return; }
    if (!opcionEnvio) { alert('Elige una opción de envío antes de continuar.'); setModalEnvio(true); return; }
    if (opcionEnvio.tipo === 'Delivery' && !direccionSeleccionada) { alert('Selecciona una dirección de entrega.'); setModalDireccion(true); return; }
    setMetodoPagoTemp(metodoPagoSeleccionado);
    setModalPago(true);
  };

  const confirmarMetodoPago = () => {
    if (!metodoPagoTemp) { alert('Selecciona un método de pago.'); return; }
    setMetodoPagoSeleccionado(metodoPagoTemp);
    setModalPago(false);
    setVista('confirmar');
  };

  // ── Confirmar y pagar: recién aquí se crea la orden en el backend ──────
  const confirmarPago = async () => {
    setPagando(true);
    try {
      const usuId = usuarioId;
      if (!usuId) throw new Error('No se pudo obtener el usuario');

      const detalles = items.map(item => ({ productoId: item.id, cantidad: item.cantidad, precio: item.precio }));

      const direccionTexto = direccionSeleccionada
        ? `${direccionSeleccionada.direccion}, ${direccionSeleccionada.distrito}, ${direccionSeleccionada.ciudad}` +
          (direccionSeleccionada.referencia ? ` (Ref: ${direccionSeleccionada.referencia})` : '')
        : 'Recojo / Consumo en tienda';
      const comentarioTexto = comentario.trim() ? ` | Comentario: ${comentario.trim()}` : '';

      const resOrden = await fetch(`${API_BASE}/api/ordenes/usuario/${usuId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          metodoPago:       metodoOrdenDesde(metodoPagoSeleccionado.tipo),
          tipoEntrega:      opcionEnvio.tipo === 'Recojo' ? 'Recojo' : 'Delivery',
          direccionEntrega: direccionTexto + comentarioTexto,
          costoEnvio:       opcionEnvio.costo,
          comprobante: comprobante === 'factura'
            ? { tipo: 'Factura', nombre: razonSocial, documento: ruc, direccion: direccionFiscal }
            : { tipo: 'Boleta',  nombre: nombreComprobante, documento: dniComprobante },
          detalles,
        }),
      });
      if (!resOrden.ok) throw new Error('No se pudo crear la orden');
      const ordenData = await resOrden.json();

      await fetch(`${API_BASE}/api/carrito/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ metodoPago: metodoOrdenDesde(metodoPagoSeleccionado.tipo) }),
      });

      // El comprobante final (con el código de seguimiento, resumen, envío, método de pago, etc.) se arma en Recibo.js leyendo directo del backend — así funciona igual sin importar si se llega recién pagando o después desde "Mis pedidos".
      sessionStorage.setItem('pedidoSeleccionado', ordenData.id);
      setItems([]);
      if (onCartUpdate) onCartUpdate();
      if (setPage) setPage('recibo');
    } catch (err) {
      alert('Ocurrió un error al procesar el pago. Intenta de nuevo.');
      console.error(err);
    } finally {
      setPagando(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // Estilos compartidos (mismos tokens que Inicio / Nosotros / Productos / Ofertas)
  // ─────────────────────────────────────────────────────────────────────
  const COLORS = {
    bg: '#FFEFEF', brown: '#5A3E41', brownBody: '#644444', primary: '#C6676D',
    border: '#EAAFB8', softPink: '#FBD0D9', lightest: '#FFF0F2', muted: '#8A7A7C',
    success: '#27AE60',
  };

  const sectionBoxStyle = { maxWidth: '900px', margin: '0 auto 28px auto', backgroundColor: '#FFFFFF', border: `2px solid ${COLORS.border}`, borderRadius: '22px', padding: '30px 34px', boxSizing: 'border-box' };
  const boxTitleStyle   = { fontFamily: 'Poppins-Bold', fontSize: '18px', color: COLORS.brown, margin: '0 0 22px 0', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '0.5px' };
  const primaryBtnStyle = { backgroundColor: COLORS.primary, color: 'white', border: 'none', padding: '13px 40px', borderRadius: '10px', fontFamily: 'Poppins-SemiBold', fontSize: '15px', cursor: 'pointer' };
  const outlineBtnStyle = { backgroundColor: 'white', color: COLORS.primary, border: `2px solid ${COLORS.primary}`, padding: '11px 38px', borderRadius: '10px', fontFamily: 'Poppins-SemiBold', fontSize: '15px', cursor: 'pointer' };
  const inputStyle      = { width: '100%', backgroundColor: COLORS.softPink, border: 'none', padding: '12px 15px', fontFamily: 'Poppins-Medium', fontSize: '14px', outline: 'none', color: COLORS.brown, borderRadius: '8px', boxSizing: 'border-box' };
  const headerBlock = (titulo) => (
    <section style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '20px' }}>
      <img src={logoPrincipal} alt="Logo Sweet Cream Rose" style={{ width: '230px', objectFit: 'contain', marginBottom: '15px' }} />
      <h1 style={{ color: '#5A3E41', margin: '10 0 5px 30', fontFamily: 'Poppins-Bold', fontSize: '30px', letterSpacing: '2px' }}>{titulo}</h1>
      <img src={dividerTitle} alt="divisor" style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 10px auto' }} />
    </section>
  );

  // Overlay genérico para los modales flotantes (dirección / envío / pago)
  const Overlay = ({ children, onClose, maxWidth = 560 }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(90, 62, 65, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }} onClick={onClose}>
      <div
        style={{ background: COLORS.bg, borderRadius: 24, padding: '32px 30px', maxWidth, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 12px 50px rgba(90,62,65,0.35)', fontFamily: 'sans-serif', boxSizing: 'border-box' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════
  // VISTA: CONFIRMA TU PEDIDO (resumen final antes de pagar)
  // ═══════════════════════════════════════════════════════════════════
  if (vista === 'confirmar') {
    return (
      <div style={{ backgroundColor: COLORS.bg, fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>
        {headerBlock('CONFIRMA TU PEDIDO')}
        <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '13px', margin: '-10px 0 30px 0' }}>Revisa los detalles de tu pedido antes de pagar</p>

        <section style={sectionBoxStyle}>
          <h3 style={boxTitleStyle}><i className="fa-solid fa-receipt"></i> 1. Resumen del pedido</h3>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px' }}>
              <span>{item.nombre} <span style={{ color: COLORS.muted }}>x{item.cantidad}</span></span>
              <span>S/ {(getPrecioEfectivo(item) * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', marginTop: '8px', borderTop: `1px solid ${COLORS.softPink}`, fontFamily: 'Poppins-Bold', color: COLORS.brown }}>
            <span>Subtotal ({totalProductos} productos)</span><span>S/ {subtotal.toFixed(2)}</span>
          </div>
        </section>

        <section style={sectionBoxStyle}>
          <h3 style={boxTitleStyle}><i className="fa-solid fa-truck"></i> 2. Envío</h3>
          <div style={{ fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px', marginBottom: '10px' }}>
            <strong style={{ color: COLORS.brown }}>Dirección de entrega:</strong><br />
            {opcionEnvio?.tipo === 'Recojo' ? 'Recojo en tienda' : (direccionSeleccionada ? `${direccionSeleccionada.direccion}, ${direccionSeleccionada.distrito}, ${direccionSeleccionada.ciudad}` : '—')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px' }}>
            <span>Método de envío: {opcionEnvio?.etiqueta} ({opcionEnvio?.tiempo})</span>
            <span>S/ {envio.toFixed(2)}</span>
          </div>
        </section>

        <section style={sectionBoxStyle}>
          <h3 style={boxTitleStyle}><i className="fa-solid fa-file-invoice"></i> 3. Comprobante de pago</h3>
          <div style={{ fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span>Tipo de comprobante: <strong>{comprobante === 'factura' ? 'Factura (para empresa)' : 'Boleta (para persona natural)'}</strong></span>
            {comprobante === 'factura'
              ? <><span>Razón social: <strong>{razonSocial || '—'}</strong></span><span>RUC: <strong>{ruc || '—'}</strong></span></>
              : (nombreComprobante && <span>Nombre: <strong>{nombreComprobante}</strong></span>)}
          </div>
        </section>

        <section style={sectionBoxStyle}>
          <h3 style={boxTitleStyle}><i className="fa-regular fa-credit-card"></i> 4. Método de pago</h3>
          <div style={{ fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px' }}>
            {metodoPagoSeleccionado?.alias} {metodoPagoSeleccionado?.ultimosDigitos ? `•••• ${metodoPagoSeleccionado.ultimosDigitos}` : ''}
          </div>
        </section>

        <section style={sectionBoxStyle}>
          <h3 style={boxTitleStyle}><i className="fa-solid fa-file-invoice-dollar"></i> 5. Resumen de pago</h3>
          <div style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: COLORS.brownBody }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
            {ahorroTotal > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', color: COLORS.success }}><span>Ahorro por ofertas</span><span>− S/ {ahorroTotal.toFixed(2)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}><span>Envío</span><span>S/ {envio.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}><span>IGV (18%)</span><span>S/ {igv.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0 0', marginTop: '8px', borderTop: `2px solid ${COLORS.softPink}`, fontFamily: 'Poppins-Bold', fontSize: '18px' }}>
              <span style={{ color: COLORS.brown }}>TOTAL</span><span style={{ color: COLORS.primary }}>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '26px 0 10px 0', display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setVista('carrito')} disabled={pagando} style={{ ...outlineBtnStyle, border: `2px solid ${COLORS.border}`, color: COLORS.brown }}>← Volver al carrito</button>
            <button onClick={confirmarPago} disabled={pagando} style={{ ...primaryBtnStyle, padding: '14px 50px', fontSize: '16px', backgroundColor: pagando ? '#e8a4a8' : COLORS.primary, cursor: pagando ? 'not-allowed' : 'pointer' }}>
              {pagando ? 'Procesando...' : 'CONFIRMAR Y PAGAR'}
            </button>
          </div>
          <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '12px', color: COLORS.muted, marginTop: '10px' }}>
            <i className="fa-solid fa-shield-alt" style={{ color: COLORS.primary, marginRight: '6px' }}></i>
            Tus datos y pagos están 100% protegidos.
          </p>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VISTA PRINCIPAL: CARRITO
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div style={{ backgroundColor: COLORS.bg, fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>
      {headerBlock('MI CARRITO')}
      <p style={{ maxWidth: '480px', margin: '-14px auto 20px auto', fontFamily: 'Poppins-Regular', fontSize: '13px', color: COLORS.muted, lineHeight: '1.5', textAlign: 'center' }}>
        Tu espacio personal para organizar tus pedidos, favoritos y disfrutar de una experiencia más dulce.
      </p>

      {/* ══ Sin sesión ══ */}
      {!token && !cargando && (
        <section style={{ maxWidth: '600px', margin: '20px auto 60px auto', padding: '50px 30px', textAlign: 'center', backgroundColor: '#FFF', borderRadius: '20px', border: `2px dashed ${COLORS.border}` }}>
          <i className="fa-solid fa-cart-shopping" style={{ fontSize: '40px', color: COLORS.border, marginBottom: '15px' }}></i>
          <h3 style={{ fontFamily: 'Poppins-Bold', color: COLORS.brown, margin: '0 0 8px 0' }}>Tu carrito está vacío</h3>
          <p style={{ fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '14px', margin: '0 0 22px 0' }}>Inicia sesión para agregar productos a tu carrito.</p>
          <button onClick={() => setPage && setPage('perfil')} style={primaryBtnStyle}>Iniciar sesión</button>
        </section>
      )}

      {cargando && <p style={{ textAlign: 'center', fontFamily: 'Poppins-Medium', color: COLORS.muted, padding: '60px 0' }}>Cargando carrito...</p>}

      {!cargando && token && items.length === 0 && (
        <section style={{ maxWidth: '600px', margin: '20px auto 60px auto', padding: '50px 30px', textAlign: 'center', backgroundColor: '#FFF', borderRadius: '20px', border: `2px dashed ${COLORS.border}` }}>
          <i className="fa-solid fa-cake-candles" style={{ fontSize: '40px', color: COLORS.border, marginBottom: '15px' }}></i>
          <h3 style={{ fontFamily: 'Poppins-Bold', color: COLORS.brown, margin: '0 0 8px 0' }}>Tu carrito está vacío</h3>
          <p style={{ fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '14px', margin: '0 0 22px 0' }}>Explora nuestros productos y agrega tus favoritos.</p>
          <button onClick={() => setPage && setPage('productos')} style={primaryBtnStyle}>Ver productos</button>
        </section>
      )}

      {/* ══ Lista de productos + dirección + envío ══ */}
      {!cargando && items.length > 0 && (
        <section style={sectionBoxStyle}>
          <h3 style={boxTitleStyle}><i className="fa-solid fa-bag-shopping"></i> PRODUCTOS EN TU CARRITO ({items.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map(item => {
              const precioEfectivo = getPrecioEfectivo(item);
              const enOferta = item.tieneOferta && item.precioConDescuento;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '18px 0', borderBottom: `1px solid ${COLORS.softPink}` }}>
                  <div style={{ width: '86px', height: '86px', minWidth: '86px', borderRadius: '14px', overflow: 'hidden', backgroundColor: COLORS.softPink }}>
                    <img src={item.img} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = '/assets/products/logo.png'; }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontFamily: 'Poppins-SemiBold', fontSize: '15px', color: COLORS.brown, margin: '0 0 4px 0' }}>{item.nombre}</h4>
                    {item.desc && <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: COLORS.muted, margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</p>}
                    {enOferta ? (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: COLORS.muted, textDecoration: 'line-through' }}>S/ {item.precio.toFixed(2)}</span>
                        <span style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: COLORS.primary }}>S/ {precioEfectivo.toFixed(2)}</span>
                      </div>
                    ) : <span style={{ fontFamily: 'Poppins-SemiBold', fontSize: '14px', color: COLORS.primary }}>S/ {precioEfectivo.toFixed(2)}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${COLORS.border}`, borderRadius: '20px', overflow: 'hidden' }}>
                      <button onClick={() => cambiarCantidad(item.id, -1)} style={{ width: '30px', height: '30px', border: 'none', background: 'white', color: COLORS.primary, fontFamily: 'Poppins-Bold', cursor: 'pointer', fontSize: '15px' }}>−</button>
                      <span style={{ width: '28px', textAlign: 'center', fontFamily: 'Poppins-SemiBold', color: COLORS.brown, fontSize: '13px' }}>{item.cantidad}</span>
                      <button onClick={() => cambiarCantidad(item.id, +1)} style={{ width: '30px', height: '30px', border: 'none', background: 'white', color: COLORS.primary, fontFamily: 'Poppins-Bold', cursor: 'pointer', fontSize: '15px' }}>+</button>
                    </div>
                    <button onClick={() => eliminar(item.id)} title="Eliminar" style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', backgroundColor: COLORS.lightest, color: COLORS.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-trash" style={{ fontSize: '13px' }}></i>
                    </button>
                  </div>
                  <div style={{ minWidth: '80px', textAlign: 'right', fontFamily: 'Poppins-Bold', fontSize: '15px', color: COLORS.brown }}>S/ {(precioEfectivo * item.cantidad).toFixed(2)}</div>
                </div>
              );
            })}
          </div>

          {/* ── Barra de dirección (boceto "Enviar a Casa / Cambiar") ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', backgroundColor: COLORS.softPink, borderRadius: '16px', padding: '18px 22px', marginTop: '26px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <i className="fa-solid fa-location-dot" style={{ color: COLORS.primary, fontSize: '20px' }}></i>
              <div>
                <div style={{ fontFamily: 'Poppins-Bold', color: COLORS.brown, fontSize: '14px' }}>
                  {direccionSeleccionada ? `Enviar a ${direccionSeleccionada.distrito}` : 'Agrega una dirección de entrega'}
                </div>
                <div style={{ fontFamily: 'Poppins-Regular', color: COLORS.brownBody, fontSize: '13px' }}>
                  {direccionSeleccionada ? `${direccionSeleccionada.direccion}, ${direccionSeleccionada.ciudad}` : 'Necesaria si eliges envío a domicilio'}
                </div>
              </div>
            </div>
            <button onClick={() => { setDireccionTemp(direccionSeleccionada); setModalDireccion(true); }} style={{ background: 'none', border: 'none', color: COLORS.primary, fontFamily: 'Poppins-SemiBold', fontSize: '14px', cursor: 'pointer' }}>
              {direcciones.length ? 'Cambiar →' : 'Agregar →'}
            </button>
          </div>

          {/* ── Botón / resumen de opciones de envío ── */}
          {opcionEnvio ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', border: `2px solid ${COLORS.primary}`, borderRadius: '16px', padding: '16px 22px', marginTop: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <i className={`fa-solid ${opcionEnvio.icono}`} style={{ color: COLORS.primary, fontSize: '18px' }}></i>
                <div>
                  <div style={{ fontFamily: 'Poppins-Bold', color: COLORS.brown, fontSize: '14px' }}>{opcionEnvio.etiqueta} — {opcionEnvio.costo === 0 ? 'GRATIS' : `S/ ${opcionEnvio.costo.toFixed(2)}`}</div>
                  <div style={{ fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '12px' }}>{opcionEnvio.tiempo}</div>
                </div>
              </div>
              <button onClick={() => { setEnvioTemp(opcionEnvio); setModalEnvio(true); }} style={{ background: 'none', border: 'none', color: COLORS.primary, fontFamily: 'Poppins-SemiBold', fontSize: '14px', cursor: 'pointer' }}>Cambiar →</button>
            </div>
          ) : (
            <button onClick={() => { setEnvioTemp(null); setModalEnvio(true); }} style={{ width: '100%', marginTop: '14px', background: 'white', border: `2px solid ${COLORS.primary}`, borderRadius: '14px', padding: '16px', color: COLORS.primary, fontFamily: 'Poppins-Bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fa-solid fa-truck"></i> ELEGIR OPCIONES DE ENVÍO
            </button>
          )}
        </section>
      )}

      {/* ══ Comentarios del pedido ══ */}
      {!cargando && items.length > 0 && (
        <section style={{ ...sectionBoxStyle, backgroundColor: COLORS.softPink, border: 'none' }}>
          <h3 style={boxTitleStyle}><i className="fa-regular fa-comment-dots"></i> COMENTARIOS DEL PEDIDO (OPCIONAL)</h3>
          <textarea value={comentario} onChange={e => setComentario(e.target.value.slice(0, 250))} rows={3} placeholder='Ejem: Escribir "Feliz cumpleaños Ana" en la torta' style={{ ...inputStyle, backgroundColor: 'white', resize: 'vertical' }} />
          <div style={{ textAlign: 'right', fontFamily: 'Poppins-Regular', fontSize: '12px', color: COLORS.muted, marginTop: '4px' }}>{comentario.length}/250</div>
        </section>
      )}

      {/* ══ Comprobante de pago ══ */}
      {!cargando && items.length > 0 && (
        <section style={sectionBoxStyle}>
          <h3 style={boxTitleStyle}><i className="fa-solid fa-file-invoice"></i> COMPROBANTE DE PAGO</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '22px', flexWrap: 'wrap' }}>
            {[{ valor: 'boleta', label: 'Boleta', sub: 'Para persona natural' }, { valor: 'factura', label: 'Factura', sub: 'Para empresa' }].map(op => (
              <label key={op.valor} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 220px', border: `2px solid ${comprobante === op.valor ? COLORS.primary : COLORS.border}`, backgroundColor: comprobante === op.valor ? COLORS.lightest : 'white', borderRadius: '12px', padding: '14px 18px', cursor: 'pointer', boxSizing: 'border-box' }}>
                <input type="radio" name="comprobante" value={op.valor} checked={comprobante === op.valor} onChange={() => setComprobante(op.valor)} style={{ accentColor: COLORS.primary, width: '17px', height: '17px' }} />
                <div>
                  <div style={{ fontFamily: 'Poppins-SemiBold', fontSize: '14px', color: COLORS.brown }}>{op.label}</div>
                  <div style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: COLORS.muted }}>{op.sub}</div>
                </div>
              </label>
            ))}
          </div>

          {comprobante === 'boleta' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Poppins-SemiBold', fontSize: '13px', color: COLORS.brown, marginBottom: '6px' }}>Nombre Completo (Opcional)</label>
                <input type="text" value={nombreComprobante} onChange={e => setNombreComprobante(e.target.value)} placeholder="Ej. María Rodríguez" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'Poppins-SemiBold', fontSize: '13px', color: COLORS.brown, marginBottom: '6px' }}>DNI (Opcional)</label>
                <input type="text" value={dniComprobante} onChange={e => setDniComprobante(e.target.value)} placeholder="Ej. 12345678" style={inputStyle} />
              </div>
            </div>
          )}
          {comprobante === 'factura' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Poppins-SemiBold', fontSize: '13px', color: COLORS.brown, marginBottom: '6px' }}>Razón Social</label>
                <input type="text" value={razonSocial} onChange={e => setRazonSocial(e.target.value)} placeholder="Ej. Inversiones Dulces S.A.C." style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'Poppins-SemiBold', fontSize: '13px', color: COLORS.brown, marginBottom: '6px' }}>RUC</label>
                <input type="text" value={ruc} onChange={e => setRuc(e.target.value)} placeholder="Ej. 20123456789" style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontFamily: 'Poppins-SemiBold', fontSize: '13px', color: COLORS.brown, marginBottom: '6px' }}>Dirección Fiscal</label>
                <input type="text" value={direccionFiscal} onChange={e => setDireccionFiscal(e.target.value)} placeholder="Ej. Av. Primavera 456, San Borja" style={inputStyle} />
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══ Resumen del pedido ══ */}
      {!cargando && items.length > 0 && (
        <section style={sectionBoxStyle}>
          <h3 style={boxTitleStyle}><i className="fa-solid fa-receipt"></i> RESUMEN DEL PEDIDO</h3>
          <div style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: COLORS.brownBody }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}><span>Subtotal ({totalProductos} productos)</span><span>S/ {subtotal.toFixed(2)}</span></div>
            {ahorroTotal > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', color: COLORS.success }}><span>Ahorro por ofertas</span><span>− S/ {ahorroTotal.toFixed(2)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}>
              <span>Envío</span>
              <span>{opcionEnvio ? `S/ ${envio.toFixed(2)}` : 'Por definir'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}><span>IGV (18%)</span><span>S/ {igv.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0 0', marginTop: '8px', borderTop: `2px solid ${COLORS.softPink}`, fontFamily: 'Poppins-Bold', fontSize: '18px' }}>
              <span style={{ color: COLORS.brown }}>TOTAL</span><span style={{ color: COLORS.primary }}>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '26px 0 22px 0' }}>
            <button onClick={irAPagar} style={{ ...primaryBtnStyle, padding: '14px 60px', fontSize: '16px' }}>IR A PAGAR →</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: COLORS.lightest, borderRadius: '14px', padding: '16px 20px' }}>
            <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-shield-alt" style={{ color: COLORS.primary, fontSize: '18px' }}></i>
            </div>
            <div>
              <h4 style={{ fontFamily: 'Poppins-SemiBold', fontSize: '13px', color: COLORS.brown, margin: '0 0 2px 0' }}>Tus compras están 100% protegidas</h4>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: COLORS.muted, margin: 0 }}>Usamos tecnología de encriptación avanzada para proteger tu información</p>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: SELECCIONAR DIRECCIÓN
      ══════════════════════════════════════════════════════════════ */}
      {modalDireccion && (
        <Overlay onClose={() => setModalDireccion(false)}>
          <h3 style={{ ...boxTitleStyle, fontSize: '19px', margin: '0 0 4px 0' }}><i className="fa-solid fa-location-dot" style={{ color: COLORS.primary }}></i> Selecciona tu dirección</h3>
          <p style={{ color: COLORS.muted, fontFamily: 'Poppins-Regular', fontSize: '13px', margin: '0 0 20px 0' }}>Elige la dirección donde deseas recibir tu pedido</p>

          {direcciones.length === 0 && <p style={{ fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>Aún no tienes direcciones guardadas.</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {direcciones.map(dir => (
              <label key={dir.id} style={{ display: 'flex', alignItems: 'center', gap: 14, border: `2px solid ${direccionTemp?.id === dir.id ? COLORS.primary : COLORS.border}`, borderRadius: 14, padding: '14px 18px', cursor: 'pointer', background: direccionTemp?.id === dir.id ? COLORS.lightest : 'white' }}>
                <input type="radio" name="direccion" checked={direccionTemp?.id === dir.id} onChange={() => setDireccionTemp(dir)} style={{ accentColor: COLORS.primary, width: 18, height: 18 }} />
                <div>
                  <div style={{ fontFamily: 'Poppins-Bold', color: COLORS.brown, fontSize: '14px' }}>{dir.distrito} {dir.esPrincipal && <span style={{ color: COLORS.primary, fontFamily: 'Poppins-SemiBold', fontSize: '11px' }}>· Principal</span>}</div>
                  <div style={{ fontFamily: 'Poppins-Regular', color: COLORS.brownBody, fontSize: '13px' }}>{dir.direccion}, {dir.ciudad}</div>
                  {dir.referencia && <div style={{ fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '12px' }}>Referencia: {dir.referencia}</div>}
                </div>
              </label>
            ))}
          </div>

          <div style={{ background: 'white', border: `1px solid ${COLORS.softPink}`, borderRadius: 14, padding: '14px 18px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: COLORS.brownBody }}>¿No ves la dirección que necesitas?</span>
            <button onClick={() => { setModalDireccion(false); setPage && setPage('perfil'); }} style={{ background: 'none', border: 'none', color: COLORS.primary, fontFamily: 'Poppins-SemiBold', fontSize: '13px', cursor: 'pointer' }}>Ir a mi perfil →</button>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setModalDireccion(false)} style={{ flex: 1, padding: '13px', border: `2px solid ${COLORS.border}`, borderRadius: 10, background: 'white', color: COLORS.brown, fontFamily: 'Poppins-SemiBold', cursor: 'pointer', fontSize: '14px' }}>Cancelar</button>
            <button
              onClick={() => { if (!direccionTemp) { alert('Selecciona una dirección.'); return; } setDireccionSeleccionada(direccionTemp); setModalDireccion(false); }}
              style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 10, background: COLORS.primary, color: 'white', fontFamily: 'Poppins-Bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Usa esta dirección
            </button>
          </div>
        </Overlay>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: OPCIONES DE ENVÍO
      ══════════════════════════════════════════════════════════════ */}
      {modalEnvio && (
        <Overlay onClose={() => setModalEnvio(false)}>
          <h3 style={{ ...boxTitleStyle, fontSize: '19px', margin: '0 0 4px 0' }}><i className="fa-solid fa-truck" style={{ color: COLORS.primary }}></i> Opciones de envío</h3>
          <p style={{ color: COLORS.muted, fontFamily: 'Poppins-Regular', fontSize: '13px', margin: '0 0 20px 0' }}>Elige la opción de envío que mejor se adapte a ti</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {OPCIONES_ENVIO.map(op => (
              <label key={op.id} style={{ display: 'flex', alignItems: 'center', gap: 14, border: `2px solid ${envioTemp?.id === op.id ? COLORS.primary : COLORS.border}`, borderRadius: 14, padding: '14px 18px', cursor: 'pointer', background: envioTemp?.id === op.id ? COLORS.lightest : 'white' }}>
                <input type="radio" name="opcionEnvio" checked={envioTemp?.id === op.id} onChange={() => setEnvioTemp(op)} style={{ accentColor: COLORS.primary, width: 18, height: 18 }} />
                <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: '50%', backgroundColor: COLORS.lightest, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fa-solid ${op.icono}`} style={{ color: COLORS.primary }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Poppins-Bold', color: COLORS.brown, fontSize: '14px' }}>{op.etiqueta}</div>
                  <div style={{ fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '12px' }}><i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>{op.tiempo}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Poppins-Bold', color: COLORS.primary, fontSize: '15px' }}>{op.costo === 0 ? 'GRATIS' : `S/ ${op.costo.toFixed(2)}`}</div>
                  <div style={{ fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '11px' }}>{op.nota}</div>
                </div>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setModalEnvio(false)} style={{ flex: 1, padding: '13px', border: `2px solid ${COLORS.border}`, borderRadius: 10, background: 'white', color: COLORS.brown, fontFamily: 'Poppins-SemiBold', cursor: 'pointer', fontSize: '14px' }}>Cancelar</button>
            <button
              onClick={() => { if (!envioTemp) { alert('Selecciona una opción de envío.'); return; } setOpcionEnvio(envioTemp); setModalEnvio(false); }}
              style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 10, background: COLORS.primary, color: 'white', fontFamily: 'Poppins-Bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Aplicar envío y volver al carrito
            </button>
          </div>
        </Overlay>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: SELECCIONA TU MÉTODO DE PAGO
      ══════════════════════════════════════════════════════════════ */}
      {modalPago && (
        <Overlay onClose={() => setModalPago(false)}>
          <h3 style={{ ...boxTitleStyle, fontSize: '19px', margin: '0 0 4px 0' }}><i className="fa-regular fa-credit-card" style={{ color: COLORS.primary }}></i> Selecciona tu método de pago</h3>
          <p style={{ color: COLORS.muted, fontFamily: 'Poppins-Regular', fontSize: '13px', margin: '0 0 22px 0' }}>Elige cómo quieres realizar tu pago</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {(metodosPago.length ? metodosPago : METODOS_PAGO_FALLBACK).map(mp => (
              <label key={mp.id} style={{ display: 'flex', alignItems: 'center', gap: 14, border: `2px solid ${metodoPagoTemp?.id === mp.id ? COLORS.primary : COLORS.border}`, borderRadius: 12, padding: '14px 18px', cursor: 'pointer', background: metodoPagoTemp?.id === mp.id ? COLORS.lightest : 'white' }}>
                <input type="radio" name="metodoPago" checked={metodoPagoTemp?.id === mp.id} onChange={() => setMetodoPagoTemp(mp)} style={{ accentColor: COLORS.primary, width: 18, height: 18 }} />
                <i className={mp.icono || (mp.tipo === 'YAPE' ? 'fa-solid fa-mobile-screen-button' : 'fa-regular fa-credit-card')} style={{ color: COLORS.primary, fontSize: '20px', width: '22px', textAlign: 'center' }}></i>
                <div>
                  <div style={{ fontFamily: 'Poppins-SemiBold', color: COLORS.brownBody, fontSize: '14px' }}>{mp.alias}{mp.ultimosDigitos ? ` •••• ${mp.ultimosDigitos}` : ''}</div>
                  <div style={{ color: COLORS.muted, fontFamily: 'Poppins-Regular', fontSize: '11.5px', marginTop: '2px' }}>{mp.descripcion || mp.banco || ''}</div>
                </div>
              </label>
            ))}
          </div>

          {metodosPago.length === 0 && (
            <div style={{ background: 'white', border: `1px solid ${COLORS.softPink}`, borderRadius: 14, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: COLORS.brownBody }}>¿Quieres guardar una tarjeta?</span>
              <button onClick={() => { setModalPago(false); setPage && setPage('perfil'); }} style={{ background: 'none', border: 'none', color: COLORS.primary, fontFamily: 'Poppins-SemiBold', fontSize: '13px', cursor: 'pointer' }}>Agregar en mi perfil →</button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setModalPago(false)} style={{ flex: 1, padding: '13px', border: `2px solid ${COLORS.border}`, borderRadius: 10, background: 'white', color: COLORS.brown, fontFamily: 'Poppins-SemiBold', cursor: 'pointer', fontSize: '14px' }}>Cancelar</button>
            <button onClick={confirmarMetodoPago} style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 10, background: COLORS.primary, color: 'white', fontFamily: 'Poppins-Bold', cursor: 'pointer', fontSize: '14px' }}>Continuar</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

export default Carrito;
