import React, { useState, useEffect, useMemo } from "react";
import { apiGet, apiPost, apiPut, apiDelete, API_BASE } from "../../api";
import logoPrincipal from '../../assets/logo.png'; 

// IMÁGENES DE PRODUCTOS (Fallbacks visuales)
import imgTcTripleChocolate from '../../assets/products/tc-triple-chocolate.png';
import imgAClasico from '../../assets/products/a-clasico.png';
import imgCArandano from '../../assets/products/c-arandano.png';
import imgTFresa from '../../assets/products/t-fresa.png';
import imgTvClasicos from '../../assets/products/tv-clasicos.png';

// Resuelve la foto REAL del producto ligado a la oferta (viene anidada en o.producto.imagenUrl)
const resolverImagenOferta = (o) => {
  const url = o?.producto?.imagenUrl;
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
};

// Lógica de estado
const calcularEstadoOferta = (o) => {
  if (o.oferActiva === false) return "Inactiva";
  const hoy = new Date().toISOString().slice(0, 10);
  if (o.oferFechaInicio && hoy < o.oferFechaInicio) return "Programada";
  if (o.oferFechaFin && hoy > o.oferFechaFin) return "Finalizada";
  return "Activa";
};

const AdminOfertasTab = () => {

  // LÓGICA DE ESTADOS
  const [ofertas, setOfertas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 6;
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ofertaAEditar, setOfertaAEditar] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(null); // Para 3 puntos

  // LLAMADAS A LA API
  const cargar = () => {
    setCargando(true);
    Promise.all([
      apiGet("/api/admin/ofertas").catch(() => []),
      apiGet("/api/admin/productos").catch(() => []),
    ]).then(([ofs, prods]) => {
      setOfertas(Array.isArray(ofs) ? ofs : []);
      setProductos(Array.isArray(prods) ? prods : []);
      setError("");
    }).catch(() => setError("No se pudieron cargar las ofertas. Verificando conexión..."))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  // FUNCIONES CRUD
  const toggleActiva = async (o) => {
    try { 
      await apiPut(`/api/admin/ofertas/${o.oferId}/toggle`); 
      setMenuAbierto(null);
      cargar(); 
    } catch (e) { alert(e.message); }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta oferta permanentemente?")) return;
    try { 
      await apiDelete(`/api/admin/ofertas/${id}`); 
      setMenuAbierto(null);
      cargar(); 
    } catch (e) { alert(e.message); }
  };

  const guardar = async (form) => {
    // Validaciones mejoradas
    if (!form.titulo.trim()) { alert("El título de la oferta es obligatorio."); return; }
    if (form.descuento === "" || form.descuento == null) { alert("El descuento es obligatorio."); return; }
    const dcto = Number(form.descuento);
    if (isNaN(dcto) || dcto <= 0 || dcto > 100) { alert("El descuento debe ser un número entre 1 y 100."); return; }
    if (!form.fechaInicio) { alert("La fecha de inicio es obligatoria."); return; }
    if (!form.fechaFin) { alert("La fecha de fin es obligatoria."); return; }
    if (form.fechaFin < form.fechaInicio) { alert("La fecha de fin no puede ser anterior a la de inicio."); return; }

    const body = {
      oferTitulo: form.titulo,
      oferDescripcion: form.descripcion,
      oferDescuento: dcto,
      tipo: form.tipo,
      oferFechaInicio: form.fechaInicio || null,
      oferFechaFin: form.fechaFin || null,
      oferActiva: form.activa,
      producto: form.productoId ? { id: Number(form.productoId) } : null,
    };
    try {
      if (ofertaAEditar) await apiPut(`/api/admin/ofertas/${ofertaAEditar.oferId}`, body);
      else await apiPost("/api/admin/ofertas", body);
      setModalAbierto(false); 
      setOfertaAEditar(null); 
      cargar();
    } catch (e) { alert(e.message); }
  };

  // FILTROS Y PAGINACIÓN
  const filtradas = useMemo(() => {
    let arr = ofertas;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      arr = arr.filter(o => (o.oferTitulo || "").toLowerCase().includes(q) || (o.oferDescripcion || "").toLowerCase().includes(q));
    }
    if (filtroEstado !== "Todos") arr = arr.filter(o => calcularEstadoOferta(o) === filtroEstado);
    if (filtroTipo !== "Todos") arr = arr.filter(o => (o.tipo || "Porcentaje") === filtroTipo);
    return arr;
  }, [ofertas, busqueda, filtroEstado, filtroTipo]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
  const pagina = Math.min(paginaActual, totalPaginas);
  const visibles = filtradas.slice((pagina - 1) * porPagina, pagina * porPagina);
  
  useEffect(() => { setPaginaActual(1); }, [busqueda, filtroEstado, filtroTipo]);

  // KPIs DINÁMICOS
  const cuentaEstado = (e) => ofertas.filter(o => calcularEstadoOferta(o) === e).length;
  
  const kpis = [
    { valor: cuentaEstado("Activa") || "0", etiqueta: "Ofertas activas", extra: "↑ vs mes pasado", extraColor: "#27AE60", icon: "fa-solid fa-ticket", color: "#F194B4", border: "#FADADD" },
    { valor: cuentaEstado("Programada") || "0", etiqueta: "Programadas", extra: "Próximos 30 días", extraColor: "#999", icon: "fa-regular fa-calendar", color: "#F2C94C", border: "#FDE49E" },
    { valor: cuentaEstado("Finalizada") || "0", etiqueta: "Finalizadas", extra: "Este mes", extraColor: "#999", icon: "fa-regular fa-circle-check", color: "#27AE60", border: "#A9DFBF" },
    { valor: "0%", etiqueta: "Aumento en ventas", extra: "↑ vs. sin ofertas", extraColor: "#27AE60", icon: "fa-solid fa-arrow-trend-up", color: "#9B59B6", border: "#D7BDE2" },
  ];

  // DISEÑO: COLORES
  const getColorTipo = (tipo) => {
    switch (tipo) {
      case "Porcentaje": return "#C6676D";
      case "Envío gratis": return "#6A8BBD";
      case "3x2": return "#9B59B6";
      default: return "#777";
    }
  };

  const getColorEstadoUI = (estado) => {
    switch (estado) {
      case "Activa": return "#27AE60";
      case "Finalizada": return "#999";
      case "Programada": return "#6A8BBD";
      case "Inactiva": return "#E74C3C";
      default: return "#777";
    }
  };

  // Oferta Destacada (La primera activa, o un placeholder)
  const ofertaDestacada = ofertas.find(o => calcularEstadoOferta(o) === "Activa") || {
    oferTitulo: "Sin oferta destacada", oferDescripcion: "Crea una oferta para destacarla aquí",
    oferFechaFin: "00/00/0000", tipo: "-", usos: 0, vacia: true
  };

  const btnStyleMenu = { background: 'none', border: 'none', padding: '10px 15px', textAlign: 'left', cursor: 'pointer', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41', width: '100%', transition: 'background 0.2s' };

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>

      {/* TÍTULO Y BOTÓN NUEVA OFERTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
            OFERTAS
          </h1>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>
            Crea y gestiona las ofertas y promociones de tu tienda.
          </p>
        </div>
        <button onClick={() => { setOfertaAEditar(null); setModalAbierto(true); }} style={{ backgroundColor: '#FCF0F2', color: '#C3666D', border: '1.5px solid #FADADD', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Poppins-SemiBold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
          <i className="fa-solid fa-tags"></i> Nueva oferta
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: `2px solid ${kpi.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: kpi.color, fontSize: '24px', flexShrink: 0 }}>
              <i className={kpi.icon}></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '2px' }}>
                <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '28px', color: '#5A3E41', margin: '0', lineHeight: '1' }}>{kpi.valor}</h2>
              </div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: '0 0 5px 0' }}>{kpi.etiqueta}</p>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '11px', color: kpi.extraColor, margin: 0 }}>
                {kpi.extra}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #D9D9D9', borderRadius: '8px', padding: '0 15px', backgroundColor: 'white' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#999', fontSize: '16px' }}></i>
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar oferta..." 
            style={{ border: 'none', outline: 'none', width: '100%', padding: '12px 10px', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41' }}
          />
        </div>
        
        {/* Select Estado Funcional */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '11px', color: '#5A3E41', marginLeft: '5px' }}>Estado</span>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ border: '1px solid #D9D9D9', borderRadius: '8px', padding: '10px 15px', backgroundColor: 'white', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', width: '150px', cursor: 'pointer', outline: 'none' }}>
            {["Todos", "Activa", "Programada", "Finalizada", "Inactiva"].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Select Tipo Funcional */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '11px', color: '#5A3E41', marginLeft: '5px' }}>Tipo</span>
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ border: '1px solid #D9D9D9', borderRadius: '8px', padding: '10px 15px', backgroundColor: 'white', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', width: '150px', cursor: 'pointer', outline: 'none' }}>
            {["Todos", "Porcentaje", "Envío gratis", "3x2"].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button style={{ backgroundColor: 'white', color: '#C3666D', border: '1.5px solid #C3666D', borderRadius: '8px', padding: '0 25px', height: '42px', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-filter"></i> Filtros
          </button>
        </div>
      </div>

      {/* ESTADOS DE CARGA */}
      {cargando && <p style={{ color: '#999', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>Cargando ofertas de la base de datos...</p>}
      {error && <p style={{ color: '#C6676D', fontFamily: 'Poppins-Medium', textAlign: 'center' }}>{error}</p>}

      {/* OFERTA ACTIVA DESTACADA */}
      <div style={{ backgroundColor: 'white', border: '1.5px solid #FADADD', borderRadius: '15px', padding: '30px', marginBottom: '35px', position: 'relative', opacity: ofertaDestacada.vacia ? 0.6 : 1 }}>
        <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#C3666D', margin: '0 0 20px 0' }}>Oferta activa destacada</h3>
        
        {!ofertaDestacada.vacia && (
          <div style={{ position: 'absolute', top: '30px', right: '30px', border: '1.5px solid #C3666D', color: '#C3666D', backgroundColor: '#FCF0F2', padding: '4px 15px', borderRadius: '20px', fontFamily: 'Poppins-Medium', fontSize: '12px' }}>
            Activa
          </div>
        )}

        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <img src={ofertaDestacada.vacia ? imgTcTripleChocolate : (resolverImagenOferta(ofertaDestacada) || imgTcTripleChocolate)} alt="Destacada" onError={(e) => { e.target.onerror = null; e.target.src = imgTcTripleChocolate; }} style={{ width: '220px', height: '140px', objectFit: 'cover', borderRadius: '12px' }} />
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 8px 0' }}>{ofertaDestacada.oferTitulo}</h2>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: '0 0 25px 0' }}>{ofertaDestacada.oferDescripcion}</p>
            
            <div style={{ display: 'flex', gap: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-regular fa-calendar-xmark" style={{ color: '#F194B4', fontSize: '20px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-SemiBold', fontSize: '12px', color: '#777', margin: '0 0 2px 0' }}>Vigente hasta</p>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: 0 }}>{ofertaDestacada.oferFechaFin || "Sin límite"}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-percent" style={{ color: '#F194B4', fontSize: '20px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-SemiBold', fontSize: '12px', color: '#777', margin: '0 0 2px 0' }}>Tipo</p>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: 0 }}>{ofertaDestacada.tipo || "General"}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-cart-shopping" style={{ color: '#F194B4', fontSize: '20px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-SemiBold', fontSize: '12px', color: '#777', margin: '0 0 2px 0' }}>Aplicado a</p>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: 0 }}>{ofertaDestacada.producto ? "1 Producto" : "General"}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-regular fa-user" style={{ color: '#F194B4', fontSize: '20px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-SemiBold', fontSize: '12px', color: '#777', margin: '0 0 2px 0' }}>Usada</p>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: 0 }}>{ofertaDestacada.usos || 0} veces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DE OFERTAS */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #EAEAEA', overflow: 'hidden', padding: '15px 30px', marginBottom: '30px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #FDF2F3' }}>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Oferta</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Tipo</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Descuento</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Vigencia</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Estado</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Uso</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!cargando && visibles.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#999', fontFamily: 'Poppins-Regular' }}>No se encontraron ofertas.</td></tr>
            ) : (
              visibles.map((oferta) => {
                const est = calcularEstadoOferta(oferta);
                const tipoReal = oferta.tipo || "Porcentaje";
                const isMenuOpen = menuAbierto === oferta.oferId;

                return (
                  <tr key={oferta.oferId} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '15px 10px', verticalAlign: 'middle', width: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={resolverImagenOferta(oferta) || imgAClasico} alt="Oferta" onError={(e) => { e.target.onerror = null; e.target.src = imgTcTripleChocolate; }} style={{ width: '60px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontFamily: 'Poppins-Bold', fontSize: '13px', color: '#5A3E41', margin: '0 0 2px 0' }}>{oferta.oferTitulo}</div>
                          <div style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', color: '#777', maxWidth: '200px' }}>{oferta.oferDescripcion || "Sin descripción"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                      <span style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: getColorTipo(tipoReal) }}>{tipoReal}</span>
                    </td>
                    <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                      <div style={{ fontFamily: 'Poppins-Bold', fontSize: '13px', color: '#5A3E41' }}>{oferta.oferDescuento ? `${oferta.oferDescuento}%` : "Especial"}</div>
                      <div style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', color: '#777' }}>{oferta.producto ? "Prod. específico" : "General"}</div>
                    </td>
                    <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                      <span style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777' }}>{oferta.oferFechaInicio || "?"} - {oferta.oferFechaFin || "?"}</span>
                    </td>
                    <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                      <span style={{ fontFamily: 'Poppins-Bold', fontSize: '12px', color: getColorEstadoUI(est) }}>{est}</span>
                    </td>
                    <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                      <span style={{ fontFamily: 'Poppins-Bold', fontSize: '13px', color: '#5A3E41' }}>{oferta.usos || 0} veces</span>
                    </td>
                    <td style={{ padding: '15px 10px', verticalAlign: 'middle', textAlign: 'center', position: 'relative' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button style={{ border: '1.5px solid #F194B4', backgroundColor: 'transparent', color: '#F194B4', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <i className="fa-regular fa-eye"></i>
                        </button>
                        <button onClick={() => setMenuAbierto(isMenuOpen ? null : oferta.oferId)} style={{ border: '1.5px solid #F194B4', backgroundColor: 'transparent', color: '#F194B4', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        {/* Menú Desplegable */}
                        {isMenuOpen && (
                          <div style={{ position: 'absolute', right: '40px', top: '15px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0px 4px 15px rgba(0,0,0,0.15)', padding: '5px 0', width: '130px', zIndex: 100, border: '1px solid #FADADD', textAlign: 'left' }}>
                            <button style={btnStyleMenu} onClick={() => toggleActiva(oferta)}>
                              {oferta.oferActiva ? "🔴 Desactivar" : "🟢 Activar"}
                            </button>
                            <button style={btnStyleMenu} onClick={() => { setOfertaAEditar(oferta); setModalAbierto(true); setMenuAbierto(null); }}>✏️ Editar</button>
                            <button style={{...btnStyleMenu, color: '#C6676D'}} onClick={() => eliminar(oferta.oferId)}>🗑 Eliminar</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>
            Mostrando de {(pagina - 1) * porPagina + (visibles.length > 0 ? 1 : 0)}-{Math.min(pagina * porPagina, filtradas.length)} de {filtradas.length} ofertas
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
              <button 
                key={n} onClick={() => setPaginaActual(n)} 
                style={{ border: pagina === n ? 'none' : '1px solid #D9D9D9', background: pagina === n ? '#C3666D' : 'white', color: pagina === n ? 'white' : '#5A3E41', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Bold', fontSize: '14px' }}>
                {n}
              </button>
            ))}
            
            <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

      {/* MODAL NUEVA/EDITAR OFERTA */}
      {modalAbierto && (
        <ModalOferta 
          oferta={ofertaAEditar} 
          productos={productos}
          onCancelar={() => { setModalAbierto(false); setOfertaAEditar(null); }} 
          onGuardar={guardar} 
        />
      )}

    </div>
  );
};

// Componente Modal adaptado a tu Diseño UI
function ModalOferta({ oferta, productos, onCancelar, onGuardar }) {
  const [form, setForm] = useState({
    titulo: oferta?.oferTitulo || "",
    descripcion: oferta?.oferDescripcion || "",
    descuento: oferta?.oferDescuento ?? "",
    tipo: oferta?.tipo || "Porcentaje", // Agregado tipo de diseño
    fechaInicio: oferta?.oferFechaInicio || "",
    fechaFin: oferta?.oferFechaFin || "",
    activa: oferta?.oferActiva ?? true,
    productoId: oferta?.producto?.id || "",
  });
  
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #D9D9D9', boxSizing: 'border-box', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41', outline: 'none' };
  
  const submit = () => { 
    if (!form.titulo.trim()) { alert("El título de la oferta es obligatorio."); return; } 
    onGuardar(form); 
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
      <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '20px', width: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid #FADADD', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Poppins-Bold', color: '#5A3E41', marginTop: 0, fontSize: '20px' }}>
          {oferta ? "Editar Oferta" : "Nueva Oferta"}
        </h2>
        
        <input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título de la oferta (Ej. 20% en tortas)" style={inputStyle} />
        <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Descripción corta" rows={2} style={{ ...inputStyle, resize: 'none' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={form.tipo} onChange={e => set('tipo', e.target.value)} style={{...inputStyle, flex: 1}}>
            <option value="Porcentaje">Porcentaje</option>
            <option value="Envío gratis">Envío gratis</option>
            <option value="3x2">3x2</option>
          </select>
          <input type="number" step="0.01" value={form.descuento} onChange={e => set('descuento', e.target.value)} placeholder="Dcto (%)" style={{...inputStyle, flex: 1}} disabled={form.tipo !== "Porcentaje"} />
        </div>

        <label style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', marginTop: '10px', display: 'block' }}>Vigencia de la oferta</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '10px', color: '#999' }}>Inicio</span>
            <input type="date" value={form.fechaInicio} onChange={e => set('fechaInicio', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '10px', color: '#999' }}>Fin</span>
            <input type="date" value={form.fechaFin} onChange={e => set('fechaFin', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <label style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', marginTop: '10px', display: 'block' }}>Aplicar a producto (Opcional)</label>
        <select value={form.productoId} onChange={e => set('productoId', e.target.value)} style={inputStyle}>
          <option value="">— Aplica a todos los productos —</option>
          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Poppins-Medium', color: '#5A3E41', marginTop: '15px', fontSize: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.activa} onChange={e => set('activa', e.target.checked)} style={{ accentColor: '#C3666D', width: '18px', height: '18px' }} /> 
          Mantener oferta Activa
        </label>

        <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
          <button onClick={onCancelar} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #D9D9D9', background: 'white', color: '#777', cursor: 'pointer', fontFamily: 'Poppins-SemiBold', fontSize: '14px', transition: 'all 0.2s' }}>Cancelar</button>
          <button onClick={submit} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#C3666D', color: 'white', cursor: 'pointer', fontFamily: 'Poppins-SemiBold', fontSize: '14px', boxShadow: '0 4px 10px rgba(195, 102, 109, 0.3)', transition: 'all 0.2s' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default AdminOfertasTab;