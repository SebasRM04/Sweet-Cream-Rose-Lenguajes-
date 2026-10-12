import React, { useState, useEffect } from "react";
import { apiGet } from "../../api";
import logoPrincipal from '../../assets/logo.png'; 

// IMÁGENES DE PRODUCTOS (Fallbacks visuales)
import imgTcTripleChocolate from '../../assets/products/tc-triple-chocolate.png';
import imgCArandano from '../../assets/products/c-arandano.png';
import imgAClasico from '../../assets/products/a-clasico.png';
import imgTFresa from '../../assets/products/t-fresa.png';

const PERIODOS = [
  { id: "semana", label: "Esta semana", path: "/api/admin/ventas/semana" },
  { id: "mes", label: "Este mes", path: "/api/admin/ventas/mes" },
  { id: "anio", label: "Este año", path: "/api/admin/ventas/anio" },
];

const MARGEN_ESTIMADO = 0.60; // 60% de margen de ganancia por defecto

const AdminGananciasTab = () => {

  // LÓGICA DE ESTADOS
  const [periodo, setPeriodo] = useState("mes");
  const [menuPeriodoAbierto, setMenuPeriodoAbierto] = useState(false);
  
  const [dataGanancias, setDataGanancias] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // LLAMADAS A LA API
  useEffect(() => {
    setCargando(true);
    const p = PERIODOS.find(x => x.id === periodo);
    apiGet(p.path)
      .then(d => { setDataGanancias(d); setError(""); })
      .catch(() => setError("No se pudieron cargar las ganancias. Verificando conexión..."))
      .finally(() => setCargando(false));
  }, [periodo]);

  // MATEMÁTICAS BÁSICAS
  const ingresos = Number(dataGanancias?.totalIngresos || 0);
  const ganancia = ingresos * MARGEN_ESTIMADO;
  const costos = ingresos - ganancia;

  // KPIs DINÁMICOS
  const kpis = [
    { titulo: "Ingresos totales", valor: `S/ ${ingresos.toFixed(2)}`, porcentaje: "0%", extra: "vs periodo ant.", icon: "S/", customIcon: true, color: "#F194B4", border: "#FADADD" },
    { titulo: "Costos totales", valor: `S/ ${costos.toFixed(2)}`, porcentaje: "0%", extra: "vs periodo ant.", icon: "fa-solid fa-cart-shopping", color: "#F2C94C", border: "#FDE49E" },
    { titulo: "Ganancia neta", valor: `S/ ${ganancia.toFixed(2)}`, porcentaje: "0%", extra: "vs periodo ant.", icon: "fa-dollar", color: "#27AE60", border: "#A9DFBF" },
    { titulo: "Margen de ganancia", valor: `${(MARGEN_ESTIMADO * 100).toFixed(1)}%`, porcentaje: "0%", extra: "vs periodo ant.", icon: "fa-solid fa-chart-column", color: "#9B59B6", border: "#D7BDE2" },
  ];

  // GRÁFICO DE LÍNEAS DINÁMICO
  // El backend devuelve "ventasPorDia" (ingresos brutos por día);
  // le aplicamos el margen estimado para graficar la ganancia neta.
  const ventasPorDiaRaw = dataGanancias?.ventasPorDia || [0, 0, 0, 0, 0, 0, 0];
  const chartValues = ventasPorDiaRaw.map(v => Number(v) * MARGEN_ESTIMADO);
  const chartDays = dataGanancias?.ventasPorDiaLabels || chartValues.map((_, i) => String(i + 1));
  const maxGrafico = Math.max(...chartValues, 1200); // Ajustar según volumen real de ventas
  
  const puntosSVG = chartValues.map((val, i) => {
    const x = 90 + (i * 95);
    const y = 220 - ((Math.min(val, maxGrafico) / maxGrafico) * 200); 
    return { x, y, val };
  });

  const pathD = `M 90 220 ` + puntosSVG.map(pt => `L ${pt.x} ${pt.y}`).join(" ") + ` L 660 220 Z`;
  const pathLineD = `M 90 ${puntosSVG[0].y} ` + puntosSVG.map(pt => `L ${pt.x} ${pt.y}`).join(" ");

  // GRÁFICO CIRCULAR DINÁMICO
  const desgloseData = dataGanancias?.desglosePorCategoria || [
    { nombre: 'Productos de pastelería', monto: 0, pct: 0, color: '#F194B4' },
    { nombre: 'Bebidas y extras', monto: 0, pct: 0, color: '#F2C94C' },
    { nombre: 'Personalizados', monto: 0, pct: 0, color: '#D7BDE2' }
  ];
  const hasPieData = desgloseData.some(d => d.pct > 0);
  let currentPieOffset = 0;

  // TABLAS Y RESÚMENES (Vaciados por defecto)
  const categoriasData = dataGanancias?.categorias || [];
  
  const resumenGeneral = [
    { etiqueta: "Total de pedidos", valor: dataGanancias?.totalOrdenes || "0" },
    { etiqueta: "Ticket promedio", valor: ingresos > 0 && dataGanancias?.totalOrdenes ? `S/${(ingresos / dataGanancias.totalOrdenes).toFixed(2)}` : "S/0.00" },
    { etiqueta: "Productos vendidos", valor: dataGanancias?.productosVendidos || "0" },
    { etiqueta: "Devoluciones", valor: "S/0.00" },
    { etiqueta: "Descuentos aplicados", valor: "S/0.00" },
  ];

  // EXPORTAR CSV
  const exportarCSV = () => {
    const rows = [
      ["Métrica", "Valor"],
      ["Ingresos Totales", `S/ ${ingresos.toFixed(2)}`],
      ["Costos Totales", `S/ ${costos.toFixed(2)}`],
      ["Ganancia Neta", `S/ ${ganancia.toFixed(2)}`],
      ["Margen", `${(MARGEN_ESTIMADO * 100).toFixed(1)}%`],
      ["Total de Pedidos", dataGanancias?.totalOrdenes || "0"]
    ];
    const csv = rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = `ganancias_${periodo}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>

      {/* TÍTULO */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
          GANANCIAS
        </h1>
        <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>
          Resumen de ingresos, costos y ganancias
        </p>
      </div>

      {/* CONTROLES (FECHA, FILTROS, EXPORTAR) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          <div onClick={() => setMenuPeriodoAbierto(!menuPeriodoAbierto)} style={{ border: '1px solid #D9D9D9', borderRadius: '8px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', cursor: 'pointer', width: '280px', justifyContent: 'space-between', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-regular fa-calendar"></i>
              {PERIODOS.find(p => p.id === periodo)?.label}
            </div>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
          </div>

          {menuPeriodoAbierto && (
            <div style={{ position: 'absolute', top: '50px', left: 0, backgroundColor: 'white', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0,0,0,0.15)', padding: '10px 0', width: '280px', zIndex: 100, border: '1px solid #EAEAEA' }}>
              {PERIODOS.map(p => (
                <button key={p.id} onClick={() => { setPeriodo(p.id); setMenuPeriodoAbierto(false); }} style={{ width: '100%', background: 'none', border: 'none', padding: '10px 20px', textAlign: 'left', fontFamily: periodo === p.id ? 'Poppins-Bold' : 'Poppins-Medium', fontSize: '13px', color: periodo === p.id ? '#C3666D' : '#5A3E41', cursor: 'pointer' }}>
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <button style={{ backgroundColor: 'white', color: '#C3666D', border: '1.5px solid #C3666D', borderRadius: '8px', padding: '0 25px', height: '42px', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
            <i className="fa-solid fa-filter"></i> Filtros
          </button>
        </div>

        <button onClick={exportarCSV} style={{ backgroundColor: '#FCF0F2', color: '#C3666D', border: '1.5px solid #FADADD', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Poppins-SemiBold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
          <i className="fa-solid fa-download"></i> Exportar reporte
        </button>
      </div>

      {cargando && <p style={{ color: '#999', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>Calculando ganancias...</p>}
      {error && <p style={{ color: '#C6676D', fontFamily: 'Poppins-Medium', textAlign: 'center' }}>{error}</p>}

      {/* TARJETAS DE MÉTRICAS (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: `2px solid ${kpi.border}`, display: 'flex', alignItems: 'flex-start', gap: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: kpi.color, fontSize: '20px', flexShrink: 0, fontFamily: 'Poppins-Bold', border: `2px solid ${kpi.color}`, backgroundColor: 'white' }}>
              {kpi.customIcon ? <span>{kpi.icon}</span> : <i className={kpi.icon}></i>}
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: '0 0 5px 0' }}>{kpi.titulo}</p>
              <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '26px', color: '#5A3E41', margin: '0 0 8px 0', lineHeight: '1' }}>{kpi.valor}</h2>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', margin: 0 }}>
                <span style={{ color: '#999' }}>- {kpi.porcentaje}</span> {kpi.extra}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICO PRINCIPAL (Líneas) */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA', marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 20px 0' }}>Ganancia neta</h3>
        
        <div style={{ height: '300px', width: '100%', position: 'relative' }}>
          <svg viewBox="0 0 700 250" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="gananciaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C6676D" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#C6676D" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Eje Y */}
            {[
              { y: 20, val: 'S/ 1,200' }, { y: 70, val: 'S/ 900' },
              { y: 120, val: 'S/ 600' }, { y: 170, val: 'S/ 300' }, { y: 220, val: 'S/ 0' }
            ].map((line, i) => (
              <g key={i}>
                <text x="0" y={line.y + 4} fill="#999" fontSize="12" fontFamily="Poppins-Medium">{line.val}</text>
                <line x1="60" y1={line.y} x2="700" y2={line.y} stroke="#EAEAEA" strokeWidth="1" strokeDasharray={i === 4 ? "0" : "5,5"} />
              </g>
            ))}

            {/* Eje X */}
            {chartDays.map((day, i) => (
              <text key={i} x={90 + (i * 95)} y="245" fill="#999" fontSize="12" fontFamily="Poppins-Medium" textAnchor="middle">Día {day}</text>
            ))}

            {/* Área y Línea */}
            <path d={pathD} fill="url(#gananciaGradient)" />
            <path d={pathLineD} fill="none" stroke="#C6676D" strokeWidth="3" />

            {/* Puntos */}
            {puntosSVG.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="#C6676D" />
            ))}
          </svg>
        </div>
      </div>

      {/* GRÁFICO DONA Y COMPARACIÓN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px', marginBottom: '40px' }}>
        
        {/* Desglose de ganancias (Dona Inteligente) */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA' }}>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 20px 0' }}>Desglose de ganancias</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '20px' }}>
            
            <div style={{ width: '220px', height: '260px', position: 'relative' }}>
              <svg viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.05))' }}>
                {!hasPieData ? (
                  <circle r="15.915" cx="16" cy="16" fill="transparent" stroke="#F5F5F5" strokeWidth="8" strokeDasharray="100 0" />
                ) : (
                  desgloseData.map((d, i) => {
                    const dashArray = `${d.pct} ${100 - d.pct}`;
                    const offset = -currentPieOffset;
                    currentPieOffset += d.pct;
                    return (
                      <circle key={i} r="15.915" cx="16" cy="16" fill="transparent" stroke={d.color} strokeWidth="8" strokeDasharray={dashArray} strokeDashoffset={offset} />
                    );
                  })
                )}
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', color: '#5A3E41', fontFamily: 'Poppins-Medium' }}>Total</span>
                <span style={{ fontSize: '24px', color: '#5A3E41', fontFamily: 'Poppins-Bold', lineHeight: '1.2' }}>S/ {ganancia.toFixed(2)}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {desgloseData.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: item.color, fontSize: '16px', marginTop: '2px' }}>●</span>
                  <div>
                    <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: '0 0 2px 0' }}>{item.nombre}</p>
                    <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>S/ {item.monto.toFixed(2)} ({item.pct}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparación de periodos */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 25px 0' }}>Comparación de periodos</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: '0 0 2px 0' }}>Este periodo</p>
              <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#C6676D', margin: 0 }}>S/ {ganancia.toFixed(2)}</h4>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#F194B4', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: '0 0 2px 0' }}>Periodo anterior</p>
              <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: 0 }}>S/ 0.00</h4>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#EAEAEA', color: '#777', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>
              <i className="fa-solid fa-minus"></i>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', margin: '0 0 5px 0' }}>Variación</p>
              <p style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#999', margin: '0 0 2px 0' }}>0.0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* RESUMEN POR CATEGORÍA */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 20px 0' }}>Resumen por categoría</h3>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #EAEAEA', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #FDF2F3' }}>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Categoría</th>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Ingresos</th>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Costos</th>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Ganancia</th>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Margen</th>
              </tr>
            </thead>
            <tbody>
              {categoriasData.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#999', fontFamily: 'Poppins-Regular' }}>A la espera de datos.</td></tr>
              ) : (
                categoriasData.map((cat, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={cat.imgUrl || imgAClasico} alt={cat.nombre} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                      <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41' }}>{cat.nombre}</span>
                    </td>
                    <td style={{ padding: '15px 30px', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777' }}>S/ {cat.ingresos}</td>
                    <td style={{ padding: '15px 30px', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777' }}>S/ {cat.costos}</td>
                    <td style={{ padding: '15px 30px', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777' }}>S/ {cat.ganancia}</td>
                    <td style={{ padding: '15px 30px', fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#27AE60' }}>{cat.margen}%</td>
                  </tr>
                ))
              )}
              {/* Fila de Total Dinámica */}
              <tr style={{ backgroundColor: '#FAFAFA', borderTop: '2px solid #EAEAEA' }}>
                <td style={{ padding: '20px 30px', fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', textAlign: 'center' }}>Total</td>
                <td style={{ padding: '20px 30px', fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41' }}>S/ {ingresos.toFixed(2)}</td>
                <td style={{ padding: '20px 30px', fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41' }}>S/ {costos.toFixed(2)}</td>
                <td style={{ padding: '20px 30px', fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41' }}>S/ {ganancia.toFixed(2)}</td>
                <td style={{ padding: '20px 30px', fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#27AE60' }}>{(MARGEN_ESTIMADO * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RESUMEN GENERAL */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #EAEAEA', padding: '30px', marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 25px 0' }}>Resumen general</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {resumenGeneral.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: index !== resumenGeneral.length - 1 ? '15px' : '0', borderBottom: index !== resumenGeneral.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
              <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41' }}>{item.etiqueta}</span>
              <span style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777' }}>{item.valor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BANNER */}
      <div style={{ backgroundColor: '#FFF6F7', borderRadius: '12px', padding: '30px', display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '40px' }}>
        <div style={{ color: '#F194B4', fontSize: '50px' }}>
          <i className="fa-solid fa-arrow-trend-up"></i>
        </div>
        <div>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#C6676D', margin: '0 0 5px 0' }}>¡Buen trabajo!</h3>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', margin: 0 }}>Recuerda que tu ganancia neta debe aumentar en comparación con el periodo anterior.</p>
        </div>
      </div>

      {/* FOOTER */}
      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

    </div>
  );
};

export default AdminGananciasTab;