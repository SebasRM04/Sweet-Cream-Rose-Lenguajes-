import React, { useState } from "react";

// Imágenes
import logoPrincipal from '../../assets/logo.png';
import cupcakeAsset from '../../assets/cupcake-cont.png';

import AdminDashboardTab from './AdminDashboardTab';
import AdminPedidosTab from './AdminPedidosTab';
import AdminProductosTab from './AdminProductosTab';
import AdminVentasTab from './AdminVentasTab';
import AdminOfertasTab from './AdminOfertasTab';
import AdminGananciasTab from './AdminGananciasTab';
import AdminReportesTab from './AdminReportesTab';
import AdminComentariosTab from './AdminComentariosTab';
import AdminConfiguracionTab from './AdminConfiguracionTab';

import AdminNotificaciones from './AdminNotificaciones';
import AdminPerfil from './AdminPerfil';

const adminTabs = [
  { id: 'dashboard', icon: 'fa-solid fa-house', label: 'Dashboard' },
  { id: 'pedidos', icon: 'fa-solid fa-bag-shopping', label: 'Pedidos' },
  { id: 'productos', icon: 'fa-solid fa-basket-shopping', label: 'Productos' },
  { id: 'ventas', icon: 'fa-solid fa-chart-column', label: 'Ventas' },
  { id: 'ofertas', icon: 'fa-solid fa-percent', label: 'Ofertas' },
  { id: 'ganancias', icon: 'fas fa-dollar', label: 'Ganancias' },
  { id: 'reportes', icon: 'fa-solid fa-file-invoice', label: 'Reportes' },
  { id: 'comentarios', icon: 'fa-regular fa-star', label: 'Comentarios' },
  { id: 'configuracion', icon: 'fa-solid fa-gear', label: 'Configuración' }
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  // Contador dinámico: El backend solo debe actualizar este estado
  const [notificaciones, setNotificaciones] = useState(0);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#FAFAFA', fontFamily: 'sans-serif', overflow: 'hidden' }}>

      {/* BARRA LATERAL IZQUIERDA */}
      <div style={{
        width: '300px',
        backgroundColor: '#C3666D',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
        boxShadow: '4px 0 15px rgba(0,0,0,0.05)'
      }}>

        {/* Logo superior (Clickeable al inicio) */}
        <div
          onClick={() => window.location.href = 'http://localhost:3000/'}
          style={{ padding: '40px 20px 30px 20px', textAlign: 'center', cursor: 'pointer' }}
        >
          <img
            src={logoPrincipal}
            alt="Sweet Cream Rose"
            style={{ width: '180px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            onError={e => e.target.style.display = 'none'}
          />
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', marginTop: '10px', opacity: 0.9 }}>Repostería artesanal</p>
        </div>

        {/* Lista de Navegación */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 30px', flexGrow: 1, gap: '6px' }}>
          {adminTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  padding: '12px 25px',
                  fontFamily: isActive ? 'Poppins-Bold' : 'Poppins-Medium',
                  fontSize: '15px',
                  color: isActive ? '#C3666D' : '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '30px',
                  transition: 'all 0.2s ease',
                  opacity: isActive ? 1 : 0.85
                }}
              >
                <i className={tab.icon} style={{ fontSize: '18px', width: '22px', textAlign: 'center' }}></i>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Perfil inferior */}
        <div style={{ padding: '0 30px 30px 30px', textAlign: 'center', marginTop: '20px' }}>
          {/* Imagen estilo círculo */}
          <img
            src={cupcakeAsset}
            alt="Cupcake"
            style={{
              width: '120px', height: '120px', borderRadius: '50%', marginBottom: '15px',
              marginTop: '20px', border: '3px solid white', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
            onError={e => e.target.style.display = 'none'}
          />
          <p style={{ fontFamily: 'Rosario-Regular', fontSize: '17px', lineHeight: '1.3', marginBottom: '30px' }}>
            Dulces momentos,<br />hechos con amor
          </p>

          <div onClick={() => setActiveTab('perfil')} style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C3666D', fontSize: '18px' }}>
              <i className="fa-solid fa-user"></i>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', margin: 0, color: 'white' }}>Administrador</h4>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '11px', margin: 0, color: 'rgba(255,255,255,0.8)' }}>admin@sweetcreamrose.com</p>
            </div>
            <i className="fa-solid fa-chevron-up" style={{ fontSize: '12px', color: 'white' }}></i>
          </div>
        </div>
      </div>

      {/* CONTENIDO DERECHO */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* HEADER */}
        <div style={{ padding: '40px 50px 0 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '20px', color: '#5A3E41', cursor: 'pointer' }}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <div onClick={() => window.location.href = 'http://localhost:3000/'} style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
              <img src={logoPrincipal} alt="Logo" style={{ width: '45px', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
              <div>
                <h2 style={{ fontFamily: 'RougeScript-Regular, cursive', fontSize: '26px', color: '#C3666D', margin: '0 0 -5px 0' }}>Sweet Cream Rose</h2>
                <p style={{ fontFamily: 'Poppins-Regular', fontSize: '10px', color: '#C3666D', margin: 0 }}>Repostería artesanal</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div onClick={() => setActiveTab('notificaciones')} style={{ position: 'relative', fontSize: '22px', color: '#5A3E41', cursor: 'pointer' }}>
              <i className="fa-regular fa-bell"></i>
              {/* Solo muestra si hay más de 0 notificaciones */}
              {notificaciones > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-6px', backgroundColor: '#C3666D', color: 'white', fontSize: '10px', fontFamily: 'Poppins-Bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {notificaciones}
                </span>
              )}
            </div>
            <div onClick={() => setActiveTab('perfil')} style={{ width: '38px', height: '38px', border: '1.5px solid #C3666D', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C3666D', fontSize: '18px', cursor: 'pointer' }}>
              <i className="fa-regular fa-user"></i>
            </div>
          </div>
        </div>

        {/* RENDERIZADO DE PANTALLAS */}
        {activeTab === "dashboard" && <AdminDashboardTab setActiveTab={setActiveTab} />}
        {activeTab === "pedidos" && <AdminPedidosTab setActiveTab={setActiveTab} />}
        {activeTab === "productos" && <AdminProductosTab setActiveTab={setActiveTab} />}
        {activeTab === "ventas" && <AdminVentasTab setActiveTab={setActiveTab} />}
        {activeTab === "ofertas" && <AdminOfertasTab setActiveTab={setActiveTab} />}
        {activeTab === "ganancias" && <AdminGananciasTab setActiveTab={setActiveTab} />}
        {activeTab === "reportes" && <AdminReportesTab setActiveTab={setActiveTab} />}
        {activeTab === "comentarios" && <AdminComentariosTab setActiveTab={setActiveTab} />}
        {activeTab === "configuracion" && <AdminConfiguracionTab setActiveTab={setActiveTab} />}

        {activeTab === "notificaciones" && <AdminNotificaciones setActiveTab={setActiveTab} />}
        {activeTab === "perfil" && <AdminPerfil setActiveTab={setActiveTab} />}

      </div>
    </div>
  );
};

export default AdminPanel;