import React, { useState, useEffect, useMemo } from "react";
import { apiGet } from "../../api";

const PERIODOS = [
  { id: "mes", label: "Este mes", path: "/api/admin/ventas/mes" },
  { id: "semana", label: "Esta semana", path: "/api/admin/ventas/semana" },
  { id: "anio", label: "Este año", path: "/api/admin/ventas/anio" },
];

const AdminVentasTab = () => {
  const [periodo, setPeriodo] = useState("mes");
  const [menuPeriodoAbierto, setMenuPeriodoAbierto] = useState(false);
  const [dataKPIs, setDataKPIs] = useState(null);
  const [ventasData, setVentasData] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [tabActiva, setTabActiva] = useState("Todas las ventas");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 8;

  useEffect(() => {
    setCargando(true);
    const p = PERIODOS.find(x => x.id === periodo);
    apiGet(p.path)
      .then(d => { 
        setDataKPIs(d); 
        setVentasData(Array.isArray(d?.listaVentas) ? d.listaVentas : []); 
        setError(""); 
      })
      .catch(() => setError("No se pudieron cargar las ventas. Verificando conexión..."))
      .finally(() => setCargando(false));
  }, [periodo]);

  const exportarCSV = () => {
    const filasExportar = ventasData.length > 0 
      ? ventasData.map(v => [v.id, v.cliente, v.total, v.estado])
      : [["Sin datos", "0.00"]];
    const rows = [["ID", "Cliente", "Total", "Estado"], ...filasExportar];
    const csv = rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = `ventas_${periodo}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const ventasFiltradas = useMemo(() => {
    let arr = ventasData;
    if (tabActiva === "Completadas") arr = arr.filter(v => v.estado === 'Completada');
    if (tabActiva === "Pendientes") arr = arr.filter(v => v.estado === 'Pendiente');
    if (tabActiva === "Canceladas") arr = arr.filter(v => v.estado === 'Cancelado');
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      arr = arr.filter(v => (v.cliente || '').toLowerCase().includes(q) || String(v.id ?? '').toLowerCase().includes(q) || (v.prodDesc || '').toLowerCase().includes(q));
    }
    return arr;
  }, [ventasData, tabActiva, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(ventasFiltradas.length / porPagina));
  const pagina = Math.min(paginaActual, totalPaginas);
  const visibles = ventasFiltradas.slice((pagina - 1) * porPagina, pagina * porPagina);

  useEffect(() => { setPaginaActual(1); }, [busqueda, tabActiva]);

  const kpis = [
    { titulo: "Ventas totales", valor: `S/ ${Number(dataKPIs?.totalIngresos || 0).toFixed(2)}`, porcentaje: "0%", extra: "vs. ayer", color: "#F194B4", bg: "#FDF2F3", border: "#FADADD", customIcon: "S/" },
    { titulo: "Pedidos realizados", valor: dataKPIs?.totalOrdenes || 0, porcentaje: "0%", extra: "vs. ayer", icon: "fa-solid fa-bag-shopping", color: "#F2C94C", bg: "#FFF9E6", border: "#FDE49E" },
    { titulo: "Órdenes válidas", valor: dataKPIs?.ordenesValidas || 0, porcentaje: "0%", extra: "vs. ayer", icon: "fa-regular fa-circle-check", color: "#27AE60", bg: "#E9F7EF", border: "#A9DFBF" },
    { titulo: "Órdenes canceladas", valor: dataKPIs?.ordenesCanceladas || 0, porcentaje: "0%", extra: "vs. ayer", icon: "fa-regular fa-circle-xmark", color: "#9B59B6", bg: "#F4ECF7", border: "#D7BDE2" },
  ];

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'Completada': return '#27AE60';
      case 'Confirmada': return '#F2C94C';
      case 'Pendiente': return '#F39C12';
      case 'Cancelado': return '#E74C3C';
      default: return '#777';
    }
  };

  const tabs = ["Todas las ventas", "Completadas", "Pendientes", "Canceladas"];

  // LÓGICA DINÁMICA DE GRÁFICOS PREPARADA PARA EL BACKEND
  // Gráfico de líneas (Y max: 800 -> cy: 20, Y min: 0 -> cy: 220)
  const chartDays = dataKPIs?.ventasPorDiaLabels || ['12 may.', '13 may.', '14 may.', '15 may.', '16 may.', '17 may.', '18 may.', '19 may.'];
  const chartValues = dataKPIs?.ventasPorDia || [0, 0, 0, 0, 0, 0, 0, 0]; // Backend valores aquí
  const maxGrafico = Math.max(...chartValues, 800);
  
  const puntosSVG = chartValues.map((val, i) => {
    const x = 80 + (i * 85);
    const y = 220 - ((val / maxGrafico) * 200); // Mapeo de valor a coordenada Y (0 = 220, 800 = 20)
    return { x, y, val };
  });

  const pathD = `M 80 220 ` + puntosSVG.map(pt => `L ${pt.x} ${pt.y}`).join(" ") + ` L 675 220 Z`;
  const pathLineD = `M 80 ${puntosSVG[0].y} ` + puntosSVG.map(pt => `L ${pt.x} ${pt.y}`).join(" ");

  // Gráfico circular
  const catData = dataKPIs?.ventasPorCategoria || [
    { nombre: 'Tortas clásicas', pct: 0, color: '#F194B4' },
    { nombre: 'Cupcakes', pct: 0, color: '#9B59B6' },
    { nombre: 'Alfajores', pct: 0, color: '#F2C94C' },
    { nombre: 'Trufas', pct: 0, color: '#27AE60' },
    { nombre: 'Otros', pct: 0, color: '#C6676D' }
  ];
  const hasPieData = catData.some(c => c.pct > 0);
  let currentPieOffset = 0;

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0', textTransform: 'uppercase' }}>VENTAS</h1>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>Consulta y gestiona las ventas de tu negocio.</p>
        </div>
        <button onClick={exportarCSV} style={{ backgroundColor: '#FCF0F2', color: '#C3666D', border: '1.5px solid #FADADD', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Poppins-SemiBold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-download"></i> Exportar reporte
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: `2px solid ${kpi.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '55px', height: '55px', backgroundColor: kpi.bg, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: kpi.color, fontSize: '22px', flexShrink: 0, fontFamily: 'Poppins-Bold' }}>
              {kpi.customIcon ? <span>{kpi.customIcon}</span> : <i className={kpi.icon}></i>}
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: '0 0 2px 0' }}>{kpi.titulo}</p>
              <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '26px', color: '#5A3E41', margin: '0 0 5px 0', lineHeight: '1' }}>{kpi.valor}</h2>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', margin: 0 }}>
                <span style={{ color: '#999' }}>- {kpi.porcentaje}</span> {kpi.extra}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '35px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #D9D9D9', borderRadius: '8px', padding: '0 15px', backgroundColor: 'white' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#999', fontSize: '16px' }}></i>
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar el pedido, cliente o producto ..." 
            style={{ border: 'none', outline: 'none', width: '100%', padding: '12px 10px', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
          <div onClick={() => setMenuPeriodoAbierto(!menuPeriodoAbierto)} style={{ border: '1px solid #D9D9D9', borderRadius: '8px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
            <i className="fa-regular fa-calendar"></i>
            {PERIODOS.find(p => p.id === periodo)?.label}
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
          </div>
          {menuPeriodoAbierto && (
            <div style={{ position: 'absolute', top: '50px', left: 0, backgroundColor: 'white', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0,0,0,0.15)', padding: '10px 0', width: '180px', zIndex: 100, border: '1px solid #EAEAEA' }}>
              {PERIODOS.map(p => (
                <button key={p.id} onClick={() => { setPeriodo(p.id); setMenuPeriodoAbierto(false); }} style={{ width: '100%', background: 'none', border: 'none', padding: '10px 20px', textAlign: 'left', fontFamily: periodo === p.id ? 'Poppins-Bold' : 'Poppins-Medium', fontSize: '13px', color: periodo === p.id ? '#C3666D' : '#5A3E41', cursor: 'pointer' }}>
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <button style={{ backgroundColor: 'white', color: '#C3666D', border: '1.5px solid #C3666D', borderRadius: '8px', padding: '0 25px', height: '100%', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
            <i className="fa-solid fa-filter"></i> Filtros
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '40px' }}>
        
        {/* GRÁFICO DE LÍNEAS (DINÁMICO) */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA' }}>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 20px 0' }}>Ventas por día</h3>
          <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 700 250" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F194B4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F194B4" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[{ y: 20, val: 'S/ 800' }, { y: 70, val: 'S/ 600' }, { y: 120, val: 'S/ 400' }, { y: 170, val: 'S/ 200' }, { y: 220, val: 'S/ 0' }].map((line, i) => (
                <g key={i}>
                  <text x="0" y={line.y + 4} fill="#999" fontSize="12" fontFamily="Poppins-Medium">{line.val}</text>
                  <line x1="50" y1={line.y} x2="700" y2={line.y} stroke="#EAEAEA" strokeWidth="1" strokeDasharray={i === 4 ? "0" : "5,5"} />
                </g>
              ))}
              {chartDays.map((day, i) => (
                <text key={i} x={80 + (i * 85)} y="245" fill="#999" fontSize="12" fontFamily="Poppins-Medium" textAnchor="middle">{day}</text>
              ))}
              <path d={pathD} fill="url(#ventasGradient)" />
              <path d={pathLineD} fill="none" stroke="#F194B4" strokeWidth="3" />
              {puntosSVG.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="white" stroke="#F194B4" strokeWidth="3" />
              ))}
            </svg>
          </div>
        </div>

        {/* GRÁFICO CIRCULAR (DINÁMICO) */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 20px 0' }}>Ventas por categoría</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', flex: 1 }}>
            <div style={{ width: '180px', height: '180px', position: 'relative' }}>
              <svg viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.05))' }}>
                {!hasPieData ? (
                  <circle r="15.915" cx="16" cy="16" fill="transparent" stroke="#F5F5F5" strokeWidth="7" strokeDasharray="100 0" />
                ) : (
                  catData.map((cat, i) => {
                    const dashArray = `${cat.pct} ${100 - cat.pct}`;
                    const offset = -currentPieOffset;
                    currentPieOffset += cat.pct;
                    return (
                      <circle key={i} r="15.915" cx="16" cy="16" fill="transparent" stroke={cat.color} strokeWidth="7" strokeDasharray={dashArray} strokeDashoffset={offset} />
                    );
                  })
                )}
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#777', fontFamily: 'Poppins-Medium' }}>Total</span>
                <span style={{ fontSize: '18px', color: '#5A3E41', fontFamily: 'Poppins-Bold', lineHeight: '1.2' }}>S/ {Number(dataKPIs?.totalIngresos || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777' }}>
            {catData.map((cat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><span style={{color: cat.color, fontSize:'18px', marginRight: '6px'}}>●</span> {cat.nombre}</div> 
                <span>{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #EAEAEA', overflow: 'hidden', padding: '20px 30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #FDF2F3', marginBottom: '20px', gap: '30px' }}>
          {tabs.map((tab) => {
            const isActive = tabActiva === tab;
            return (
              <div key={tab} onClick={() => setTabActiva(tab)} style={{ paddingBottom: '12px', cursor: 'pointer', borderBottom: isActive ? '3px solid #C3666D' : '3px solid transparent', fontFamily: 'Poppins-Bold', fontSize: '15px', color: isActive ? '#C3666D' : '#A08D8F', transition: 'all 0.2s' }}>
                {tab}
              </div>
            );
          })}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #EAEAEA' }}>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Pedido</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Cliente</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Fecha</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Productos</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Total</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal' }}>Estado</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', padding: '15px 10px', fontWeight: 'normal', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '30px', textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#999' }}>Sin registros de ventas en este periodo.</td></tr>
            ) : (
              visibles.map((venta, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                    <div style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41' }}>{venta.id || "#0000"}</div>
                    <button style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#F194B4', textDecoration: 'none', cursor: 'pointer' }}>Ver detalle</button>
                  </td>
                  <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                    <div style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41' }}>{venta.cliente || "-"}</div>
                    <div style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777' }}>{venta.tel || "-"}</div>
                  </td>
                  <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                    <div style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41' }}>{venta.fecha || "-"}</div>
                    <div style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777' }}>{venta.hora || "-"}</div>
                  </td>
                  <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                    <div style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41' }}>{venta.prodCount || "0 productos"}</div>
                    <div style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777' }}>{venta.prodDesc || "-"}</div>
                  </td>
                  <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                    <div style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41' }}>{venta.total || "S/ 0.00"}</div>
                  </td>
                  <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                    <div style={{ fontFamily: 'Poppins-SemiBold', fontSize: '13px', color: getColorEstado(venta.estado) }}>{venta.estado || "-"}</div>
                  </td>
                  <td style={{ padding: '15px 10px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: '#F194B4', fontSize: '18px', cursor: 'pointer' }}><i className="fa-regular fa-eye"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>
            Mostrando de {(pagina - 1) * porPagina + (visibles.length > 0 ? 1 : 0)}-{Math.min(pagina * porPagina, ventasFiltradas.length)} de {ventasFiltradas.length} ventas
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPaginaActual(n)} style={{ border: pagina === n ? 'none' : '1px solid #D9D9D9', background: pagina === n ? '#C3666D' : 'white', color: pagina === n ? 'white' : '#5A3E41', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Bold', fontSize: '14px' }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

    </div>
  );
};

export default AdminVentasTab;
