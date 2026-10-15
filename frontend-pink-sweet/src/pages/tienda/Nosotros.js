import React, { useState } from 'react';

import logoPrincipal from '../../assets/logo.png';
import dividerTitle from "../../assets/divider-title.png"; 
import cupcakeAsset from '../../assets/cupcake-cont.png';
import cupcake2Asset from '../../assets/cupcake2-cont.png';
import mapaImg from '../../assets/mapa-cont.png';

const Nosotros = () => {

  const [formData, setFormData] = useState({ nombre: '', mensaje: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mensaje enviado:", formData);
  };

  return (
    <div style={{ backgroundColor: '#FFEFEF', fontFamily: 'Poppins-Regular, sans-serif', minHeight: '100vh', paddingBottom: '100px' }}>
      
      <section style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '20px' }}>
        <img src={logoPrincipal} alt="Logo Sweet Cream Rose" style={{ width: '230px', objectFit: 'contain', marginBottom: '15px' }} />
        <h1 style={{ color: '#5A3E41', margin: '10 0 5px 30', fontFamily: 'Poppins-Bold', fontSize: '30px', letterSpacing: '2px' }}>NOSOTROS</h1>
        <img src={dividerTitle} alt="divisor" style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 10px auto' }} />
      </section>

      {/* SECCIÓN HERO CONTÁCTANOS */}
      <section style={{ maxWidth: '975px', margin: '0 auto 68px auto', display: 'flex', alignItems: 'center', gap: '35px', padding: '0' }}>
        <div style={{ flex: '1' }}>

          <h1 style={{ fontFamily: 'RougeScript-Regular', fontSize: '112px', color: '#5A3E41', margin: '0 0 11px 0', lineHeight: '1.1', maxWidth: '490px' }}>
            Contáctanos
          </h1>
          <h2 style={{ fontFamily: 'Rosario-Regular', fontSize: '30px', color: '#5A3E41', margin: '0 0 16px 0', lineHeight: '1.3', maxWidth: '490px' }}>
            ¡Ven a conocernos y endulza tu día!
          </h2>
          <p style={{ fontFamily: 'Rosario-Regular', fontSize: '23px', color: '#5A3E41', lineHeight: '1.5', margin: '0', maxWidth: '490px' }}>
            Siempre estamos felices de recibirte y atenderte. A continuación te dejamos toda la información para que nos encuentres fácil y rápido:
          </p>
        </div>
        <div style={{ flex: '1', height: '400px' }}>

          <img 
            src={cupcakeAsset} 
            alt="Cupcakes Contáctanos" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} 
          />
        </div>
      </section>

      {/* SECCIÓN TARJETAS */}
      <section style={{ maxWidth: '975px', margin: '0 auto 90px auto', display: 'flex', gap: '45px', padding: '0' }}>
        
        {/* TARJETA IZQUIERDA */}
        <div style={{ flex: '1', backgroundColor: '#EAAFB8', padding: '22px', borderRadius: '0' }}>
          <div style={{ backgroundColor: '#ffeded', borderRadius: '0', padding: '34px 34px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxSizing: 'border-box' }}>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '25px', color: '#5A3E41', margin: '0 0 16px 0' }}>
              <span style={{ color: '#EAAFB8' }}>•</span> Nuestra Sucursal <span style={{ color: '#EAAFB8' }}>•</span>
            </h3>
            <p style={{ fontFamily: 'Poppins-Medium', fontSize: '16px', color: '#5A3E41', margin: '0 0 22px 0', lineHeight: '1.4' }}>
              Los Olivos<br/>Av. Los Próceres de Huandoy - Mz.33A Lt.13
            </p>
            {/* FOTO MAPA */}
            <div style={{ width: '100%', height: '160px', marginBottom: '22px', borderRadius: '11px', overflow: 'hidden' }}>
              <img 
                src={mapaImg} 
                alt="Mapa Sucursal" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={e => e.target.style.display='none'} 
              />
            </div>
            <a
              href="https://maps.app.goo.gl/A3riJ6B1X5LeHMQM8"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#C6676D', color: 'white', textDecoration: 'none', display: 'inline-block', padding: '11px 34px', fontFamily: 'Poppins-SemiBold', fontSize: '16px', borderRadius: '22px', cursor: 'pointer', marginTop: 'auto' }}
            >
              Cómo llegar
            </a>
          </div>
        </div>

        {/* TARJETA DERECHA */}
        <div style={{ flex: '1', backgroundColor: '#EAAFB8', padding: '22px', borderRadius: '0' }}>
          <div style={{ backgroundColor: '#ffeded', borderRadius: '0', padding: '34px 22px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '25px', color: '#5A3E41', margin: '0 0 28px 0', textAlign: 'center' }}>
              <span style={{ color: '#EAAFB8' }}>•</span> Horarios y Contacto <span style={{ color: '#EAAFB8' }}>•</span>
            </h3>
            
            <ul style={{ listStyle: 'none', padding: '0', margin: '0 0 34px 11px', fontFamily: 'Poppins-Medium', fontSize: '15px', color: '#5A3E41', lineHeight: '1.3' }}>
              <li style={{ marginBottom: '6px' }}><span style={{ color: '#C6676D', marginRight: '6px', fontSize: '28px' }}>•</span>Lunes a Sábado de 9:00 am - 8:00 pm</li>
              <li><span style={{ color: '#C6676D', marginRight: '6px', fontSize: '28px' }}>•</span>Domingo de 9:00 am - 4:00 pm</li>
            </ul>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: '11px', marginBottom: '34px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Poppins-SemiBold', fontSize: '18px', color: '#5A3E41' }}>
                <div style={{ width: '34px', height: '34px', backgroundColor: '#C6676D', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '15px' }}>
                  <i className="fa-solid fa-phone"></i>
                </div>
                +51 992 376 537
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Poppins-Medium', fontSize: '17px', color: '#5A3E41' }}>
                <div style={{ width: '34px', height: '34px', backgroundColor: '#C6676D', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '15px' }}>
                  <i className="fa-solid fa-envelope"></i>
                </div>
                sweetcreamrose@gmail.com
              </div>
            </div>

            {/* REDES ICONOS */}
            <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', marginTop: 'auto' }}>
              {[ {icon: 'fa-facebook-f'}, {icon: 'fa-instagram'}, {icon: 'fa-whatsapp'} ].map((r,idx) => (
                <div key={idx} style={{ width: '40px', height: '40px', backgroundColor: '#C6676D', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '18px' }}>
                  <i className={`fa-brands ${r.icon}`}></i>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* FORMULARIO */}
      <section style={{ maxWidth: '975px', margin: '0 auto', display: 'flex', gap: '45px', padding: '0', alignItems: 'center' }}>
        <div style={{ flex: '1', height: '370px' }}>
          {/* FOTO CUPCAKE-CONT.PNG OTRA VEZ (Como en Figma) */}
          <img 
            src={cupcake2Asset} 
            alt="Déjanos un mensaje" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} 
          />
        </div>
        
        <div style={{ flex: '1' }}>
          <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '31px', color: '#5A3E41', margin: '0 0 11px 0' }}>
            Déjanos un mensaje
          </h2>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '15px', color: '#5A3E41', margin: '0 0 28px 0', lineHeight: '1.4' }}>
            ¿Tienes alguna pregunta o sugerencia? Completa el formulario y te responderemos lo más pronto posible.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Poppins-SemiBold', fontSize: '15px', color: '#5A3E41', marginBottom: '5px' }}>Nombre</label>

              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Escribe tu nombre completo" 
                style={{ width: '100%', backgroundColor: '#FADADD', border: 'none', padding: '13px 16px', fontFamily: 'Poppins-Medium', fontSize: '14px', outline: 'none', color: '#5A3E41', borderRadius: '5px', boxSizing: 'border-box' }} 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontFamily: 'Poppins-SemiBold', fontSize: '15px', color: '#5A3E41', marginBottom: '5px' }}>Mensaje</label>

              <textarea 
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Mensaje" 
                rows={4}
                style={{ width: '100%', backgroundColor: '#FADADD', border: 'none', padding: '13px 16px', fontFamily: 'Poppins-Medium', fontSize: '14px', outline: 'none', resize: 'vertical', color: '#5A3E41', borderRadius: '5px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '5px' }}>

              <button type="submit" style={{ backgroundColor: '#EAAFB8', color: 'white', border: 'none', padding: '11px 45px', fontFamily: 'Poppins-Bold', fontSize: '15px', borderRadius: '9px', cursor: 'pointer' }}>
                ENVIAR
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Nosotros;