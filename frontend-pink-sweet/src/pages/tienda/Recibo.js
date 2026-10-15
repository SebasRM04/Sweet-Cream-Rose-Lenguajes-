import React, { useState, useEffect } from 'react';
import logoPrincipal from '../../assets/logo.png';
import dividerTitle from '../../assets/divider-title.png';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const ESTADOS_TIMELINE = ['Pendiente', 'Confirmada', 'Completada'];
const ESTADO_LABEL  = { Pendiente: 'Pendiente', Confirmada: 'Confirmada', Completada: 'Completada', Cancelado: 'Cancelado' };
const ESTADO_ICONO  = { Pendiente: 'fa-clock', Confirmada: 'fa-check', Completada: 'fa-box', Cancelado: 'fa-xmark' };

const COLORS = {
  bg: '#FFEFEF', brown: '#5A3E41', brownBody: '#644444', primary: '#C6676D',
  border: '#EAAFB8', softPink: '#FBD0D9', lightest: '#FFF0F2', muted: '#8A7A7C',
};

function Recibo({ setPage }) {
  const [orden, setOrden]         = useState(null);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState(null);

  const token = sessionStorage.getItem('token');

  const cargarPorId = (id) => {
    setCargando(true);
    setError(null);
    fetch(`${API_BASE}/api/ordenes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('No se encontró el pedido');
        return res.json();
      })
      .then(data => setOrden(data))
      .catch(() => setError('No pudimos encontrar ese pedido.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    if (!token) { setCargando(false); setError('Debes iniciar sesión para ver tus pedidos.'); return; }
    const idGuardado = sessionStorage.getItem('pedidoSeleccionado');
    if (idGuardado) { cargarPorId(idGuardado); }
    else { setCargando(false); setError('No se encontró ningún pedido seleccionado. Vuelve a "Mis pedidos" e ingresa de nuevo desde ahí.'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const headerBlock = (titulo) => (
    <section style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '20px' }}>
      <img src={logoPrincipal} alt="Logo Sweet Cream Rose" style={{ width: '230px', objectFit: 'contain', marginBottom: '15px' }} />
      <h1 style={{ color: '#5A3E41', margin: '10px 0 5px 0', fontFamily: 'Poppins-Bold', fontSize: '30px', letterSpacing: '2px' }}>{titulo}</h1>
      <img src={dividerTitle} alt="divisor" style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 10px auto' }} />
    </section>
  );

  const sectionBoxStyle = { maxWidth: '900px', margin: '0 auto 28px auto', backgroundColor: '#FFFFFF', border: `2px solid ${COLORS.border}`, borderRadius: '22px', padding: '30px 34px', boxSizing: 'border-box' };
  const boxTitleStyle   = { fontFamily: 'Poppins-Bold', fontSize: '18px', color: COLORS.brown, margin: '0 0 22px 0', display: 'flex', alignItems: 'center', gap: '10px' };
  const primaryBtnStyle = { backgroundColor: COLORS.primary, color: 'white', border: 'none', padding: '13px 34px', borderRadius: '10px', fontFamily: 'Poppins-SemiBold', fontSize: '14px', cursor: 'pointer' };
  const outlineBtnStyle = { backgroundColor: 'white', color: COLORS.primary, border: `2px solid ${COLORS.primary}`, padding: '11px 32px', borderRadius: '10px', fontFamily: 'Poppins-SemiBold', fontSize: '14px', cursor: 'pointer' };

  // Descargar constancia: abre una vista imprimible y dispara el diálogo de impresión del navegador (el cliente elige "Guardar como PDF"). Cero dependencias nuevas en el proyecto.
  const descargarConstancia = () => {
    if (!orden) return;
    const ventana = window.open('', '_blank');
    const filas = (orden.detalles || []).map(d => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #FBD0D9;">${d.producto?.nombre || 'Producto'}</td>
        <td style="padding:8px;border-bottom:1px solid #FBD0D9;text-align:center;">${d.cantidad}</td>
        <td style="padding:8px;border-bottom:1px solid #FBD0D9;text-align:right;">S/ ${Number(d.precio || 0).toFixed(2)}</td>
        <td style="padding:8px;border-bottom:1px solid #FBD0D9;text-align:right;">S/ ${Number(d.subTotal || 0).toFixed(2)}</td>
      </tr>`).join('');
    ventana.document.write(`
      <html>
        <head>
          <title>Constancia de pedido #${orden.codigoSeguimiento || orden.id}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #5A3E41; padding: 40px; }
            h1 { color: #C6676D; margin-bottom: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 8px; background: #FBD0D9; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 14px; }
          </style>
        </head>
        <body>
          <h1>Sweet Cream Rose</h1>
          <p>Constancia de pedido</p>
          <p><strong>Código:</strong> ${orden.codigoSeguimiento || `#${orden.id}`}</p>
          <p><strong>Fecha:</strong> ${orden.fecha ? new Date(orden.fecha).toLocaleString('es-PE') : ''}</p>
          <p><strong>Dirección de entrega:</strong> ${orden.direccionEntrega || '—'}</p>
          <p><strong>Método de pago:</strong> ${orden.metodoPago || '—'}</p>
          <table>
            <thead><tr><th>Producto</th><th style="text-align:center;">Cant.</th><th style="text-align:right;">Precio</th><th style="text-align:right;">Subtotal</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
          <p class="total">Subtotal: S/ ${subtotalMostrar.toFixed(2)}<br/>Envío: S/ ${envio.toFixed(2)}<br/>IGV (18%): S/ ${igv.toFixed(2)}<br/>TOTAL PAGADO: S/ ${total.toFixed(2)}</p>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => ventana.print(), 300);
  };

  // Totales calculados a partir de lo que YA guarda el backend
  const subtotal = orden ? (orden.detalles || []).reduce((acc, d) => acc + Number(d.subTotal || (d.precio * d.cantidad) || 0), 0) : 0;
  const envio    = orden ? Number(orden.costoEnvio || 0) : 0;
  // Usa los montos guardados en la orden; para órdenes antiguas los recalcula.
  const tieneDesglose = orden && orden.subtotal != null && Number(orden.subtotal) > 0;
  const subtotalMostrar = tieneDesglose ? Number(orden.subtotal) : subtotal;
  const igv      = tieneDesglose ? Number(orden.igv || 0) : subtotal * 0.18;
  const total    = tieneDesglose ? Number(orden.total || 0) : subtotal + envio + igv;
  const codigo   = orden ? (orden.codigoSeguimiento || `SRC-${new Date(orden.fecha).getFullYear()}-${String(orden.id).padStart(4, '0')}`) : '';

  const estadoActual = orden?.estado || 'Pendiente';
  const pasoActual   = Math.max(0, ESTADOS_TIMELINE.indexOf(estadoActual));

  return (
    <div style={{ backgroundColor: COLORS.bg, fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>
      {headerBlock('COMPROBANTE DE PEDIDO')}

      {cargando && <p style={{ textAlign: 'center', fontFamily: 'Poppins-Medium', color: COLORS.muted, padding: '30px 0' }}>Cargando pedido...</p>}
      {!cargando && error && !orden && (
        <div style={{ textAlign: 'center', padding: '20px 0 40px 0' }}>
          <p style={{ fontFamily: 'Poppins-Medium', color: COLORS.primary, marginBottom: '18px' }}>{error}</p>
          <button onClick={() => setPage && setPage('perfil')} style={primaryBtnStyle}>Ir a Mis pedidos</button>
        </div>
      )}

      {!cargando && orden && (
        <>
          {/* ── Código y estado ── */}
          <section style={{ maxWidth: '900px', margin: '0 auto 28px auto', padding: '0 20px', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: COLORS.softPink, borderRadius: '18px', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '54px', height: '54px', minWidth: '54px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-clipboard-check" style={{ color: COLORS.primary, fontSize: '22px' }}></i>
                </div>
                <div>
                  <div style={{ fontFamily: 'Poppins-SemiBold', color: COLORS.brownBody, fontSize: '13px' }}>NÚMERO DE PEDIDO</div>
                  <div style={{ fontFamily: 'Poppins-Bold', color: COLORS.brown, fontSize: '22px', letterSpacing: '1px' }}>#{codigo}</div>
                  <div style={{ fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '12px', marginTop: '4px' }}>{orden.fecha ? new Date(orden.fecha).toLocaleString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</div>
                </div>
              </div>
              <span style={{ backgroundColor: 'white', color: COLORS.primary, fontFamily: 'Poppins-Bold', fontSize: '13px', padding: '10px 20px', borderRadius: '20px' }}>
                <i className={`fa-solid ${ESTADO_ICONO[estadoActual] || 'fa-clock'}`} style={{ marginRight: '8px' }}></i>
                {(ESTADO_LABEL[estadoActual] || estadoActual).toUpperCase()}
              </span>
            </div>
          </section>

          {/* ── Seguimiento (timeline) ── */}
          {estadoActual !== 'Cancelado' && (
            <section style={sectionBoxStyle}>
              <h3 style={boxTitleStyle}><i className="fa-solid fa-truck"></i> SEGUIMIENTO DEL PEDIDO</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                {ESTADOS_TIMELINE.map((paso, i) => (
                  <div key={paso} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 10px auto',
                      backgroundColor: i <= pasoActual ? COLORS.primary : '#F0DEE1',
                      color: i <= pasoActual ? 'white' : COLORS.muted,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px',
                    }}>
                      <i className={`fa-solid ${ESTADO_ICONO[paso]}`}></i>
                    </div>
                    <div style={{ fontFamily: 'Poppins-Bold', fontSize: '12.5px', color: i <= pasoActual ? COLORS.brown : COLORS.muted }}>{ESTADO_LABEL[paso]}</div>
                  </div>
                ))}
                <div style={{ position: 'absolute', top: '25px', left: '10%', right: '10%', height: '3px', backgroundColor: '#F0DEE1', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '25px', left: '10%', width: `${(pasoActual / (ESTADOS_TIMELINE.length - 1)) * 80}%`, height: '3px', backgroundColor: COLORS.primary, zIndex: 0 }} />
              </div>
              <p style={{ fontFamily: 'Poppins-Regular', color: COLORS.muted, fontSize: '12px', marginTop: '18px', textAlign: 'center' }}>
                <i className="fa-solid fa-circle-info" style={{ marginRight: '6px' }}></i>
                El estado se actualiza cuando el administrador lo cambia desde el panel de pedidos.
              </p>
            </section>
          )}

          {/* ── Resumen del pedido ── */}
          <section style={sectionBoxStyle}>
            <h3 style={boxTitleStyle}><i className="fa-solid fa-receipt"></i> RESUMEN DEL PEDIDO</h3>
            {(orden.detalles || []).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px' }}>
                <span>{d.producto?.nombre || 'Producto'} <span style={{ color: COLORS.muted }}>x{d.cantidad}</span></span>
                <span>S/ {Number(d.subTotal || 0).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: COLORS.brownBody, marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${COLORS.softPink}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>Subtotal</span><span>S/ {subtotalMostrar.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>Envío</span><span>S/ {envio.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>IGV (18%)</span><span>S/ {igv.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0 0', marginTop: '6px', borderTop: `2px solid ${COLORS.softPink}`, fontFamily: 'Poppins-Bold', fontSize: '17px' }}>
                <span style={{ color: COLORS.brown }}>TOTAL PAGADO</span><span style={{ color: COLORS.primary }}>S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* ── Detalles de entrega ── */}
          <section style={sectionBoxStyle}>
            <h3 style={boxTitleStyle}><i className="fa-solid fa-location-dot"></i> DETALLES DE ENTREGA</h3>
            <p style={{ fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              {orden.direccionEntrega || 'Recojo en tienda'}<br />
              Tipo de entrega: {orden.tipoEntrega === 'Delivery' ? 'Envío a domicilio' : orden.tipoEntrega === 'ConsumoLocal' ? 'Consumo en el local' : 'Recojo en tienda'}
            </p>
          </section>

          {/* ── Método de pago ── */}
          <section style={sectionBoxStyle}>
            <h3 style={boxTitleStyle}><i className="fa-regular fa-credit-card"></i> MÉTODO DE PAGO</h3>
            <p style={{ fontFamily: 'Poppins-Medium', color: COLORS.brownBody, fontSize: '14px', margin: 0 }}>{orden.metodoPago || '—'}</p>
          </section>

          {/* ── 3 acciones ── */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setPage && setPage('perfil')} style={primaryBtnStyle}>Ver mis pedidos</button>
            <button onClick={descargarConstancia} style={outlineBtnStyle}><i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i>Descargar constancia</button>
            <button onClick={() => setPage && setPage('inicio')} style={{ ...outlineBtnStyle, border: `2px solid ${COLORS.border}`, color: COLORS.brown }}>Ir al inicio</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Recibo;
