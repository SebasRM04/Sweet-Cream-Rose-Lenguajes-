import React, { useState, useRef } from "react";

const AdminPerfil = () => {

  // Referencia para el input de archivo (oculto)
  const fileInputRef = useRef(null);

  // ESTADO CENTRALIZADO
  // Backend solo debe actualizar este objeto al hacer fetch de /api/perfil
  const [perfilData, setPerfilData] = useState({
    nombre: "Alizon Lucero",
    telefono: "+51 992 376 537",
    documento: "61225578",
    direccion: "Lima, Perú",
    correo: "admin@gmail.com",
    nacimiento: "13/10/2006",
    area: "Administración",
    cargo: "Administrador General",
    contratacion: "15/05/2026",
    contrato: "Indefinido",
    horario: "Mañana",
    salario: "Nivel administrativo",
    usuario: "admin_Aluce",
    rol: "Administrador General",
    ultimoAcceso: "04 Jun 2026 - 09:15 AM",
    ip: "192.168.1.100",
    estado: "Activo",
    nivelAcceso: "Completo",
    // Imagen por defecto, puede ser URL externa o base64
    fotoUrl: "https://media.discordapp.net/attachments/1121487955622633484/1524243873671680050/aliz.jpg?ex=6a4f0a3a&is=6a4db8ba&hm=2c1b3262475a07917f72b437da844ebc877c4be59d3b820e6e04837e1ea72ae2&=&format=webp&width=912&height=912" 
  });

  // Estado temporal para manejar el hover de la foto
  const [hoverFoto, setHoverFoto] = useState(false);

  // Lógica para manejar la subida de foto local
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPerfilData(prev => ({ ...prev, fotoUrl: imageUrl }));
      // Aquí el Backend debería hacer un POST a la API para guardar el archivo
    }
  };

  // Lógica para pedir URL externa de foto
  const handleUrlUpload = () => {
    const url = prompt("Ingresa la URL de tu nueva foto de perfil:");
    if (url) {
      setPerfilData(prev => ({ ...prev, fotoUrl: url }));
      // Aquí el Backend debería hacer un PUT a la API con la nueva URL
    }
  };

  // Data dinámica conectada al estado principal
  const kpis = [
    { titulo: "Tipo de Usuario", valor: "Administrador", icon: "fa-regular fa-user", color: "#F194B4", border: "#FADADD" },
    { titulo: "Área asignada", valor: perfilData.area, icon: "fa-solid fa-briefcase", color: "#27AE60", border: "#A9DFBF" },
    { titulo: "Fecha de ingreso", valor: perfilData.contratacion, icon: "fa-regular fa-calendar-days", color: "#F2C94C", border: "#FDE49E" },
    { titulo: "Permisos", valor: "Acceso completo", icon: "fa-regular fa-circle-check", color: "#9B59B6", border: "#D7BDE2" },
  ];

  const permisos = [
    "Gestión de Pedidos", "Gestión de Productos", "Gestión de Ventas",
    "Gestión de Horarios", "Gestión de Ofertas", "Gestión de Ganancias", "Gestión de Reportes",
    "Gestión de Comentarios", "Configuración del Sistema"
  ];

  // Actividad vacía a la espera de BD
  const actividadReciente = []; 

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>
      
      {/* TÍTULO */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0' }}>Perfil de Usuario</h1>
        <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>Consulta la información de tu cuenta dentro del sistema.</p>
      </div>

      {/* TARJETAS SUPERIORES (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 25px', border: `1.5px solid ${kpi.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ color: kpi.color, fontSize: '32px', flexShrink: 0 }}>
              <i className={kpi.icon}></i>
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '11px', color: '#777', margin: '0 0 2px 0' }}>{kpi.titulo}</p>
              <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0, lineHeight: '1.2' }}>{kpi.valor}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* PANELES DE INFORMACIÓN PRINCIPAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
        
        {/* COLUMNA IZQUIERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Información Personal */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
              <div style={{ color: '#F194B4', fontSize: '18px' }}><i className="fa-solid fa-store"></i></div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Información personal</h3>
            </div>
            
            {/* SECCIÓN DE FOTO EDITABLE */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', position: 'relative' }}>
              <div 
                onMouseEnter={() => setHoverFoto(true)}
                onMouseLeave={() => setHoverFoto(false)}
                style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#EAEAEA', overflow: 'hidden', border: '3px solid #FADADD', position: 'relative', cursor: 'pointer' }}
                onClick={() => fileInputRef.current.click()}
              >
                <img src={perfilData.fotoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.3s', filter: hoverFoto ? 'brightness(0.6)' : 'brightness(1)' }} />
                
                {/* Overlay oscuro al pasar el mouse */}
                {hoverFoto && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '24px' }}>
                    <i className="fa-solid fa-camera"></i>
                  </div>
                )}
              </div>
              
              {/* Botón flotante para URL o alternativas */}
              <button 
                onClick={handleUrlUpload}
                title="Cambiar por URL"
                style={{ position: 'absolute', bottom: '0', right: 'calc(50% - 60px)', backgroundColor: 'white', border: '1.5px solid #FADADD', color: '#C6676D', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 2 }}
              >
                <i className="fa-solid fa-link" style={{ fontSize: '12px' }}></i>
              </button>

              {/* Input oculto para subir archivo local */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <i className="fa-regular fa-user" style={{ color: '#F194B4', fontSize: '18px', marginTop: '3px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#5A3E41', margin: '0 0 2px 0' }}>Nombre completo</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{perfilData.nombre}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <i className="fa-solid fa-phone" style={{ color: '#F194B4', fontSize: '16px', marginTop: '3px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#5A3E41', margin: '0 0 2px 0' }}>Teléfono</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{perfilData.telefono}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <i className="fa-regular fa-id-card" style={{ color: '#F194B4', fontSize: '16px', marginTop: '3px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#5A3E41', margin: '0 0 2px 0' }}>Documento</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{perfilData.documento}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#F194B4', fontSize: '16px', marginTop: '3px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#5A3E41', margin: '0 0 2px 0' }}>Dirección</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{perfilData.direccion}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <i className="fa-regular fa-envelope" style={{ color: '#F194B4', fontSize: '16px', marginTop: '3px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#5A3E41', margin: '0 0 2px 0' }}>Correo electrónico</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{perfilData.correo}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <i className="fa-regular fa-calendar" style={{ color: '#F194B4', fontSize: '16px', marginTop: '3px' }}></i>
                <div>
                  <p style={{ fontFamily: 'Poppins-Medium', fontSize: '12px', color: '#5A3E41', margin: '0 0 2px 0' }}>Fecha de nacimiento</p>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: 0 }}>{perfilData.nacimiento}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Laboral */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
              <div style={{ color: '#F194B4', fontSize: '18px' }}><i className="fa-solid fa-briefcase"></i></div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Información laboral</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-regular fa-building" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Área</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.area}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-regular fa-user" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Cargo</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.cargo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-regular fa-calendar-days" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Fecha de contratación</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.contratacion}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-regular fa-file-lines" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Tipo de contrato</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.contrato}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-regular fa-clock" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Horario asignado</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.horario}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-solid fa-dollar-sign" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Categoría salarial</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.salario}</span>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Información de Acceso */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
              <div style={{ color: '#F194B4', fontSize: '18px' }}><i className="fa-solid fa-circle-info"></i></div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Información de acceso</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-regular fa-user" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Usuario</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.usuario}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-solid fa-user-group" style={{ color: '#F194B4', fontSize: '16px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Rol</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.rol}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-regular fa-clock" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Ultimo acceso</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.ultimoAcceso}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-solid fa-globe" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Última IP</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.ip}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-regular fa-circle-check" style={{ color: '#27AE60', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Estado</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#27AE60' }}>{perfilData.estado}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className="fa-solid fa-lock" style={{ color: '#F194B4', fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>Nivel de acceso</span>
                </div>
                <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{perfilData.nivelAcceso}</span>
              </div>
            </div>
          </div>

          {/* Permisos del sistema */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
              <div style={{ color: '#F194B4', fontSize: '18px' }}><i className="fa-solid fa-shield-halved"></i></div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Permisos del sistema</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {permisos.map((permiso, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className="fa-regular fa-circle-check" style={{ color: '#27AE60', fontSize: '16px' }}></i>
                  <span style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41' }}>{permiso}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #EAEAEA', marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
          <div style={{ color: '#F194B4', fontSize: '18px' }}><i className="fa-regular fa-clock"></i></div>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: 0 }}>Actividad reciente</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #EAEAEA' }}>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '0 0 15px 0', fontWeight: 'normal' }}>Fecha y hora</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '0 0 15px 0', fontWeight: 'normal' }}>Módulo</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '0 0 15px 0', fontWeight: 'normal' }}>Acción realizada</th>
              <th style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', padding: '0 0 15px 0', fontWeight: 'normal' }}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {actividadReciente.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '30px 0', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', textAlign: 'center' }}>
                  A la espera de datos sobre actividad reciente.
                </td>
              </tr>
            ) : (
              actividadReciente.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '15px 0', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{item.fecha}</td>
                  <td style={{ padding: '15px 0', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41' }}>{item.modulo}</td>
                  <td style={{ padding: '15px 0', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41' }}>{item.accion}</td>
                  <td style={{ padding: '15px 0', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777' }}>{item.detalle}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BANNER ADMINISTRADOR PRINCIPAL */}
      <div style={{ backgroundColor: '#FFF6F7', borderRadius: '12px', padding: '30px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #FADADD', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ color: '#F194B4', fontSize: '60px' }}>
            <i className="fa-regular fa-user"></i>
          </div>
          <div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#C6676D', margin: '0 0 5px 0' }}>Administrador principal</h3>
            <p style={{ fontFamily: 'Poppins-Medium', fontSize: '14px', color: '#C6676D', margin: 0, maxWidth: '500px', lineHeight: '1.4' }}>
              Tienes acceso completo a todos los módulos del sistema y puedes supervisar la operación general de la pastelería.
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

export default AdminPerfil;