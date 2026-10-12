import React, { useState, useEffect } from "react";
import iconShop from '../../assets/icon-shop.png';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const obtenerEstilosEstado = (estado) => {
  switch ((estado || '').toUpperCase()) {
    case "PENDIENTE":  return { bg: "#DCE8F4", color: "#6A8BBD", icon: "fa-regular fa-clock" };
    case "CONFIRMADA": return { bg: "#FFF3CD", color: "#856404", icon: "fa-regular fa-circle-check" };
    case "COMPLETADA": return { bg: "#FADADD", color: "#C6676D", icon: "fa-regular fa-circle-check" };
    case "CANCELADO":  return { bg: "#F2F2F2", color: "#8E8E8E", icon: "fa-regular fa-circle-xmark" };
    default:           return { bg: "#FADADD", color: "#C6676D", icon: "fa-regular fa-circle-check" };
  }
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '';
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (_) {
    return fechaStr;
  }
};

const formatearHora = (fechaStr) => {
  if (!fechaStr) return '';
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return '';
  }
};

const PerfilPedidosTab = ({ setPage }) => {
  const [pedidos, setPedidos]   = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);
  const [filtro, setFiltro]     = useState("Todos");

  // Cargar pedidos reales del backend
  useEffect(() => {
    const token      = sessionStorage.getItem('token');
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!token) {
      setCargando(false);
      return;
    }

    let usuarioId = null;
    try { usuarioId = JSON.parse(usuarioStr)?.id; } catch (_) {}

    if (!usuarioId) {
      // Intentar obtenerlo del perfil si no está guardado en sessionStorage
      fetch(`${API_BASE}/api/usuarios/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.id) cargarPedidos(data.id, token);
          else setCargando(false);
        })
        .catch(() => setCargando(false));
    } else {
      cargarPedidos(usuarioId, token);
    }
  }, []);

  const cargarPedidos = (usuarioId, token) => {
    fetch(`${API_BASE}/api/ordenes/usuario/${usuarioId}/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el historial');
        return res.json();
      })
      .then(data => {
        // data es List<Orden> con { id, estado, fechaOrden, total, detalles: [{producto, cantidad, precio}] }
        setPedidos(data || []);
        setError(null);
      })
      .catch(() => {
        setError('No se pudo cargar el historial de pedidos.');
      })
      .finally(() => setCargando(false));
  };

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(p => {
    if (filtro === "Todos") return true;
    const estadoNorm = (p.estado || '').toUpperCase();
    return estadoNorm === filtro.toUpperCase();
  });

  return (
    <>
      {/* CONTENEDOR PRINCIPAL MIS PEDIDOS */}
      <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', padding: '40px' }}>

        {/* Cabecera Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <i className="fa-solid fa-bag-shopping" style={{ color: '#C6676D', fontSize: '24px' }}></i>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41', margin: '0' }}>MIS PEDIDOS</h3>
        </div>

        {/* BARRA DE FILTROS Y ORDENAMIENTO */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "30px", borderBottom: "2px solid #FDF2F3", paddingBottom: "20px", flexWrap: "wrap" }}>

          {/* Botones de Filtro estilo Pills */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {[
              { label: "Todos",       valor: "Todos" },
              { label: "Pendientes",  valor: "PENDIENTE" },
              { label: "Confirmadas", valor: "CONFIRMADA" },
              { label: "Completadas", valor: "COMPLETADA" },
              { label: "Cancelados",  valor: "CANCELADO" },
            ].map(({ label, valor }) => {
              const isActive = filtro === valor;
              return (
                <button
                  key={valor}
                  onClick={() => setFiltro(valor)}
                  style={{
                    backgroundColor: isActive ? '#C6676D' : 'white',
                    color: isActive ? 'white' : '#C6676D',
                    border: '2px solid',
                    borderColor: isActive ? '#C6676D' : '#EAAFB8',
                    fontFamily: 'Poppins-Medium',
                    fontSize: '13px',
                    padding: '8px 22px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Select de Ordenamiento */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontFamily: 'Poppins-Bold', fontSize: '13px', color: '#5A3E41' }}>Ordenar por:</span>
            <select
              defaultValue="recientes"
              style={{ border: '2px solid #5A3E41', backgroundColor: 'white', padding: '6px 15px', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
            </select>
          </div>
        </div>

        {/* LISTA DE PEDIDOS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

          {/* ── Estado de carga ── */}
          {cargando && (
            <p style={{ textAlign: 'center', color: '#888', fontFamily: 'Poppins-Medium', padding: '20px 0' }}>
              Cargando tus pedidos...
            </p>
          )}

          {/* ── Error ── */}
          {!cargando && error && (
            <p style={{ textAlign: 'center', color: '#C3666D', fontFamily: 'Poppins-Medium', padding: '20px 0' }}>
              {error}
            </p>
          )}

          {/* ── Sin pedidos ── */}
          {!cargando && !error && pedidos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛍️</div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '16px', color: '#5A3E41', margin: '0 0 6px' }}>
                Aún no tienes pedidos
              </p>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#888', margin: 0 }}>
                Cuando realices tu primera compra, aparecerá aquí.
              </p>
            </div>
          )}

          {/* ── Sin resultados para el filtro activo ── */}
          {!cargando && !error && pedidos.length > 0 && pedidosFiltrados.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', fontFamily: 'Poppins-Medium', padding: '20px 0' }}>
              No tienes pedidos con ese estado.
            </p>
          )}

          {/* ── Tarjetas de pedido ── */}
          {!cargando && !error && pedidosFiltrados.map((pedido) => {
            const badge    = obtenerEstilosEstado(pedido.estado);
            const detalles = pedido.detalles || [];
            const nProd    = detalles.reduce((acc, d) => acc + (d.cantidad || 1), 0);
            const total    = pedido.total ?? pedido.totalOrden ?? 0;

            return (
              <div key={pedido.id} style={{ display: "flex", gap: "25px", border: "2px solid #EAAFB8", borderRadius: "20px", padding: "20px 25px", alignItems: "center", flexWrap: "wrap" }}>

                {/* Imagen Principal — primer producto del pedido */}
                <div style={{ flexShrink: 0 }}>
                  {detalles[0]?.producto?.imagenUrl ? (
                    <img
                      src={`${API_BASE}${detalles[0].producto.imagenUrl}`}
                      alt={detalles[0]?.producto?.nombre || 'Producto'}
                      style={{ width: "160px", height: "120px", objectFit: "cover", borderRadius: "15px" }}
                      onError={e => { e.target.style.background = '#FADADD'; e.target.style.display = 'block'; }}
                    />
                  ) : (
                    <div style={{ width: "160px", height: "120px", borderRadius: "15px", background: "#FADADD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                      🎂
                    </div>
                  )}
                </div>

                {/* Detalles de Texto e Imágenes Pequeñas */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                  <div>
                    <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: "0 0 5px 0" }}>
                      Pedido #{pedido.codigoSeguimiento || pedido.id}
                    </h4>
                    <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41', margin: "0 0 5px 0" }}>
                      {formatearFecha(pedido.fechaOrden)} · {formatearHora(pedido.fechaOrden)}
                    </p>
                    <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: 0 }}>
                      {nProd} {nProd === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>

                  {/* Miniaturas de productos */}
                  <div style={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
                    {detalles.slice(0, 4).map((detalle, idx) => (
                      detalle.producto?.imagenUrl ? (
                        <img
                          key={idx}
                          src={`${API_BASE}${detalle.producto.imagenUrl}`}
                          alt="miniatura"
                          style={{ width: "35px", height: "35px", borderRadius: "50%", objectFit: "cover", border: "2px solid white", marginLeft: idx > 0 ? "-10px" : "0", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                          onError={e => e.target.style.display='none'}
                        />
                      ) : (
                        <div key={idx} style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#FADADD", border: "2px solid white", marginLeft: idx > 0 ? "-10px" : "0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                          🎂
                        </div>
                      )
                    ))}
                    {detalles.length > 4 && (
                      <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#EAAFB8", border: "2px solid white", marginLeft: "-10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "white", fontWeight: 700 }}>
                        +{detalles.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* Columna Derecha de la Tarjeta (Estado, Total, Botón) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", minWidth: "150px", height: "120px" }}>

                  {/* Badge de Estado */}
                  <div style={{ backgroundColor: badge.bg, color: badge.color, padding: '8px 18px', borderRadius: '25px', fontFamily: 'Poppins-Bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className={badge.icon}></i>
                    {/* Capitalizar estado para mostrarlo bonito */}
                    {(pedido.estado || 'Pendiente').charAt(0).toUpperCase() + (pedido.estado || 'pendiente').slice(1).toLowerCase()}
                  </div>

                  {/* Total del Pedido */}
                  <div style={{ textAlign: "right", margin: "10px 0" }}>
                    <span style={{ display: "block", fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777' }}>Total:</span>
                    <strong style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41' }}>
                      S/ {Number(total).toFixed(2)}
                    </strong>
                  </div>

                  {/* Botón Ver Detalles */}
                  <button
                    onClick={() => {
                      sessionStorage.setItem('pedidoSeleccionado', pedido.id);
                      if (setPage) setPage('recibo');
                    }}
                    style={{ backgroundColor: "#C6676D", color: "white", border: "none", borderRadius: "8px", fontFamily: "Poppins-Medium", fontSize: "13px", padding: "8px 20px", cursor: "pointer", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}
                  >
                    Ver detalles <span style={{ fontSize: '16px' }}>→</span>
                  </button>
                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* BANNER DE CONTACTO INFERIOR */}
      <div style={{ backgroundColor: '#FACFD8', borderRadius: '20px', padding: '25px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', marginTop: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '80px', height: '80px', flexShrink: 0, backgroundColor: 'white', border: '3px solid #EAAFB8', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <img src={iconShop} alt="Icono Tienda" style={{ width: '60%', height: 'auto', objectFit: 'contain' }} />
          </div>
          <div>
            <h3 style={{ color: '#7D2530', margin: '0 0 5px 0', fontSize: '18px', fontFamily: 'Poppins-SemiBold' }}>¿No encuentras lo que buscas?</h3>
            <p style={{ margin: '0', color: '#B14B47', fontSize: '15px', fontFamily: 'Signika-Regular', maxWidth: '350px', lineHeight: '1.2' }}>Contáctanos y con gusto te ayudamos a crear el postre perfecto</p>
          </div>
        </div>
        <button style={{ backgroundColor: '#C3666D', color: 'white', fontSize: '14px', fontFamily: 'Poppins-Bold', border: 'none', padding: '10px 25px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          CONTACTAR <span style={{ fontSize: '16px' }}>›</span>
        </button>
      </div>

    </>
  );
};

export default PerfilPedidosTab;