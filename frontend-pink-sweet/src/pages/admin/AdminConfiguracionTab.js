import React, { useState } from "react";
import logoPrincipal from '../../assets/logo.png'; 

const AdminConfiguracionTab = () => {

  // Uso de sessionStorage para persistir las preferencias de la vista
  const [preferencias, setPreferencias] = useState(() => {
    try { 
      return JSON.parse(sessionStorage.getItem('adminPreferencias')) || { web: true, whatsapp: true, notificaciones: true }; 
    } catch { 
      return { web: true, whatsapp: true, notificaciones: true }; 
    }
  });

  const [guardado, setGuardado] = useState(false);

  const guardarPreferencias = () => {
    sessionStorage.setItem('adminPreferencias', JSON.stringify(preferencias));
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const handleToggle = (key) => {
    setPreferencias(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // KPIs EN CERO
  const kpis = [
    { titulo: "Información del negocio", valor: "0", detalle: "datos registrados", icon: "fa-solid fa-store", color: "#F194B4", border: "#FADADD" },
    { titulo: "Preferencias activas", valor: "0", detalle: "configuraciones activas", icon: "fa-solid fa-gear", color: "#27AE60", border: "#A9DFBF" }, 
    { titulo: "Ultimo respaldo", valor: "--/--/--", detalle: "Sin datos", icon: "fa-solid fa-database", color: "#F2C94C", border: "#FDE49E" },
    { titulo: "Estado del sistema", valor: "Desconectado", detalle: "A la espera de BD", icon: "fa-solid fa-desktop", color: "#9B59B6", border: "#D7BDE2", valorColor: "#777" },
  ];

  // DATOS REALES
  const infoNegocio = [
    { label: "Nombre comercial", valor: "Sweet Cream Rose", icon: "fa-regular fa-id-card", color: "#F194B4" },
    { label: "RUC", valor: "10620226462", icon: "fa-regular fa-envelope", color: "#F194B4" }, 
    { label: "Teléfono", valor: "+51 992 376 537", icon: "fa-solid fa-phone", color: "#F194B4" },
    { label: "Correo electrónico", valor: "sweetcreamrose@gmail.com", icon: "fa-regular fa-calendar", color: "#F194B4" }, 
    { label: "Dirección", valor: "Lima, Perú", icon: "fa-solid fa-location-dot", color: "#F194B4" },
  ];

  // DATOS DE SISTEMA EN CERO/ESPERA
  const infoSistema = [
    { label: "Versión del sistema", valor: "0.0.0", isSuccess: false },
    { label: "Última actualización", valor: "--/--/----", isSuccess: false },
    { label: "Base de datos", valor: "0 (Desconectada)", isSuccess: false },
    { label: "Estado del sistema", valor: "0 (Sin conexión)", isSuccess: false },
    { label: "Servidor", valor: "0", isSuccess: false }, 
  ];

  const toggleConfig = [
    { key: "web", titulo: "Permitir pedidos web", desc: "Los clientes pueden realizar pedidos desde la web", icon: "fa-solid fa-globe", color: "#F194B4" },
    { key: "whatsapp", titulo: "Permitir pedidos por WhatsApp", desc: "Habilitar recepción de pedidos por WhatsApp", icon: "fa-brands fa-whatsapp", color: "#27AE60" },
    { key: "notificaciones", titulo: "Recibir notificaciones de nuevos pedidos", desc: "Notificar automáticamente sobre nuevos pedidos", icon: "fa-regular fa-bell", color: "#F194B4" },
  ];

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>

      {/* TÍTULO */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0' }}>Configuración</h1>
        <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>Administra la información básica del sistema.</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: `2px solid ${kpi.border}`, display: 'flex', alignItems: 'flex-start', gap: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: kpi.color, fontSize: '20px', flexShrink: 0, border: `2px solid ${kpi.color}`, backgroundColor: 'white' }}>
              <i className={kpi.icon}></i>
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#777', margin: '0 0 5px 0' }}>{kpi.titulo}</p>
              <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '24px', color: kpi.valorColor || '#5A3E41', margin: '0 0 5px 0', lineHeight: '1' }}>{kpi.valor}</h2>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '11px', color: '#999', margin: 0 }}>{kpi.detalle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BLOQUES DE INFORMACIÓN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
        
        {/* Información del negocio */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <div style={{ color: '#F194B4', fontSize: '20px' }}><i className="fa-solid fa-store"></i></div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Información del negocio</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {infoNegocio.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '220px' }}>
                  <i className={item.icon} style={{ color: item.color, fontSize: '16px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>{item.label}</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{item.valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Información del sistema */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <div style={{ color: '#F194B4', fontSize: '20px' }}><i className="fa-solid fa-circle-info"></i></div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Información del sistema</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {infoSistema.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41' }}>{item.label}</span>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: item.isSuccess ? '#27AE60' : '#777' }}>{item.valor}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PREFERENCIAS OPERATIVAS */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA', marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
          <div style={{ color: '#F194B4', fontSize: '20px' }}><i className="fa-solid fa-gear"></i></div>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Preferencias operativas</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {toggleConfig.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: index !== toggleConfig.length - 1 ? '15px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ color: item.color, fontSize: '18px', marginTop: '2px', width: '25px', textAlign: 'center' }}>
                  <i className={item.icon}></i>
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', margin: '0 0 3px 0' }}>{item.titulo}</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
              
              {/* Botón Toggle */}
              <div 
                onClick={() => handleToggle(item.key)}
                style={{ 
                  width: '46px', 
                  height: '24px', 
                  borderRadius: '12px', 
                  backgroundColor: preferencias[item.key] ? '#D68994' : '#EAEAEA', 
                  position: 'relative', 
                  cursor: 'pointer', 
                  transition: 'background-color 0.3s ease' 
                }}
              >
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  backgroundColor: 'white', 
                  position: 'absolute', 
                  top: '2px', 
                  left: preferencias[item.key] ? '24px' : '2px', 
                  transition: 'left 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}></div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button 
            onClick={guardarPreferencias} 
            style={{ 
              backgroundColor: guardado ? '#27AE60' : 'white', 
              color: guardado ? 'white' : '#C6676D', 
              border: `1.5px solid ${guardado ? '#27AE60' : '#C6676D'}`, 
              borderRadius: '8px', 
              padding: '10px 25px', 
              fontFamily: 'Poppins-Medium', 
              fontSize: '13px', 
              cursor: 'pointer', 
              transition: 'all .2s' 
            }}
          >
            {guardado ? '✓ Preferencias guardadas' : 'Guardar preferencias'}
          </button>
        </div>
      </div>

      {/* BANNER ¡EXCELENTE TRABAJO! */}
      <div style={{ backgroundColor: '#FFF6F7', borderRadius: '12px', padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <div style={{ color: '#F194B4', fontSize: '40px' }}>
          <i className="fa-solid fa-cupcake"></i>
        </div>
        <div>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#C6676D', margin: '0 0 5px 0' }}>¡Excelente trabajo!</h3>
          <p style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', margin: 0 }}>Cada pedido entregado crea un momento especial para tus clientes.</p>
        </div>
      </div>

      {/* FOOTER */}
      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

    </div>
  );
};

export default AdminConfiguracionTab;