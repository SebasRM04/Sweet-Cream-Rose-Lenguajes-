import React, { useState, useEffect, useMemo } from "react";
import { apiGet, apiPut } from "../../api";

// Estados válidos del backend
const ESTADOS = ["Pendiente", "Confirmada", "Completada", "Cancelado"];

const ETIQUETAS_ENTREGA = {
  Delivery:     { texto: 'Envío a domicilio', icono: 'fa-solid fa-motorcycle' },
  Recojo:       { texto: 'Recojo en tienda', icono: 'fa-solid fa-store' },
  ConsumoLocal: { texto: 'Consumo en local', icono: 'fa-solid fa-mug-saucer' },
};

// Función original para estilos
const obtenerEstilosEstado = (estado) => {
  switch (estado) {
    case "Pendiente": return { bg: "#FADADD", color: "#C6676D", icon: "fa-regular fa-circle" };
    case "Confirmada": return { bg: "#FFF9E6", color: "#D9A600", icon: "fa-regular fa-circle-check" };
    case "Completada": return { bg: "#E9F7EF", color: "#27AE60", icon: "fa-regular fa-circle-check" };
    case "Cancelado": return { bg: "#F4ECF7", color: "#9B59B6", icon: "fa-regular fa-circle-xmark" };
    default: return { bg: "#FADADD", color: "#C6676D", icon: "fa-regular fa-circle" };
  }
};

