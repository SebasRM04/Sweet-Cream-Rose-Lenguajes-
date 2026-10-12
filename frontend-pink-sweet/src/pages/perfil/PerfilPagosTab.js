import React, { useState } from "react";

/*
 * Ya existe un endpoint funcional para métodos de pago en
 * MetodoPagoController.java (com.SweetCreamPink.demoSpringBoot.Controlador):
 *
 *   GET    /api/metodos-pago/usuario/{usuarioId}            -> lista los métodos del usuario
 *   POST   /api/metodos-pago/usuario/{usuarioId}             -> agrega uno nuevo
 *          body: { tipo: "VISA" | "BANCO" | "YAPE", alias, ultimosDigitos, titular, banco, esPrincipal }
 *   DELETE /api/metodos-pago/{id}/usuario/{usuarioId}        -> elimina uno
 *
 * El arreglo METODOS_PAGO de abajo es data de ejemplo (mock) mientras se
 * conecta. Los nombres de campo (tipo, alias, ultimosDigitos, titular,
 * banco, esPrincipal) ya están alineados con el modelo del backend a
 * propósito, para que cuando se reemplace por un fetch real
 * (mismo patrón que usa Perfil1.js / Perfil2.js con API_BASE + token)
 * el mapeo sea casi directo. El backend solo soporta tipo VISA/BANCO/YAPE
 * (Mastercard se muestra aquí como ejemplo visual, pero no es un tipo real
 * en el modelo actual — habría que ampliarlo si se necesita distinguir
 * marcas de tarjeta).
 */

const METODOS_PAGO = [
  { id: 1, marca: "visa",       tipo: "Visa terminada en 1234",        titular: "María Rodríguez", expiracion: "Vence 12/26", principal: true },
  { id: 2, marca: "mastercard", tipo: "Mastercard terminada en 5678",  titular: "María Rodríguez", expiracion: "Vence 08/27", principal: false },
  { id: 3, marca: "interbank",  tipo: "Interbank terminada en 4567",   titular: "María Rodríguez", expiracion: "Vence 03/26", principal: false },
  { id: 4, marca: "yape",       tipo: "YAPE",                          titular: "+51 987654123",   expiracion: "María Rodríguez", principal: false }
];

