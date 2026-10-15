import React, { useState, useEffect, useMemo } from "react";

import logoPrincipal from '../../assets/logo.png'; 
import imgTcTripleChocolate from '../../assets/products/tc-triple-chocolate.png';
import imgAClasico from '../../assets/products/a-clasico.png';
import imgCArandano from '../../assets/products/c-arandano.png';
import imgTFresa from '../../assets/products/t-fresa.png';
import imgTvClasicos from '../../assets/products/tv-clasicos.png';

import { apiGet, apiPut, apiDelete } from "../../api";

const AdminComentariosTab = () => {

  // Lógica de estado
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const cargar = () => {
    setCargando(true);
    Promise.all([
      apiGet("/api/comentarios/aprobados").catch(() => []),
      apiGet("/api/comentarios/pendientes").catch(() => []),
    ]).then(([apr, pen]) => {
      // Si falla el backend, los arrays llegan vacíos
      const a = (Array.isArray(apr) ? apr : []).map(c => ({ ...c, _aprobado: true }));
      const p = (Array.isArray(pen) ? pen : []).map(c => ({ ...c, _aprobado: false }));
      setComentarios([...p, ...a]);
      setError("");
    }).catch(() => {
      setComentarios([]); // Fallback a 0
      setError("");
    }).finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  // Funciones de acción
  const aprobar = async (id) => {
    try { await apiPut(`/api/comentarios/${id}/aprobar`); cargar(); }
    catch (e) { console.log("Error al aprobar:", e.message); }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    try { await apiDelete(`/api/comentarios/${id}`); cargar(); }
    catch (e) { console.log("Error al eliminar:", e.message); }
  };

  const exportarCSV = () => {
    const filas = [["Nombre", "Producto", "Calificacion", "Comentario", "Estado"]];
    comentarios.forEach(c => filas.push([
      c.nombre || (c.usuario ? c.usuario.nombre : "Anónimo"),
      c.producto?.nombre || "--",
      c.calificacion ?? "0",
      (c.contenido || "").replace(/\n/g, " "),
      c._aprobado ? "Aprobado" : "Pendiente",
    ]));
    const csv = filas.map(f => f.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url; a.download = "Reporte_Comentarios.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Filtrado reactivo (Buscador y Pestañas)
  const filtrados = useMemo(() => {
    let arr = comentarios;
    if (tab === "Positivos") arr = arr.filter(c => (c.calificacion || 0) >= 4);
    else if (tab === "Neutrales") arr = arr.filter(c => c.calificacion === 3);
    else if (tab === "Negativos") arr = arr.filter(c => (c.calificacion || 0) <= 2 && c.calificacion != null);
    
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      arr = arr.filter(c => 
        (c.nombre || c.usuario?.nombre || "").toLowerCase().includes(q) ||
        (c.producto?.nombre || "").toLowerCase().includes(q) ||
        (c.contenido || "").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [comentarios, tab, busqueda]);

  // Cálculos dinámicos para KPIs (Si es 0, maneja NaN correctamente)
  const total = comentarios.length;
  const promedio = total ? (comentarios.reduce((a, c) => a + (c.calificacion || 0), 0) / total) : 0;
  const positivos = comentarios.filter(c => (c.calificacion || 0) >= 4).length;
  const neutrales = comentarios.filter(c => c.calificacion === 3).length;
  const negativos = comentarios.filter(c => (c.calificacion || 0) <= 2 && c.calificacion != null).length;
  const pct = (n) => total ? `(${((n / total) * 100).toFixed(1)}%)` : "(0%)";

  const kpis = [
    { titulo: "Calificación promedio", valor: promedio.toFixed(1), detalle: `Basado en ${total} comentarios`, icon: "fa-regular fa-star", color: "#F194B4", border: "#FADADD" },
    { titulo: "Positivos", valor: positivos, porcentaje: pct(positivos), detalle: "Comentarios positivos", icon: "fa-regular fa-face-smile", color: "#27AE60", border: "#A9DFBF" },
    { titulo: "Neutrales", valor: neutrales, porcentaje: pct(neutrales), detalle: "Comentarios neutrales", icon: "fa-regular fa-face-meh", color: "#F2C94C", border: "#FDE49E" },
    { titulo: "Negativos", valor: negativos, porcentaje: pct(negativos), detalle: "Comentarios negativos", icon: "fa-regular fa-face-frown", color: "#9B59B6", border: "#D7BDE2" },
  ];

  // Cálculo dinámico para la barra de progreso de estrellas
  const resumenCalificaciones = [5, 4, 3, 2, 1].map(e => {
    const n = comentarios.filter(c => (c.calificacion || 0) === e).length;
    return { estrellas: e, count: `${n} ${pct(n)}`, width: total ? `${(n / total) * 100}%` : "0%" };
  });

  // Data estática preservada por falta de endpoint específico
  const temas = [
    { nombre: "Sabor/Calidad", menciones: "0 menciones", icon: "fa-solid fa-cake-candles", color: "#F194B4", border: "#FADADD" },
    { nombre: "Entrega", menciones: "0 menciones", icon: "fa-solid fa-motorcycle", color: "#9B59B6", border: "#D7BDE2" },
    { nombre: "Empaque", menciones: "0 menciones", icon: "fa-solid fa-box", color: "#F2C94C", border: "#FDE49E" },
    { nombre: "Presentación", menciones: "0 menciones", icon: "fa-solid fa-gift", color: "#27AE60", border: "#A9DFBF" },
    { nombre: "Atención", menciones: "0 menciones", icon: "fa-solid fa-headset", color: "#5DADE2", border: "#AED6F1" },
  ];

  const productosMencionados = [
    { id: 1, nombre: "Torta de chocolate", img: imgTcTripleChocolate, menciones: "0 menciones", rating: "0.0" },
    { id: 2, nombre: "Alfajores clásicos", img: imgAClasico, menciones: "0 menciones", rating: "0.0" },
    { id: 3, nombre: "Alfajores chocolate blanco", img: imgCArandano, menciones: "0 menciones", rating: "0.0" },
    { id: 4, nombre: "Trufas de maracuya", img: imgTFresa, menciones: "0 menciones", rating: "0.0" },
    { id: 5, nombre: "Galletas personalizadas", img: imgTvClasicos, menciones: "0 menciones", rating: "0.0" },
  ];

  const tabsMenu = [
    { id: "Todos", label: `Todos (${total})` },
    { id: "Positivos", label: `Positivos (${positivos})` },
    { id: "Neutrales", label: `Neutrales (${neutrales})` },
    { id: "Negativos", label: `Negativos (${negativos})` },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className="fa-solid fa-star" style={{ color: i <= rating ? '#F2C94C' : '#EAEAEA', fontSize: '14px', marginRight: '2px' }}></i>
      );
    }
    return stars;
  };

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>

      {/* TÍTULO */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0' }}>Comentarios</h1>
        <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>Gestiona las opiniones de tus clientes sobre sus pedidos.</p>
      </div>

      {/* CONTROLES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ border: '1px solid #D9D9D9', borderRadius: '8px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', cursor: 'pointer', width: '280px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-regular fa-calendar"></i> Últimos 30 días
            </div>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
          </div>
          <button style={{ backgroundColor: 'white', color: '#C3666D', border: '1.5px solid #C3666D', borderRadius: '8px', padding: '0 25px', height: '42px', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-filter"></i> Filtros
          </button>
        </div>
        <button onClick={exportarCSV} style={{ backgroundColor: '#FCF0F2', color: '#C3666D', border: '1.5px solid #FADADD', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Poppins-SemiBold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-download"></i> Exportar reporte
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: `2px solid ${kpi.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ color: kpi.color, fontSize: '50px', flexShrink: 0 }}>
              <i className={kpi.icon}></i>
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', margin: '0 0 2px 0' }}>{kpi.titulo}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '28px', color: '#5A3E41', margin: '0 0 2px 0', lineHeight: '1' }}>{kpi.valor}</h2>
                {kpi.porcentaje && <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777' }}>{kpi.porcentaje}</span>}
              </div>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', color: '#999', margin: 0 }}>{kpi.detalle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TEMAS MÁS MENCIONADOS (Estáticos por ahora, a la espera de BD) */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 15px 0' }}>Temas más mencionados</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {temas.map((tema, index) => (
            <div key={index} style={{ backgroundColor: 'white', border: `1.5px solid ${tema.border}`, borderRadius: '10px', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', minWidth: '180px' }}>
              <div style={{ color: tema.color, fontSize: '24px' }}>
                <i className={tema.icon}></i>
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', margin: '0 0 2px 0' }}>{tema.nombre}</p>
                <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{tema.menciones}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMENTARIOS RECIENTES */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 15px 0' }}>Comentarios recientes</h3>
        
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #EAEAEA', overflow: 'hidden' }}>
          {/* TABS Y BUSCADOR (Reactivos) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAEAEA', padding: '0 30px' }}>
            <div style={{ display: 'flex', gap: '30px' }}>
              {tabsMenu.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => setTab(t.id)}
                  style={{ 
                    fontFamily: tab === t.id ? 'Poppins-Bold' : 'Poppins-Medium', 
                    fontSize: '14px', 
                    color: tab === t.id ? '#C3666D' : '#999', 
                    padding: '20px 0', 
                    borderBottom: tab === t.id ? '3px solid #C3666D' : '3px solid transparent', 
                    cursor: 'pointer' 
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D9D9D9', borderRadius: '20px', padding: '8px 15px', width: '250px' }}>
              <input 
                type="text" 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)} 
                placeholder="Buscar comentario..." 
                style={{ border: 'none', outline: 'none', width: '100%', fontFamily: 'Poppins-Regular', fontSize: '12px' }} 
              />
              <i className="fa-solid fa-magnifying-glass" style={{ color: '#999', fontSize: '14px' }}></i>
            </div>
          </div>

          {/* TABLA DINÁMICA */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EAEAEA' }}>
                <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '15px 30px', fontWeight: 'normal' }}>Pedido</th>
                <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '15px 30px', fontWeight: 'normal' }}>Cliente</th>
                <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '15px 30px', fontWeight: 'normal' }}>Calificación</th>
                <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '15px 30px', fontWeight: 'normal' }}>Comentario</th>
                <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '15px 30px', fontWeight: 'normal' }}>Fecha</th>
                <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '15px 30px', fontWeight: 'normal', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#999', fontSize: '14px' }}>
                    A la espera de datos...
                  </td>
                </tr>
              ) : (
                filtrados.map((com, index) => (
                  <tr key={com.id || index} style={{ borderBottom: index !== filtrados.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                    <td style={{ padding: '15px 30px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '35px', height: '35px', backgroundColor: '#FDF2F3', color: '#C6676D', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>
                          <i className="fa-solid fa-bag-shopping"></i>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'Poppins-Bold', fontSize: '13px', color: '#5A3E41', margin: '0 0 2px 0' }}>#{com.id || "0000"}</p>
                          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', color: '#777', margin: 0 }}>{com.prods || "1 producto"}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px 30px' }}>
                      <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: '0 0 2px 0' }}>{com.nombre || com.usuario?.nombre || "Anónimo"}</p>
                      <p style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', color: '#777', margin: 0 }}>{com.telefono || "--"}</p>
                    </td>
                    <td style={{ padding: '15px 30px' }}>
                      <div style={{ display: 'flex' }}>{renderStars(com.calificacion || 0)}</div>
                    </td>
                    <td style={{ padding: '15px 30px', fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#5A3E41', maxWidth: '280px', lineHeight: '1.4' }}>
                      {com.contenido || com.comentario || "Sin comentario."}
                    </td>
                    <td style={{ padding: '15px 30px' }}>
                      <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#5A3E41', margin: '0 0 2px 0' }}>{com.fecha || "--"}</p>
                      <p style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', color: '#777', margin: 0 }}>{com.hora || "--"}</p>
                    </td>
                    <td style={{ padding: '15px 30px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button style={{ border: 'none', background: 'transparent', color: '#5A3E41', fontSize: '16px', cursor: 'pointer' }}>
                          <i className="fa-regular fa-eye"></i>
                        </button>
                        {!com._aprobado && (
                          <button onClick={() => aprobar(com.id)} title="Aprobar" style={{ border: 'none', background: 'transparent', color: '#27AE60', fontSize: '16px', cursor: 'pointer' }}>
                            <i className="fa-solid fa-check"></i>
                          </button>
                        )}
                        <button onClick={() => eliminar(com.id)} title="Eliminar" style={{ border: 'none', background: 'transparent', color: '#C6676D', fontSize: '16px', cursor: 'pointer' }}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINACIÓN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>
          Mostrando de 0 a 0 de {total} comentarios
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium' }}><i className="fa-solid fa-arrow-left"></i></button>
          <button style={{ border: 'none', background: '#C3666D', color: 'white', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Bold', fontSize: '14px' }}>1</button>
          <button style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium' }}><i className="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>

      {/* PANELES INFERIORES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '40px' }}>
        
        {/* Productos más mencionados positivamente (Estáticos por ahora, listos para variables) */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #EAEAEA', padding: '30px' }}>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 25px 0' }}>Productos más mencionados positivamente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {productosMencionados.map((prod, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', width: '15px' }}>{prod.id}</span>
                  <img src={prod.img} alt={prod.nombre} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>{prod.nombre}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{prod.menciones}</span>
                  <span style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {prod.rating} <i className="fa-solid fa-star" style={{ color: '#F2C94C', fontSize: '12px' }}></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de calificaciones dinámico */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #EAEAEA', padding: '30px' }}>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 25px 0' }}>Resumen de calificaciones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {resumenCalificaciones.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', width: '60px' }}>{item.estrellas} estrellas</span>
                <div style={{ flex: 1, height: '14px', backgroundColor: '#F5F5F5', borderRadius: '7px', overflow: 'hidden' }}>
                  {/* Aquí se inyecta el ancho dinámico calculado por la lógica */}
                  <div style={{ width: item.width, height: '100%', backgroundColor: '#D68994', borderRadius: '7px', transition: 'width 0.3s ease' }}></div>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', width: '70px', textAlign: 'right' }}>{item.count}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #EAEAEA' }}>
              <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777' }}>Total de comentarios</span>
              <span style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41' }}>{total}</span>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

    </div>
  );
};

export default AdminComentariosTab;