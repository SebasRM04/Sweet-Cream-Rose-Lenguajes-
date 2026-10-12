import React, { useState, useMemo } from "react";

const AdminNotificaciones = () => {

  // Inicializado en vacío a la espera de backend
  const [items, setItems] = useState([]);
  const [filtro, setFiltro] = useState("Todas las notificaciones");
  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  // Lógica de acciones
  const marcarLeida = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const marcarTodas = () => setItems(prev => prev.map(n => ({ ...n, unread: false })));

  // Cálculos dinámicos (Se calculan en 0 automáticamente si el array está vacío)
  const total = items.length;
  const noLeidas = items.filter(n => n.unread).length;
  const leidas = total - noLeidas;

  // Filtro principal
  const filtrados = useMemo(() => {
    if (filtro === "No leídas") return items.filter(n => n.unread);
    if (filtro === "Leídas") return items.filter(n => !n.unread);
    return items;
  }, [items, filtro]);

  // Paginación dinámica
  const totalPag = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const pag = Math.min(pagina, totalPag);
  const visibles = filtrados.slice((pag - 1) * porPagina, pag * porPagina);

  // KPIs dinámicos
  const kpis = [
    { titulo: "Total de notificaciones", valor: total, detalle: "todas las notificaciones", icon: "fa-regular fa-bell", color: "#F194B4", border: "#FADADD" },
    { titulo: "No leídas", valor: noLeidas, detalle: "pendientes por leer", icon: "fa-regular fa-envelope", color: "#F2C94C", border: "#FDE49E" },
    { titulo: "Leídas", valor: leidas, detalle: "notificaciones leídas", icon: "fa-regular fa-circle-check", color: "#27AE60", border: "#A9DFBF" },
    { titulo: "Hoy", valor: items.filter(n => n.tiempo?.toLowerCase().includes("hace")).length, detalle: "recibidas hoy", icon: "fa-regular fa-calendar", color: "#9B59B6", border: "#D7BDE2" },
  ];

  // Filtros dinámicos (Estado)
  const filtrosEstado = [
    { label: "Todas las notificaciones", count: total, icon: "fa-regular fa-bell", color: "#C6676D" },
    { label: "No leídas", count: noLeidas, icon: "fa-regular fa-envelope", color: "#999" },
    { label: "Leídas", count: leidas, icon: "fa-regular fa-circle-check", color: "#999" }
  ];

  // Filtros estáticos a la espera de BD
  const filtrosTipo = [
    { label: "Pedidos", count: 0, icon: "fa-solid fa-bag-shopping", color: "#F2C94C" },
    { label: "Pagos", count: 0, icon: "fa-solid fa-money-bill-wave", color: "#27AE60" },
    { label: "Productos", count: 0, icon: "fa-solid fa-box", color: "#F39C12" },
    { label: "Comentarios", count: 0, icon: "fa-regular fa-comment-dots", color: "#9B59B6" },
    { label: "Sistema", count: 0, icon: "fa-solid fa-gear", color: "#9B59B6" },
    { label: "Recordatorios", count: 0, icon: "fa-solid fa-cloud", color: "#5DADE2" }
  ];

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>
      
      {/* TÍTULO */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0' }}>Notificaciones</h1>
        <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>Revisa todas las notificaciones y novedades del sistema.</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: `1.5px solid ${kpi.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ color: kpi.color, fontSize: '32px', flexShrink: 0 }}>
              <i className={kpi.icon}></i>
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', margin: '0 0 2px 0' }}>{kpi.titulo}</p>
              <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '24px', color: '#5A3E41', margin: '0 0 2px 0', lineHeight: '1.2' }}>{kpi.valor}</h2>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', color: '#999', margin: 0 }}>{kpi.detalle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL (LISTA + FILTROS) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '25px', marginBottom: '35px' }}>
        
        {/* COLUMNA IZQUIERDA: LISTA DE NOTIFICACIONES */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <div style={{ color: '#F194B4', fontSize: '20px' }}><i className="fa-regular fa-bell"></i></div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Notificaciones recientes</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', flexGrow: 1 }}>
            {visibles.length === 0 ? (
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', textAlign: 'center', margin: '40px 0' }}>No hay notificaciones para mostrar en este momento.</p>
            ) : (
              visibles.map((noti, index) => (
                <div 
                  key={noti.id || index} 
                  onClick={() => marcarLeida(noti.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: index !== visibles.length - 1 ? '1px solid #F5F5F5' : 'none', paddingBottom: index !== visibles.length - 1 ? '20px' : '0', cursor: noti.unread ? 'pointer' : 'default', opacity: noti.unread ? 1 : 0.6 }}
                >
                  <div>
                    <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', margin: '0 0 5px 0' }}>{noti.titulo}</h4>
                    <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>{noti.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#999', whiteSpace: 'nowrap' }}>{noti.tiempo}</span>
                    {noti.unread ? (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C6676D' }}></div>
                    ) : (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'transparent' }}></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginación dinámica (Solo se muestra si hay items) */}
          {total > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>
                Mostrando página {pag} de {totalPag} ({total} notificaciones)
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => setPagina(p => Math.max(p - 1, 1))} style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium' }}><i className="fa-solid fa-arrow-left"></i></button>
                <button style={{ border: 'none', background: '#C3666D', color: 'white', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Bold', fontSize: '13px' }}>{pag}</button>
                <button onClick={() => setPagina(p => Math.min(p + 1, totalPag))} style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium' }}><i className="fa-solid fa-arrow-right"></i></button>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: FILTROS Y CONFIGURACIÓN */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <div style={{ color: '#F194B4', fontSize: '20px' }}><i className="fa-solid fa-filter"></i></div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Filtros y configuración</h3>
          </div>

          {/* Estado */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', margin: '0 0 15px 0' }}>Estado</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filtrosEstado.map((est, i) => (
                <div 
                  key={i} 
                  onClick={() => { setFiltro(est.label); setPagina(1); }} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '5px', borderRadius: '6px', backgroundColor: filtro === est.label ? '#FFF6F7' : 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: filtro === est.label ? '#C6676D' : '#777' }}>
                    <i className={est.icon} style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}></i>
                    <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px' }}>{est.label}</span>
                  </div>
                  <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: filtro === est.label ? '#C6676D' : '#777' }}>{est.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tipo de notificación (En 0) */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', margin: '0 0 15px 0' }}>Tipo de notificación</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filtrosTipo.map((tipo, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className={tipo.icon} style={{ fontSize: '16px', width: '20px', textAlign: 'center', color: tipo.color }}></i>
                    <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777' }}>{tipo.label}</span>
                  </div>
                  <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{tipo.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fecha */}
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', margin: '0 0 15px 0' }}>Fecha</h4>
            <div style={{ border: '1px solid #D9D9D9', borderRadius: '8px', padding: '10px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', cursor: 'pointer' }}>
              <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>DD/MM/AAAA</span>
              <i className="fa-regular fa-calendar" style={{ color: '#5A3E41' }}></i>
            </div>
          </div>

          {/* Botón Marcar Leídas */}
          <button 
            onClick={marcarTodas} 
            disabled={noLeidas === 0} 
            style={{ 
              width: '100%', 
              backgroundColor: noLeidas === 0 ? '#FAFAFA' : 'transparent', 
              color: noLeidas === 0 ? '#ccc' : '#C6676D', 
              border: `1.5px solid ${noLeidas === 0 ? '#EAEAEA' : '#C6676D'}`, 
              borderRadius: '8px', 
              padding: '12px', 
              fontFamily: 'Poppins-Medium', 
              fontSize: '13px', 
              cursor: noLeidas === 0 ? 'default' : 'pointer', 
              transition: 'all 0.2s' 
            }}
          >
            Marcar todas como leídas
          </button>

        </div>
      </div>

      {/* BANNER INFERIOR */}
      <div style={{ backgroundColor: '#FFF6F7', borderRadius: '12px', padding: '30px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #FADADD', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ color: '#F194B4', fontSize: '60px' }}>
            <i className="fa-regular fa-bell"></i>
          </div>
          <div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#C6676D', margin: '0 0 5px 0' }}>¡Mantente al día!</h3>
            <p style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', margin: 0, maxWidth: '500px', lineHeight: '1.4' }}>
              Activa las notificaciones para no perderte ninguna actualización importante sobre tu negocio.
            </p>
          </div>
        </div>
        <div style={{ color: '#F194B4', fontSize: '50px' }}>
          <i className="fa-solid fa-cupcake"></i>
        </div>
      </div>

      {/* FOOTER */}
      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

    </div>
  );
};

export default AdminNotificaciones;