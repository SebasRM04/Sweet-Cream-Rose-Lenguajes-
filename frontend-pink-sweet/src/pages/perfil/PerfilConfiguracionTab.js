import React, { useState } from "react";

const ToggleSwitch = ({ isOn, onClick }) => (
  <div onClick={onClick} style={{ width: '46px', height: '24px', backgroundColor: isOn ? '#C6676D' : '#EAAFB8', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s ease', flexShrink: 0 }}>
    <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: isOn ? '25px' : '3px', transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
  </div>
);

const PerfilConfiguracionTab = () => {
  const [toggles, setToggles] = useState({
    pedidos: true,
    cambios: true,
    ofertas: true,
    recordatorios: true,
    correo: true
  });

  const [passView, setPassView] = useState({ actual: false, nueva: false, confirmar: false });
  const [passValues, setPassValues] = useState({ actual: '', nueva: '', confirmar: '' });
  
  // Estados para los modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleToggle = (key) => setToggles({ ...toggles, [key]: !toggles[key] });
  const handlePassToggle = (key) => setPassView({ ...passView, [key]: !passView[key] });

  // Funciones de acción
  const handleEditarPerfil = () => setShowEditModal(true);

  const handleActualizarPass = () => {
    if(passValues.nueva !== passValues.confirmar) {
      alert("¡Error! Las contraseñas nuevas no coinciden.");
      return;
    }
    alert("Contraseña actualizada correctamente.");
  };

  const handleSeguridadAction = (titulo) => {
    setModalType(titulo);
    setShowSecurityModal(true);
  };

  return (
    <>
      {/* MODAL EDITAR PERFIL */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '400px', border: '2px solid #EAAFB8', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ color: '#5A3E41', margin: '0 0 10px 0', fontFamily: 'Poppins-Bold' }}>Editar información</h3>
            <input placeholder="Nombre completo" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />
            <input placeholder="Correo electrónico" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />
            <input placeholder="Teléfono" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />
            <input placeholder="Fecha de nacimiento" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />
            <input placeholder="Género" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />
            <button onClick={() => setShowEditModal(false)} style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>GUARDAR CAMBIOS</button>
            <button onClick={() => setShowEditModal(false)} style={{ backgroundColor: 'transparent', color: '#5A3E41', border: '1px solid #EAAFB8', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>CANCELAR</button>
          </div>
        </div>
      )}

      {/* MODAL SEGURIDAD DINÁMICO */}
      {showSecurityModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '400px', border: '2px solid #EAAFB8', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ color: '#5A3E41', margin: '0 0 10px 0', fontFamily: 'Poppins-Bold' }}>{modalType}</h3>
            {modalType === 'Verificación de dos pasos' && <input placeholder="Código de verificación" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />}
            {modalType === 'Sesiones activas' && <input type="password" placeholder="Contraseña actual" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />}
            <button onClick={() => setShowSecurityModal(false)} style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>CONFIRMAR</button>
            <button onClick={() => setShowSecurityModal(false)} style={{ backgroundColor: 'transparent', color: '#5A3E41', border: '1px solid #EAAFB8', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>CANCELAR</button>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        <div style={{ paddingBottom: '10px' }}>
          <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '24px', color: '#5A3E41', margin: '0 0 5px 0', letterSpacing: '0.5px' }}>CONFIGURACIÓN</h2>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>Administra tu cuenta y las preferencias del sistema</p>
        </div>

        {/* INFORMACIÓN DE LA CUENTA */}
        <div style={{ border: '2px solid #EAAFB8', borderRadius: '15px', padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: "1px solid #FDF2F3", paddingBottom: "20px", flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: "50%", backgroundColor: "#FDF2F3", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6676D", fontSize: '20px' }}>
                <i className="fa-regular fa-user"></i>
              </div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0' }}>Información de la cuenta</h3>
            </div>
            <button 
              onClick={handleEditarPerfil}
              style={{ backgroundColor: 'transparent', color: '#C6676D', border: '2px solid #EAAFB8', padding: '6px 20px', borderRadius: '20px', fontFamily: 'Poppins-Medium', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-pen-to-square"></i> Editar
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: "Nombre completo", value: "María Rodríguez", icon: "fa-regular fa-user" },
              { label: "Correo electrónico", value: "maria.rodriguez@gmail.com", icon: "fa-regular fa-envelope" },
              { label: "Teléfono", value: "+51 987654987", icon: "fa-solid fa-phone" },
              { label: "Fecha de nacimiento", value: "15 de mayo de 1998", icon: "fa-regular fa-calendar" },
              { label: "Genero", value: "Femenino", icon: "fa-solid fa-venus-mars" },
              { label: "Fecha de registro", value: "20 de enero de 2024", icon: "fa-regular fa-id-card" }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', borderBottom: i < 5 ? '1px solid #FDF2F3' : 'none', paddingBottom: i < 5 ? '15px' : '0' }}>
                <div style={{ width: '250px', color: '#5A3E41', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'Poppins-Bold', fontSize: '13px' }}>
                  <i className={row.icon} style={{ color: '#C6676D', width: '20px', textAlign: 'center', fontSize: '16px' }}></i> {row.label}
                </div>
                <div style={{ color: '#5A3E41', fontFamily: 'Poppins-Regular', fontSize: '14px' }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CAMBIAR CONTRASEÑA */}
        <div style={{ border: '2px solid #EAAFB8', borderRadius: '15px', padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: "50%", backgroundColor: "#FDF2F3", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6676D", fontSize: '20px' }}>
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 2px 0' }}>Cambiar contraseña</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { id: 'actual', label: 'Contraseña actual:', placeholder: 'Ingresa tu contraseña actual' },
              { id: 'nueva', label: 'Nueva contraseña:', placeholder: 'Ingresa tu nueva contraseña' },
              { id: 'confirmar', label: 'Confirmar nueva contraseña:', placeholder: 'Confirmar tu nueva contraseña' }
            ].map((input) => (
              <div key={input.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontFamily: 'Poppins-Bold', fontSize: '13px', color: '#5A3E41' }}>{input.label}</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={passView[input.id] ? "text" : "password"} 
                    placeholder={input.placeholder} 
                    onChange={(e) => setPassValues({...passValues, [input.id]: e.target.value})}
                    style={{ width: '100%', padding: '12px 45px 12px 15px', border: '2px solid #EAAFB8', borderRadius: '10px', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41', outline: 'none', boxSizing: 'border-box' }} 
                  />
                  <i 
                    className={`fa-regular ${passView[input.id] ? 'fa-eye' : 'fa-eye-slash'}`} 
                    onClick={() => handlePassToggle(input.id)}
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#777', cursor: 'pointer' }}>
                  </i>
                </div>
              </div>
            ))}
            <button onClick={handleActualizarPass} style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontFamily: 'Poppins-Medium', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-end', marginTop: '10px' }}>
              Actualizar contraseña
            </button>
          </div>
        </div>

        {/* NOTIFICACIONES */}
        <div style={{ border: '2px solid #EAAFB8', borderRadius: '15px', padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: "50%", backgroundColor: "#FDF2F3", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6676D", fontSize: '20px' }}>
              <i className="fa-regular fa-bell"></i>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 2px 0' }}>Notificaciones</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { key: 'pedidos', title: 'Nuevos pedidos' },
              { key: 'cambios', title: 'Cambios en pedidos' },
              { key: 'ofertas', title: 'Ofertas y promociones' },
              { key: 'recordatorios', title: 'Recordatorios importantes' },
              { key: 'correo', title: 'Notificaciones por correo' }
            ].map((item, i) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: i < 4 ? '15px' : '0', borderBottom: i < 4 ? '1px solid #FDF2F3' : 'none' }}>
                <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', margin: '0' }}>{item.title}</h4>
                <ToggleSwitch isOn={toggles[item.key]} onClick={() => handleToggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* SEGURIDAD DE LA CUENTA */}
        <div style={{ border: '2px solid #EAAFB8', borderRadius: '15px', padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: "50%", backgroundColor: "#FDF2F3", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6676D", fontSize: '20px' }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: '0 0 2px 0' }}>Seguridad de la cuenta</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { title: 'Verificación de dos pasos', btnText: 'ACTIVAR' },
              { title: 'Dispositivos conectados', btnText: 'VER DISPOSITIVOS' },
              { title: 'Sesiones activas', btnText: 'VER SESIONES' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: i < 2 ? '15px' : '0', borderBottom: i < 2 ? '1px solid #FDF2F3' : 'none', flexWrap: 'wrap', gap: '15px' }}>
                <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', margin: '0' }}>{item.title}</h4>
                <button 
                  onClick={() => handleSeguridadAction(item.title)}
                  style={{ backgroundColor: 'transparent', color: '#C6676D', border: '2px solid #EAAFB8', padding: '8px 25px', borderRadius: '25px', fontFamily: 'Poppins-Medium', fontSize: '12px', cursor: 'pointer' }}>
                  {item.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilConfiguracionTab;