import React, { useState, useEffect } from "react";
import logoPrincipal from '../../assets/logo.png';
import dividerTitle from '../../assets/divider-title.png';

// IMPORTAR PESTAÑAS / COMPONENTES
import PerfilInfoTab from './PerfilInfoTab';
import PerfilPedidosTab from './PerfilPedidosTab';
import PerfilDireccionesTab from './PerfilDireccionesTab';
import PerfilPagosTab from './PerfilPagosTab';
import PerfilFavoritosTab from './PerfilFavoritosTab';
import PerfilConfiguracionTab from './PerfilConfiguracionTab';

const PerfilPanel = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "",
    fechaRegistro: ""
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:8081/api/usuarios/perfil', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUsuario(data); })
      .catch(() => {});
  }, []);

  const menuTabs = [
    { id: 'info', icon: 'fa-regular fa-user', label: 'Información personal' },
    { id: 'pedidos', icon: 'fa-solid fa-bag-shopping', label: 'Mis pedidos' },
    { id: 'direcciones', icon: 'fa-solid fa-location-dot', label: 'Direcciones' },
    { id: 'pagos', icon: 'fa-solid fa-credit-card', label: 'Métodos de pago' },
    { id: 'favoritos', icon: 'fa-regular fa-heart', label: 'Favoritos' },
    { id: 'configuracion', icon: 'fa-solid fa-gear', label: 'Configuración' }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'sans-serif' }}>
      
      <section style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '20px' }}>
        <img src={logoPrincipal} alt="Logo Sweet Cream Rose" style={{ width: '230px', objectFit: 'contain', marginBottom: '15px' }} />
        <h1 style={{ color: '#5A3E41', margin: '10 0 5px 30', fontFamily: 'Poppins-Bold', fontSize: '30px', letterSpacing: '2px' }}>MI PERFIL</h1>
        <img src={dividerTitle} alt="divisor" style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 10px auto' }} />
      </section>

      {/* CONTENEDOR PRINCIPAL DOS COLUMNAS */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '30px', padding: '0 20px', flexWrap: 'wrap', alignItems: 'stretch' }}>
        
        {/* COLUMNA IZQUIERDA: MENÚ LATERAL UNIFICADO */}
        <div style={{ 
          width: '280px', 
          flexShrink: 0, 
          backgroundColor: 'white', 
          border: '2px solid #EAAFB8', 
          borderRadius: '20px', 
          padding: '40px 15px', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#FADADD', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '45px', color: '#C6676D', marginBottom: '15px' }}>
              <i className="fa-regular fa-user"></i>
            </div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 5px 0' }}>
              {usuario.nombre ? `${usuario.nombre} ${usuario.apellido || ''}`.trim() : 'Mi cuenta'}
            </h3>
            <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#C6676D', margin: '0', textDecoration: 'underline' }}>
              {usuario.correo || ''}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {menuTabs.map((tab) => {
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
                    backgroundColor: isActive ? '#FADADD' : 'transparent', 
                    border: 'none', 
                    padding: '14px 20px', 
                    fontFamily: isActive ? 'Poppins-Bold' : 'Poppins-Medium', 
                    fontSize: '14px', 
                    color: isActive ? '#C6676D' : '#5A3E41', 
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    borderRadius: '10px'
                  }}
                >
                  <i className={tab.icon} style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  {tab.label}
                </button>
              );
            })}
            
            <hr style={{ border: 'none', borderTop: '1px solid #EAAFB8', margin: '15px 10px' }} />
            
            {/* CERRAR SESIÓN */}
            <button 
              onClick={() => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('correo');
                sessionStorage.removeItem('rol');
                sessionStorage.removeItem('nombre');
                window.location.href = "/";
              }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'transparent', border: 'none', padding: '14px 20px', fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', textAlign: 'left', cursor: 'pointer', borderRadius: '10px' }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i> Cerrar sesión
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: RENDERIZADO CONDICIONAL DE COMPONENTES */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', minWidth: '300px' }}>
          
          {activeTab === "info" && <PerfilInfoTab setActiveTab={setActiveTab} usuario={usuario} setUsuario={setUsuario} />}
          {activeTab === "pedidos" && <PerfilPedidosTab setPage={setPage} />}
          {activeTab === "direcciones" && <PerfilDireccionesTab />}
          {activeTab === "pagos" && <PerfilPagosTab />}
          {activeTab === "favoritos" && <PerfilFavoritosTab />}
          {activeTab === "configuracion" && <PerfilConfiguracionTab />}

        </div>
      </div>

      {/* PROPUESTAS DE VALOR */}
      <section style={{ maxWidth: '1100px', margin: '40px auto 0', display: 'flex', justifyContent: 'space-between', padding: '30px 40px 0 40px', borderTop: '2px solid #FADADD' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-solid fa-cube" style={{ fontSize: '35px', color: '#EAAFB8' }}></i>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', maxWidth: '120px', lineHeight: '1.3' }}>Ingredientes de primera calidad</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-regular fa-heart" style={{ fontSize: '35px', color: '#EAAFB8' }}></i>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', maxWidth: '120px', lineHeight: '1.3' }}>Hecho con amor en cada detalle</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-solid fa-truck-fast" style={{ fontSize: '35px', color: '#EAAFB8' }}></i>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', maxWidth: '120px', lineHeight: '1.3' }}>Envíos seguros y rápidos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-regular fa-user" style={{ fontSize: '35px', color: '#EAAFB8' }}></i>
          <span style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', maxWidth: '120px', lineHeight: '1.3' }}>Atención personalizada para ti</span>
        </div>
      </section>

    </div>
  );
};

export default PerfilPanel;