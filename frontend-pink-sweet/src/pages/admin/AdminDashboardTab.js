import React, { useState, useEffect } from "react";
import { apiGet } from "../../api";
import { resolverImagenProducto } from "../../utils/imagenProducto";

// Imagen por defecto cuando el producto no trae imagen desde el backend
import imgPlaceholder from '../../assets/products/a-clasico.png';

const AdminDashboardTab = ({ setActiveTab }) => {
  // Lógica de navegación del backend
  const ir = (t) => setActiveTab && setActiveTab(t);
  
  // Estado para la API
  const [kpi, setKpi] = useState(null);
  const [errorDash, setErrorDash] = useState("");
  
  useEffect(() => { 
    apiGet("/api/admin/dashboard")
      .then((d) => { setKpi(d); setErrorDash(""); })
      .catch((e) => setErrorDash(e.message || "No se pudo cargar el dashboard. Verifica que el admin esté logueado."));
  }, []);

  // Preparando las listas para recibir datos reales del backend. 
  // Si no hay datos (kpi nulo o vacío), se muestra un esqueleto en 0 para no romper el diseño.
  const pedidosRecientes = kpi?.pedidosRecientes?.length > 0 ? kpi.pedidosRecientes : [
    { id: '#000000', nombre: 'A la espera de datos...', tiempo: '--', estado: 'Sin pedidos', bgBadge: '#F5F5F5', colorBadge: '#999' }
  ];

  const productosVendidos = kpi?.productosVendidos?.length > 0
    ? kpi.productosVendidos.map(p => ({
        ...p,
        img: resolverImagenProducto(p.imagenUrl, imgPlaceholder),
      }))
    : [
        { rank: 0, img: imgPlaceholder, nombre: 'A la espera de datos...', unidades: '0 unidades', precio: 'S/ 0.00' }
      ];

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%' }}>
      
      {/* HEADER DEL DASHBOARD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
          <div>
            <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '26px', color: '#5A3E41', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
              ¡BIENVENIDA, ADMINISTRADORA! 👋
            </h1>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>
              Este es el resumen general de tu negocio.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ border: '1px solid #D9D9D9', borderRadius: '10px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#5A3E41', cursor: 'pointer' }}>
            <i className="fa-regular fa-calendar"></i>
            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', marginLeft: '10px' }}></i>
          </div>
        </div>
      </div>

      {errorDash && (
        <p style={{ color: '#C6676D', fontFamily: 'Poppins-Medium', marginBottom: '20px' }}>{errorDash}</p>
      )}

      {/* TARJETAS DE MÉTRICAS (KPIs conectados y en 0 por defecto) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '35px' }}>
        
        {/* Tarjeta 1 - Pedidos */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '2px solid #FADADD' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#FDF2F3', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#F194B4', fontSize: '22px', marginBottom: '20px' }}>
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', margin: '0 0 5px 0' }}>Pedidos activos</p>
          <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '36px', color: '#5A3E41', margin: '0 0 10px 0' }}>
            {kpi ? (kpi.ordenesPendientes + kpi.ordenesConfirmadas) : 0}
          </h2>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: '0 0 20px 0' }}><span style={{ color: '#27AE60' }}>{kpi ? kpi.totalPedidos : 0} pedidos en total</span></p>
          <span onClick={() => ir("pedidos")} style={{ cursor:'pointer', fontFamily: 'Poppins-SemiBold', fontSize: '14px', color: '#F194B4', textDecoration: 'underline' }}>Ver pedidos</span>
        </div>

        {/* Tarjeta 2 - Ventas */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '2px solid #FDE49E' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#FFF9E6', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#F2C94C', fontSize: '22px', marginBottom: '20px' }}>
            <i className="fa-solid fa-basket-shopping"></i>
          </div>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', margin: '0 0 5px 0' }}>Ventas de hoy</p>
          <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '36px', color: '#5A3E41', margin: '0 0 10px 0' }}>
            {kpi ? `S/ ${Number(kpi.ingresosHoy||0).toFixed(2)}` : "S/ 0.00"}
          </h2>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: '0 0 20px 0' }}><span style={{ color: '#27AE60' }}>{kpi ? (kpi.ordenesHoy || 0) : 0} pedidos hoy</span></p>
          <span onClick={() => ir("ventas")} style={{ cursor:'pointer', fontFamily: 'Poppins-SemiBold', fontSize: '14px', color: '#F2C94C', textDecoration: 'underline' }}>Ver ventas</span>
        </div>

        {/* Tarjeta 3 - Ganancias */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '2px solid #A9DFBF' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#E9F7EF', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#27AE60', fontSize: '22px', marginBottom: '20px' }}>
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', margin: '0 0 5px 0' }}>Ventas del mes</p>
          <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '36px', color: '#5A3E41', margin: '0 0 10px 0' }}>
            {kpi ? `S/ ${Number(kpi.ingresosMes||0).toFixed(2)}` : "S/ 0.00"}
          </h2>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: '0 0 20px 0' }}><span style={{ color: '#27AE60' }}>{kpi ? kpi.totalOrdenesMes : 0} pedidos este mes</span></p>
          <span onClick={() => ir("ganancias")} style={{ cursor:'pointer', fontFamily: 'Poppins-SemiBold', fontSize: '14px', color: '#F194B4', textDecoration: 'underline' }}>Ver ganancias</span>
        </div>

        {/* Tarjeta 4 - Total de productos */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '2px solid #D7BDE2' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#F4ECF7', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9B59B6', fontSize: '22px', marginBottom: '20px' }}>
            <i className="fa-solid fa-box-open"></i>
          </div>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777', margin: '0 0 5px 0' }}>Total de productos</p>
          <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '36px', color: '#5A3E41', margin: '0 0 10px 0' }}>
            {kpi?.totalProductos || 0}
          </h2>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: '0 0 20px 0' }}>en catálogo</p>
          <span onClick={() => ir("productos")} style={{ cursor:'pointer', fontFamily: 'Poppins-SemiBold', fontSize: '14px', color: '#F194B4', textDecoration: 'underline' }}>Ver catálogo</span>
        </div>
      </div>

      {/* SECCIÓN DE GRÁFICOS (Textos en 0 hasta conectar DB) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '25px', marginBottom: '35px' }}>
        
        {/* Gráfico Ventas */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: 0 }}>Ventas de la semana</h3>
          </div>
          {(() => {
            const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            const valores = kpi?.ventasSemana?.length === 7 ? kpi.ventasSemana : [0,0,0,0,0,0,0];
            const maxVal = Math.max(...valores, 500);
            const puntos = valores.map((v, i) => {
              const x = 90 + (i * 80);
              const y = 220 - (Math.min(v, maxVal) / maxVal) * 200;
              return { x, y, v };
            });
            const pathLine = `M ${puntos[0].x} ${puntos[0].y} ` + puntos.map(p => `L ${p.x} ${p.y}`).join(' ');
            const pathArea = pathLine + ` L ${puntos[6].x} 220 L ${puntos[0].x} 220 Z`;
            const escalas = [0, 0.25, 0.5, 0.75, 1].map(f => ({
              y: 220 - f * 200,
              val: `S/ ${(maxVal * f).toFixed(0)}`
            })).reverse();

            return (
              <div style={{ height: '280px', width: '100%', position: 'relative' }}>
                <svg viewBox="0 0 600 250" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F194B4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#F194B4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {escalas.map((line, i) => (
                    <g key={i}>
                      <text x="0" y={line.y + 4} fill="#999" fontSize="12" fontFamily="Poppins-Medium">{line.val}</text>
                      <line x1="60" y1={line.y} x2="600" y2={line.y} stroke="#EAEAEA" strokeWidth="1" strokeDasharray={i === 4 ? "0" : "5,5"} />
                    </g>
                  ))}
                  {dias.map((day, i) => (
                    <text key={i} x={90 + (i * 80)} y="245" fill="#999" fontSize="13" fontFamily="Poppins-Medium" textAnchor="middle">{day}</text>
                  ))}
                  <path d={pathArea} fill="url(#lineGradient)" />
                  <path d={pathLine} fill="none" stroke="#F194B4" strokeWidth="3" />
                  {puntos.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#F194B4" />
                  ))}
                </svg>
              </div>
            );
          })()}
        </div>

        {/* Gráfico Donut Estados */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 20px 0' }}>Estados de pedidos</h3>
          {(() => {
            const estados = [
              { label: 'Pendientes', valor: kpi?.ordenesPendientes || 0, color: '#F194B4' },
              { label: 'Confirmadas', valor: kpi?.ordenesConfirmadas || 0, color: '#F2C94C' },
              { label: 'Completadas', valor: kpi?.ordenesCompletadas || 0, color: '#27AE60' },
              { label: 'Canceladas', valor: kpi?.ordenesCanceladas || 0, color: '#9B59B6' },
            ];
            const totalMes = estados.reduce((s, e) => s + e.valor, 0);
            let acumulado = 0;

            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', flex: 1 }}>
                  <div style={{ width: '160px', height: '160px', position: 'relative' }}>
                    <svg viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', overflow: 'visible' }}>
                      <circle r="15.915" cx="16" cy="16" fill="none" stroke="#FDF2F3" strokeWidth="3.5" />
                      {totalMes > 0 && estados.map((e, i) => {
                        const pct = (e.valor / totalMes) * 100;
                        const dashoffset = -acumulado;
                        acumulado += pct;
                        if (pct === 0) return null;
                        return (
                          <circle key={i} r="15.915" cx="16" cy="16" fill="none"
                            stroke={e.color} strokeWidth="3.5"
                            strokeDasharray={`${pct} ${100 - pct}`}
                            strokeDashoffset={dashoffset}
                          />
                        );
                      })}
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#777', fontFamily: 'Poppins-Medium' }}>Total</span>
                      <span style={{ fontSize: '28px', color: '#5A3E41', fontFamily: 'Poppins-Bold', lineHeight: '1' }}>{kpi?.totalPedidos || 0}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#777' }}>
                  {estados.map((e, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><span style={{ color: e.color, fontSize: '18px', marginRight: '8px' }}>●</span> {e.label}</div>
                      <span>{e.valor} ({totalMes > 0 ? ((e.valor / totalMes) * 100).toFixed(0) : 0}%)</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* SECCIÓN LISTAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
        
        {/* Pedidos Recientes */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: 0 }}>Pedidos recientes</h3>
            <span onClick={() => ir("pedidos")} style={{ color: '#C3666D', fontSize: '14px', fontFamily: 'Poppins-Medium', cursor: 'pointer' }}>Ver todos</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {pedidosRecientes.map((pedido, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#FDF2F3', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#F194B4', fontSize: '20px' }}>
                    <i className="fa-solid fa-bag-shopping"></i>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '15px', color: '#5A3E41', margin: '0 0 2px 0' }}>{pedido.id}</h4>
                    <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41', margin: '0 0 2px 0' }}>{pedido.nombre}</p>
                    <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: 0 }}>{pedido.tiempo}</p>
                  </div>
                </div>
                <div style={{ backgroundColor: pedido.bgBadge, color: pedido.colorBadge, padding: '6px 16px', borderRadius: '20px', fontFamily: 'Poppins-Medium', fontSize: '12px' }}>
                  {pedido.estado}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '25px' }}>
            <span onClick={() => ir("pedidos")} style={{ cursor:'pointer', fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C3666D', textDecoration: 'none' }}>Ir a pedidos {'>'}</span>
          </div>
        </div>

        {/* Productos Más Vendidos */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: 0 }}>Productos más vendidos</h3>
            <span onClick={() => ir("productos")} style={{ color: '#C3666D', fontSize: '14px', fontFamily: 'Poppins-Medium', cursor: 'pointer' }}>Ver todos</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {productosVendidos.map((prod, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41', width: '20px' }}>{prod.rank}</span>
                  <img src={prod.img} alt={prod.nombre} style={{ width: '80px', height: '55px', objectFit: 'cover', borderRadius: '12px' }} />
                  <div>
                    <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', margin: '0 0 3px 0' }}>{prod.nombre}</h4>
                    <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>{prod.unidades}</p>
                  </div>
                </div>
                <div style={{ fontFamily: 'Poppins-Medium', fontSize: '15px', color: '#5A3E41' }}>
                  {prod.precio}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACCIONES RÁPIDAS */}
      <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', border: '1px solid #EAEAEA', marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 25px 0' }}>Acciones rápidas</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            { icon: 'fa-solid fa-cake-candles', text: 'Nuevo producto', tab: 'productos' },
            { icon: 'fa-solid fa-bag-shopping', text: 'Nuevo pedido manual', tab: 'pedidos' },
            { icon: 'fa-solid fa-dollar-sign', text: 'Registrar venta', tab: 'ventas' },
            { icon: 'fa-solid fa-file-invoice', text: 'Ver reportes', tab: 'reportes' }
          ].map((accion, i) => (
            <div key={i} onClick={() => ir(accion.tab)} style={{ backgroundColor: '#FDF2F3', border: '2px solid #F194B4', borderRadius: '15px', padding: '25px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ width: '50px', height: '50px', border: '2px solid #F194B4', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#F194B4', fontSize: '24px', marginBottom: '15px' }}>
                <i className={accion.icon}></i>
              </div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: 0, padding: '0 10px' }}>{accion.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

    </div>
  );
};

export default AdminDashboardTab;