// Badge de marca dibujado en CSS/FontAwesome — no depende de imágenes externas, así nunca se rompe por hotlink/CORS como pasaba con los logos de Wikipedia/seeklogo.
const LogoMetodo = ({ marca }) => {
  const estilos = {
    visa:       { bg: '#1A1F71', label: 'VISA',  icon: null },
    mastercard: { bg: '#F2F2F2', label: null,     icon: 'mastercard-circles' },
    interbank:  { bg: '#00A14B', label: 'IB',     icon: null },
    yape:       { bg: '#722282', label: null,     icon: 'fa-solid fa-mobile-screen-button' }
  };
  const s = estilos[marca] || { bg: '#5A3E41', label: '?', icon: null };

  return (
    <div style={{ width: '64px', height: '40px', borderRadius: '8px', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {s.icon === 'mastercard-circles' ? (
        <div style={{ display: 'flex' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EB001B' }} />
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#F79E1B', marginLeft: '-8px', mixBlendMode: 'multiply' }} />
        </div>
      ) : s.icon ? (
        <i className={s.icon} style={{ color: 'white', fontSize: '18px' }}></i>
      ) : (
        <span style={{ color: 'white', fontFamily: 'Poppins-Bold', fontSize: '12px', letterSpacing: '0.5px' }}>{s.label}</span>
      )}
    </div>
  );
};

const PerfilPagosTab = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAgregarMetodo = () => {
    setShowModal(true);
  };

  const handleConocerMas = () => {
    window.open("https://tusitioweb.com/politicas-de-seguridad", "_blank");
  };

  return (
    <>
      {/* MODAL DE AGREGAR MÉTODO */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '400px', border: '2px solid #EAAFB8' }}>
            <h3 style={{ color: '#5A3E41', marginBottom: '20px', fontFamily: 'Poppins-Bold' }}>Agregar nuevo método</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input placeholder="Nombre del titular" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />
              <input placeholder="Número de tarjeta" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="MM/YY" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8', width: '50%' }} />
                <input placeholder="CVV" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #EAAFB8', width: '50%' }} />
              </div>
              <button onClick={() => setShowModal(false)} style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', marginTop: '10px', fontFamily: 'Poppins-Bold' }}>
                GUARDAR MÉTODO
              </button>
              <button onClick={() => setShowModal(false)} style={{ backgroundColor: 'transparent', color: '#5A3E41', border: '1px solid #EAAFB8', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Poppins-Regular' }}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', padding: '40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: "2px solid #FDF2F3", paddingBottom: "20px", flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-regular fa-credit-card" style={{ color: '#C6676D', fontSize: '24px' }}></i>
            <div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41', margin: '0' }}>MÉTODOS DE PAGO</h3>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: '0' }}>Administra tus tarjetas y métodos de pago de forma segura</p>
            </div>
          </div>
          
          <button 
            onClick={handleAgregarMetodo}
            style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontFamily: 'Poppins-Bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            + AGREGAR MÉTODO
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {METODOS_PAGO.map((card) => {
            const isHovered = hoveredCard === card.id;
            
            return (
              <div 
                key={card.id} 
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", border: `2px solid ${isHovered ? '#C6676D' : '#FDF2F3'}`, borderRadius: "15px", padding: "20px 25px", transition: "all 0.2s ease", flexWrap: "wrap", gap: "15px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                  <div style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
                    <LogoMetodo marca={card.marca} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '15px', color: '#5A3E41', margin: 0 }}>{card.tipo}</h4>
                      {card.principal && <span style={{ backgroundColor: "#FADADD", color: "#C6676D", fontSize: '11px', fontFamily: 'Poppins-Bold', padding: "4px 15px", borderRadius: "20px" }}>Principal</span>}
                    </div>
                    <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41', margin: 0 }}>{card.titular}</p>
                    <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: 0 }}>{card.expiracion}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <span style={{ color: "#6A8BBD", fontFamily: 'Poppins-Medium', fontSize: '14px', display: "flex", alignItems: "center", gap: "6px" }}>
                    <i className="fa-regular fa-circle-check"></i> Activa
                  </span>
                  
                  <button onClick={() => toggleMenu(card.id)} style={{ background: "none", border: "none", color: "#5A3E41", cursor: "pointer", fontSize: '20px', padding: '5px' }}>
                    ⋮
                  </button>

                  {openMenuId === card.id && (
                    <div style={{ position: "absolute", right: "20px", top: "50px", backgroundColor: "white", border: "1px solid #EAAFB8", borderRadius: "8px", padding: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, display: "flex", flexDirection: "column", gap: "5px" }}>
                      <button onClick={() => { alert('Generando recibo personalizado...'); setOpenMenuId(null); }} style={{ background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41', textAlign: 'left' }}>Recibo personalizado</button>
                      <button onClick={() => { alert('Generando recibo regular...'); setOpenMenuId(null); }} style={{ background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41', textAlign: 'left' }}>Recibo regular</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '30px', backgroundColor: "#FDF2F3", borderRadius: '15px', padding: "20px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: "flex", alignItems: "center", gap: '20px' }}>
            <div style={{ width: '50px', height: '50px', display: "flex", alignItems: "center", justifyContent: "center", color: "#C6676D", fontSize: '35px', flexShrink: 0 }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h5 style={{ fontFamily: 'Poppins-Bold', fontSize: '18px', color: '#5A3E41', margin: "0 0 5px 0" }}>Tus pagos 100% protegidos</h5>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41', margin: 0, maxWidth: '450px' }}>
                Usamos tecnología de encriptación avanzada para proteger tu información y garantizar compras seguras
              </p>
            </div>
          </div>

          <span 
            onClick={handleConocerMas}
            style={{ color: '#C6676D', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer' }}
          >
            Conocer más →
          </span>
        </div>
      </div>
    </>
  );
};

export default PerfilPagosTab;