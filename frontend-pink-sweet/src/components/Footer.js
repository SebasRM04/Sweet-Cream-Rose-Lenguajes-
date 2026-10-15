import React from 'react';
import logoPrincipal from '../assets/logo.png';

const Footer = ({ setPage }) => {
  return (
      <footer style={{ backgroundColor: '#C6676D', color: 'white', padding: '30px 40px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '140px', alignItems: 'flex-start', width: '100%', marginBottom: '20px', maxWidth: '1100px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ position: 'relative', width: '135px', height: '135px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
              
              <div style={{ 
                position: 'absolute', 
                backgroundColor: '#ffffff', 
                borderRadius: '50%', 
                zIndex: 1,
                width: '110px',
                height: '110px',
                filter: 'blur(1px)'
              }}></div>
              
              <img src={logoPrincipal} alt="Logo Sweet Cream Rose" style={{ width: '135px', height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 2 }} />
            
            </div>

            <p style={{ fontFamily: 'Sansita-Regular', fontSize: '14px', marginTop: '0px', marginBottom: '0', color: 'white', lineHeight: '1.4', maxWidth: '180px' }}>En un mundo de experiencias duras con un pastel dale dulzura.</p>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 20px 0', fontFamily: 'Poppins-Bold', fontSize: '20px', fontWeight: 'bold', color: 'white' }}>ENLACES</h4>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '16px' }}>
                <li onClick={() => setPage('inicio')} style={{ fontFamily: 'Sedan-Regular', cursor: 'pointer', color: 'white' }}>Inicio</li>
                <li onClick={() => setPage('productos')} style={{ fontFamily: 'Sedan-Regular', cursor: 'pointer', color: 'white' }}>Productos</li>
                <li onClick={() => setPage('ofertas')} style={{ fontFamily: 'Sedan-Regular', cursor: 'pointer', color: 'white' }}>Ofertas</li>
                <li onClick={() => setPage('nosotros')} style={{ fontFamily: 'Sedan-Regular', cursor: 'pointer', color: 'white' }}>Nosotros</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 20px 0', fontFamily: 'Poppins-Bold', fontSize: '20px', fontWeight: 'bold', color: 'white' }}>AYUDA</h4>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '16px' }}>
                <li onClick={() => setPage('preguntasFrecuentes')} style={{ fontFamily: 'Sedan-Regular', cursor: 'pointer', color: 'white' }}>Preguntas frecuentes</li>
                <li onClick={() => setPage('politicasEnvio')} style={{ fontFamily: 'Sedan-Regular', cursor: 'pointer', color: 'white' }}>Políticas de envío</li>
                <li onClick={() => setPage('terminosCondiciones')} style={{ fontFamily: 'Sedan-Regular', cursor: 'pointer', color: 'white' }}>Términos y condiciones</li>
                <li onClick={() => setPage('politicasPrivacidad')} style={{ fontFamily: 'Sedan-Regular', cursor: 'pointer', color: 'white' }}>Políticas de privacidad</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 20px 0', fontFamily: 'Poppins-Bold', fontSize: '20px', fontWeight: 'bold', color: 'white' }}>CONTÁCTANOS</h4>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '16px' }}>
                <li style={{ fontFamily: 'Sedan-Regular', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                  <i className="fa-solid fa-location-dot" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i> Lima, Perú
                </li>
                <li style={{ fontFamily: 'SofiaSans-Regular', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                  <i className="fa-solid fa-phone" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i> +51 992376537
                </li>
                <li style={{ fontFamily: 'Sedan-Regular', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                  <i className="fa-solid fa-envelope" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i> sweetcreamrose@gmail.com
                </li>
                <li style={{ fontFamily: 'Sedan-Regular', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                  <i className="fa-solid fa-clock" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i> Lunes a Sábado: 9am - 6pm
                </li>
            </ul>
          </div>
          
        </div>
        
        <div style={{ width: '100%', borderTop: '1px solid #EAAFB8', marginBottom: '20px' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 10px', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <span style={{ fontSize: '17px', fontWeight: 'bold', color: 'white', fontFamily: 'Poppins-Bold', marginRight: '8px' }}>SÍGUENOS</span>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <i className="fa-brands fa-facebook-f" style={{ fontSize: '22px', cursor: 'pointer' }}></i>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <i className="fa-brands fa-instagram" style={{ fontSize: '24px', cursor: 'pointer' }}></i>
            </a>
            <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '24px', cursor: 'pointer' }}></i>
            </a>
          </div>

          <p style={{ fontSize: '15px', color: 'white', margin: '0', textAlign: 'right', fontFamily: 'Sedan-Regular' }}>© 2026 Sweet Cream Rose. Todos los derechos reservados.</p>
        </div>
      </footer>
  );
};

export default Footer;