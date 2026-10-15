import React, { useState, useEffect } from "react";
import { apiGet, apiDownload } from "../../api";

const PERIODOS = [
  { id: "mensual", label: "Último Mes", path: "/api/admin/reportes/mensual" },
  { id: "semanal", label: "Última Semana", path: "/api/admin/reportes/semanal" },
  { id: "anual", label: "Último Año", path: "/api/admin/reportes/anual" },
];

const TIPO_API = {
  "Reporte de ventas": "ventas",
  "Reporte de ganancias": "ganancias",
  "Reporte de productos": "productos",
  "Reporte de pedidos": "pedidos",
  "Reporte de ofertas": "ofertas",
};

const AdminReportesTab = () => {
  const [periodo, setPeriodo] = useState("mensual");
  const [rep, setRep] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [descargando, setDescargando] = useState("");

  useEffect(() => {
    setCargando(true);
    const p = PERIODOS.find(x => x.id === periodo) || PERIODOS[0];
    apiGet(p.path)
      .then(d => { setRep(d); setError(""); })
      .catch((e) => {
        setError(e.message || "No se pudieron cargar los reportes.");
        setRep(null);
      })
      .finally(() => setCargando(false));
  }, [periodo]);

  const money = (v) => `S/ ${Number(v || 0).toFixed(2)}`;

  const descargar = async (nombreReporte, formato) => {
    const tipo = TIPO_API[nombreReporte] || "ventas";
    const ext = formato === "pdf" ? "pdf" : "xlsx";
    const key = `${nombreReporte}-${ext}`;
    setDescargando(key);
    try {
      await apiDownload(
        `/api/admin/reportes/exportar.${ext}?tipo=${encodeURIComponent(tipo)}&periodo=${encodeURIComponent(periodo)}`,
        `Reporte_${tipo}_${periodo}.${ext}`
      );
    } catch (e) {
      alert(e.message || "No se pudo generar el archivo. ¿Iniciaste sesión como admin?");
    } finally {
      setDescargando("");
    }
  };

  const kpis = [
    { valor: rep?.totalOrdenes ?? "0", subtitulo: "Órdenes del periodo", detalle: "incluye canceladas", icon: "fa-regular fa-file-lines", color: "#F194B4", border: "#FADADD", bg: "#FDF2F3" },
    { valor: money(rep?.totalGeneral), subtitulo: "Ventas del periodo", detalle: "sin canceladas", icon: "fa-solid fa-download", color: "#27AE60", border: "#A9DFBF", bg: "#E9F7EF" },
    { especial: true, titulo: "Última venta", valor: rep?.ultimaOrdenFecha ?? "-", detalle: rep?.ultimaOrdenHora ?? "-", icon: "fa-regular fa-clock", color: "#9B59B6", border: "#D7BDE2", bg: "#F4ECF7" },
    { valor: money(rep?.ticketPromedio), subtitulo: "Ticket promedio", detalle: `${rep?.tiposDisponibles ?? 5} tipos de reporte`, icon: "fa-solid fa-chart-pie", color: "#F2C94C", border: "#FDE49E", bg: "#FFF9E6" },
  ];

  const reportesData = [
    { id: 1, nombre: "Reporte de ventas", descripcion: "Resumen de todas las ventas realizadas en el período.", periodo: periodo === "mensual" ? "Último Mes" : periodo === "semanal" ? "Última Semana" : "Último Año", icon: "fas fa-chart-bar", color: "#F194B4", bg: "#FDF2F3" },
    { id: 2, nombre: "Reporte de ganancias", descripcion: "Detalle de ingresos, costos y ganancias del negocio.", periodo: periodo === "mensual" ? "Último Mes" : periodo === "semanal" ? "Última Semana" : "Último Año", icon: "fa-dollar", color: "#27AE60", bg: "#E9F7EF" },
    { id: 3, nombre: "Reporte de productos", descripcion: "Productos más vendidos y rendimiento por producto.", periodo: periodo === "mensual" ? "Último Mes" : periodo === "semanal" ? "Última Semana" : "Último Año", icon: "fa-solid fa-box", color: "#F2C94C", bg: "#FFF9E6" },
    { id: 4, nombre: "Reporte de pedidos", descripcion: "Historial y estado de todas las ventas realizadas.", periodo: periodo === "mensual" ? "Último Mes" : periodo === "semanal" ? "Última Semana" : "Último Año", icon: "fa-solid fa-bag-shopping", color: "#9B59B6", bg: "#F4ECF7" },
    { id: 5, nombre: "Reporte de ofertas", descripcion: "Rendimiento de ofertas y descuentos aplicados.", periodo: periodo === "mensual" ? "Último Mes" : periodo === "semanal" ? "Última Semana" : "Último Año", icon: "fa-solid fa-tag", color: "#E67E22", bg: "#FEF5E7" },
  ];

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
          REPORTES
        </h1>
        <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>
          Descarga y consulta todos los reportes de tu negocio.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, position: 'relative', border: '1px solid #D9D9D9', borderRadius: '8px', padding: '10px 20px', display: 'flex', alignItems: 'center', backgroundColor: 'white', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', cursor: 'pointer', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-regular fa-calendar" style={{ color: '#777', fontSize: '16px' }}></i>
            {PERIODOS.find(p => p.id === periodo)?.label} {cargando && "(Cargando...)"}
          </div>
          <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#999' }}></i>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          >
            {PERIODOS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p style={{ color: '#C6676D', fontFamily: 'Poppins-Medium', marginBottom: '16px' }}>{error}</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: `2px solid ${kpi.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: kpi.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', color: kpi.color, fontSize: '24px', flexShrink: 0 }}>
              <i className={kpi.icon}></i>
            </div>
            <div>
              {kpi.especial ? (
                <>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', margin: '0 0 2px 0' }}>{kpi.titulo}</p>
                  <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: '0 0 2px 0', lineHeight: '1.2' }}>{kpi.valor}</h2>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{kpi.detalle}</p>
                </>
              ) : (
                <>
                  <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 2px 0', lineHeight: '1' }}>{kpi.valor}</h2>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', margin: '0 0 2px 0' }}>{kpi.subtitulo}</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', color: '#999', margin: 0 }}>{kpi.detalle}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 20px 0' }}>Todos los reportes</h3>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #EAEAEA', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #FDF2F3' }}>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Reporte</th>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Descripción</th>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Periodo</th>
                <th style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', padding: '20px 30px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportesData.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: index !== reportesData.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                  <td style={{ padding: '20px 30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: item.bg, color: item.color, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', flexShrink: 0, border: `1.5px solid ${item.color}40` }}>
                        <i className={item.icon}></i>
                      </div>
                      <span style={{ fontFamily: 'Poppins-Medium', fontSize: '15px', color: '#5A3E41' }}>{item.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 30px', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', maxWidth: '300px', lineHeight: '1.4' }}>
                    {item.descripcion}
                  </td>
                  <td style={{ padding: '20px 30px', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777' }}>
                    {item.periodo}
                  </td>
                  <td style={{ padding: '20px 30px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => descargar(item.nombre, "xlsx")}
                        disabled={!!descargando}
                        style={{ backgroundColor: 'white', color: '#27AE60', border: '1.5px solid #27AE60', borderRadius: '6px', padding: '6px 15px', fontFamily: 'Poppins-Medium', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <i className="fa-solid fa-download"></i> {descargando === `${item.nombre}-xlsx` ? "..." : "Excel"}
                      </button>
                      <button
                        onClick={() => descargar(item.nombre, "pdf")}
                        disabled={!!descargando}
                        style={{ backgroundColor: 'white', color: '#C6676D', border: '1.5px solid #C6676D', borderRadius: '6px', padding: '6px 15px', fontFamily: 'Poppins-Medium', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <i className="fa-solid fa-download"></i> {descargando === `${item.nombre}-pdf` ? "..." : "PDF"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF6F7', borderRadius: '15px', padding: '35px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #FADADD' }}>
        <div style={{ maxWidth: '600px' }}>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#C6676D', margin: '0 0 15px 0' }}>Información importante</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#C6676D', fontFamily: 'Poppins-Regular', fontSize: '13px', lineHeight: '1.8' }}>
            <li>Los reportes se generan en tiempo real con la información más actualizada.</li>
            <li>Puedes descargar los reportes en formato PDF o Excel.</li>
            <li>Los reportes pueden tardar unos minutos en generarse según la cantidad de datos.</li>
          </ul>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '40px 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>
    </div>
  );
};

export default AdminReportesTab;