const AdminPedidosTab = () => {
  // Estados para API y UI
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState("Todos");
  
  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({ cliente: '', productos: '', precio: '' });

  // Lógica del backend
  const cargar = () => {
    setCargando(true);
    apiGet("/api/admin/pedidos")
      .then(data => { setPedidos(Array.isArray(data) ? data : []); })
      .catch(() => { /* Error silencioso, se mostrará vacío */ })
      .finally(() => setCargando(false));
  };
  
  useEffect(() => { cargar(); }, []);

  const cambiarEstado = async (id, estado) => {
    try {
      await apiPut(`/api/admin/pedidos/${id}/estado`, { estado });
      setPedidos(prev => prev.map(o => o.id === id ? { ...o, estado } : o));
    } catch (e) { alert(e.message); }
  };

  // Función Guardar Modal
  const guardarPedido = () => {
    const nuevo = { 
      id: Math.floor(Math.random() * 999), 
      usuario: { nombre: nuevoPedido.cliente }, 
      detalles: Array.from({ length: Number(nuevoPedido.productos) || 0 }), 
      fecha: new Date().toISOString(), 
      estado: 'Pendiente', 
      total: Number(nuevoPedido.precio) || 0,
      delivery: 'Delivery (Local)' 
    };
    setPedidos([nuevo, ...pedidos]);
    setModalAbierto(false);
    setNuevoPedido({ cliente: '', productos: '', precio: '' });
  };

  // Cálculos dinámicos para los Tabs respetando tus colores
  const tabs = useMemo(() => ([
    { label: "Todos", count: pedidos.length, colorBadge: "#C3666D", bgBadge: "#FDF2F3" },
    { label: "Pendientes", count: pedidos.filter(p => p.estado === "Pendiente").length, colorBadge: "#C6676D", bgBadge: "#FADADD" },
    { label: "Confirmadas", count: pedidos.filter(p => p.estado === "Confirmada").length, colorBadge: "#D9A600", bgBadge: "#FFF9E6" },
    { label: "Completadas", count: pedidos.filter(p => p.estado === "Completada").length, colorBadge: "#27AE60", bgBadge: "#E9F7EF" },
    { label: "Cancelados", count: pedidos.filter(p => p.estado === "Cancelado").length, colorBadge: "#9B59B6", bgBadge: "#F4ECF7" },
  ]), [pedidos]);

  // Filtro visual
  const visibles = pedidos.filter(p => {
    if (tabActiva === "Todos") return true;
    if (tabActiva === "Pendientes") return p.estado === "Pendiente";
    if (tabActiva === "Confirmadas") return p.estado === "Confirmada";
    if (tabActiva === "Completadas") return p.estado === "Completada";
    if (tabActiva === "Cancelados") return p.estado === "Cancelado";
    return p.estado === tabActiva;
  });

  const fmtFecha = (f) => {
    if (!f) return "--";
    try { return new Date(f).toLocaleString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return "--"; }
  };

  // Estilos reutilizables
  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1.5px solid #FADADD', fontFamily: 'Poppins-Regular', outline: 'none' };
  const btnStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins-Bold' };

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%', position: 'relative' }}>
      
      {/* MODAL NUEVO PEDIDO */}
      {modalAbierto && (
        <div style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.3)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:999 }}>
          <div style={{ backgroundColor:'white', padding:'30px', borderRadius:'12px', width:'320px', border: '1.5px solid #FADADD' }}>
            <h3 style={{fontFamily:'Poppins-Bold', color: '#5A3E41', marginBottom: '20px'}}>Nuevo Pedido Manual</h3>
            <input placeholder="Nombre del Cliente" style={inputStyle} onChange={(e) => setNuevoPedido({...nuevoPedido, cliente: e.target.value})} />
            <input placeholder="Cant. Productos" type="number" style={inputStyle} onChange={(e) => setNuevoPedido({...nuevoPedido, productos: e.target.value})} />
            <input placeholder="Precio Total (S/)" type="number" style={inputStyle} onChange={(e) => setNuevoPedido({...nuevoPedido, precio: e.target.value})} />
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                <button style={{...btnStyle, backgroundColor: '#FDF2F3', color: '#C3666D'}} onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button style={{...btnStyle, backgroundColor: '#C3666D', color: 'white'}} onClick={guardarPedido}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* TÍTULO Y BOTÓN AGREGAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
            PEDIDOS
          </h1>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>
            Gestiona las ventas registradas: confirmar, completar o cancelar.
          </p>
        </div>
        <button onClick={() => setModalAbierto(true)} style={{ backgroundColor: '#FCF0F2', color: '#C3666D', border: '1.5px solid #C3666D', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Poppins-SemiBold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
          <i className="fa-solid fa-bag-shopping"></i> AGREGAR PEDIDO
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS (Restaurada) */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '35px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #D9D9D9', borderRadius: '8px', padding: '0 15px', backgroundColor: 'white' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#999', fontSize: '16px' }}></i>
          <input 
            type="text" 
            placeholder="Buscar el pedido por ID, cliente o producto ..." 
            style={{ border: 'none', outline: 'none', width: '100%', padding: '12px 10px', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41' }}
          />
        </div>
        <button style={{ backgroundColor: 'white', color: '#C3666D', border: '1.5px solid #C3666D', borderRadius: '8px', padding: '0 25px', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-filter"></i> Filtros
        </button>
      </div>

      {/* TABS (ESTADOS DE PEDIDO) */}
      <div style={{ display: 'flex', borderBottom: '2px solid #FDF2F3', marginBottom: '30px' }}>
        {tabs.map((tab) => {
          const isActive = tabActiva === tab.label;
          return (
            <div 
              key={tab.label}
              onClick={() => setTabActiva(tab.label)}
              style={{
                flex: 1, textAlign: 'center', paddingBottom: '15px', cursor: 'pointer', borderBottom: isActive ? '3px solid #C3666D' : '3px solid transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
              }}
            >
              <span style={{ fontFamily: 'Poppins-Bold', fontSize: '15px', color: isActive ? '#5A3E41' : '#A08D8F' }}>
                {tab.label}
              </span>
              <span style={{ backgroundColor: tab.bgBadge, color: tab.colorBadge, fontFamily: 'Poppins-Bold', fontSize: '12px', padding: '2px 12px', borderRadius: '15px' }}>
                {tab.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* LISTA DE PEDIDOS (Con lógica de estado) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        {cargando && <p style={{ color: '#999', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>Cargando pedidos…</p>}
        
        {!cargando && visibles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontFamily: 'Poppins-Medium' }}>
            Aún no hay pedidos en esta categoría.
          </div>
        )}

        {!cargando && visibles.map((pedido, index) => {
          const styles = obtenerEstilosEstado(pedido.estado);
          const numProductos = pedido.detalles?.length || pedido.productos || 0;
          const precioTotal = Number(pedido.total || pedido.precio?.replace('S/ ', '') || 0).toFixed(2);
          const clienteNom = pedido.usuario ? `${pedido.usuario.nombre || ''} ${pedido.usuario.apellido || ''}`.trim() : (pedido.cliente || 'Cliente Anónimo');

          return (
            <div key={index} style={{ border: '1.5px solid #FADADD', borderRadius: '12px', padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
              
              {/* Lado Izquierdo (Icono + Info) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '55px', height: '55px', backgroundColor: '#FDF2F3', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#F194B4', fontSize: '22px', flexShrink: 0 }}>
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: '0 0 2px 0' }}>Pedido #{pedido.codigoSeguimiento || String(pedido.id).padStart(6, '0')}</h3>
                  <p style={{ fontFamily: 'Poppins-SemiBold', fontSize: '14px', color: '#5A3E41', margin: '0 0 2px 0' }}>{clienteNom}</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: '0 0 5px 0' }}>{numProductos} productos</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#999', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fa-regular fa-clock"></i> {fmtFecha(pedido.fecha)}
                  </p>
                </div>
              </div>

              {/* Lado Derecho (Estado + Select Backend + Precio + Delivery + Menú) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  
                  {/* Etiqueta Visual de Estado */}
                  <div style={{ backgroundColor: styles.bg, color: styles.color, padding: '4px 14px', borderRadius: '20px', fontFamily: 'Poppins-Medium', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className={styles.icon}></i> {pedido.estado}
                  </div>
                  
                  {/* Select interactivo del Backend */}
                  <select 
                    value={pedido.estado} 
                    onChange={e => cambiarEstado(pedido.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D9D9D9', fontFamily: 'Poppins-Medium', fontSize: '11px', color: '#777', cursor: 'pointer', backgroundColor: '#FAFAFA' }}
                  >
                    {ESTADOS.map(es => <option key={es} value={es}>Marcar como {es}</option>)}
                  </select>

                  <div style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41' }}>
                    S/ {precioTotal}
                  </div>
                  <div style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#C3666D', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className={ETIQUETAS_ENTREGA[pedido.tipoEntrega]?.icono || 'fa-solid fa-store'}></i>
                    {ETIQUETAS_ENTREGA[pedido.tipoEntrega]?.texto || 'Recojo en tienda'}
                  </div>
                </div>

                {/* Botón de opciones */}
                <button style={{ border: '1.5px solid #F194B4', backgroundColor: 'transparent', color: '#F194B4', width: '35px', height: '45px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' }}>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINACIÓN (Maqueta) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '30px', opacity: cargando || visibles.length === 0 ? 0 : 1 }}>
        <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>
          Mostrando de 1-{visibles.length} de {pedidos.length} pedidos
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium' }}><i className="fa-solid fa-arrow-left"></i></button>
          <button style={{ border: 'none', background: '#C3666D', color: 'white', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Bold', fontSize: '14px' }}>1</button>
          <button style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium' }}><i className="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

    </div>
  );
};

export default AdminPedidosTab;