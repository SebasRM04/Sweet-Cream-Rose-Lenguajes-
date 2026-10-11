import React, { useState } from 'react';

import dividerTitle from "../../assets/divider-title.png"; 

const PoliticasPrivacidad = ({ setPage }) => {
    // Estado para manejar el efecto "hover" en línea
    const [hoveredId, setHoveredId] = useState(null);
    // Estado para el efecto "hover" del botón volver
    const [volverHover, setVolverHover] = useState(false);

    const politicasData = [
        {
            id: 1,
            titulo: "1. INFORMACIÓN QUE RECOPILAMOS",
            descripcion: "Recopilamos información personal que nos proporcionas al registrarte, realizar compras o contactarnos, como nombre, correo electrónico, teléfono y dirección de entrega.",
            icon: "fas fa-user-shield"
        },
        {
            id: 2,
            titulo: "2. USO DE TU INFORMACIÓN",
            descripcion: "Utilizamos tu información para procesar pedidos, realizar entregas, mejorar tu experiencia en la aplicación y enviarte comunicaciones relacionadas con tus pedidos u ofertas.",
            icon: "fas fa-folder-open"
        },
        {
            id: 3,
            titulo: "3. PROTECCIÓN DE TU INFORMACIÓN",
            descripcion: "Podrás realizar el seguimiento de tu pedido en tiempo real a través del sistema de la plataforma de delivery, donde se mostrará el estado y ubicación del repartidor.",
            icon: "fas fa-shield-alt"
        },
        {
            id: 4,
            titulo: "4. COMPARTIR INFORMACIÓN",
            descripcion: "No vendemos ni alquilamos tu información personal. Podemos compartirla con servicios externos únicamente para procesar pagos o realizar entregas (ej. plataformas de delivery).",
            icon: "fas fa-share-alt"
        },
        {
            id: 5,
            titulo: "5. COOKIES Y TECNOLOGÍAS SIMILARES",
            descripcion: "Usamos cookies y tecnologías similares para mejorar tu navegación, recordar tus preferencias y analizar el uso de nuestra aplicación. Puedes desactivar las cookies desde la configuración de tu dispositivo.",
            icon: "fas fa-cookie-bite"
        },
        {
            id: 6,
            titulo: "6. TUS DERECHOS",
            descripcion: "Tienes derecho a acceder, corregir o eliminar tu información personal. Si deseas ejercer alguno de estos derechos, contáctanos a través de nuestros canales de atención.",
            icon: "fas fa-trash-alt"
        },
        {
            id: 7,
            titulo: "7. CAMBIOS EN LA POLÍTICA",
            descripcion: "Podemos actualizar esta política de privacidad en cualquier momento. Te notificaremos sobre cambios importantes a través de la aplicación o por correo electrónico.",
            icon: "fas fa-file-signature"
        },
        {
            id: 8,
            titulo: "8. CONTACTO",
            descripcion: "Si tienes dudas sobre esta política de privacidad, puedes escribirnos a info@sweetcreamrose.com o comunicarte a través de nuestros canales de atención en la aplicación.",
            icon: "fas fa-envelope"
        }
    ];

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 20px 80px 20px', fontFamily: 'Poppins-Regular' }}>
            
            {/* Contenedor Principal Central (800px) */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Botón de retroceso */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '-10px', marginLeft: '-10px' }}>
                    <button
                        onClick={() => setPage('inicio')}
                        onMouseEnter={() => setVolverHover(true)}
                        onMouseLeave={() => setVolverHover(false)}
                        style={{
                            background: volverHover ? '#FDF2F3' : 'none',
                            border: 'none',
                            color: '#C6676D',
                            fontSize: '36px',
                            lineHeight: 0,
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                        }}
                        title="Volver al inicio"
                    >
                        <i className="fa-solid fa-circle-left"></i>
                    </button>
                </div>

                {/* Encabezado Principal */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ color: '#5A3E41', fontSize: '26px', fontFamily: 'Poppins-Bold', margin: '0 0 0px 0', letterSpacing: '1px' }}>
                        POLÍTICAS DE PRIVACIDAD
                    </h2>
                    
                    <img 
                        src={dividerTitle} 
                        alt="divisor" 
                        style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 20px auto' }} 
                    />
                    
                    <p style={{ color: '#5A3E41', fontSize: '15px', fontFamily: 'Poppins-Medium', lineHeight: '1.5', margin: '0' }}>
                        En Sweet Cream Rose, tu privacidad es muy importante para nosotros. Esta<br />
                        política explica cómo recopilamos, usamos y protegemos tu información.
                    </p>
                </div>

                {/* Caja Unificada de Políticas (Molde Maestro) */}
                <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', overflow: 'hidden', marginBottom: '35px' }}>
                    {politicasData.map((item, index) => (
                        <div 
                            key={item.id} 
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '35px', 
                                padding: '30px 60px', 
                                borderBottom: index === politicasData.length - 1 ? 'none' : '1px solid #EAAFB8',
                                backgroundColor: hoveredId === item.id ? '#F9D7DD' : 'transparent',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            {/* Círculo contenedor del icono */}
                            <div style={{ flexShrink: 0 }}>
                                <div style={{ backgroundColor: '#FDF2F3', width: '85px', height: '85px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #F9D5DA' }}>
                                    <i className={item.icon} style={{ color: '#C6676D', fontSize: '32px' }}></i>
                                </div>
                            </div>
                            
                            {/* Textos informativos */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '16px', fontFamily: 'Poppins-Bold', color: '#5A3E41', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>
                                    {item.titulo}
                                </h3>
                                <p style={{ fontSize: '14px', fontFamily: 'Poppins-Regular', color: '#777777', lineHeight: '1.6', margin: '0' }}>
                                    {item.descripcion}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Banner Destacado Inferior de Confianza */}
                <div style={{ backgroundColor: '#F9D7DD', borderRadius: '20px', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                    <div style={{ flexShrink: 0 }}>
                        {/* Puedes cambiar esta etiqueta <i> por tu PNG cuando lo tengas */}
                        <i className="fas fa-user-shield" style={{ color: '#EAAFB8', fontSize: '60px' }}></i>
                    </div>
                    <div>
                        <h4 style={{ color: '#5A3E41', fontSize: '18px', fontFamily: 'Poppins-Bold', margin: '0 0 5px 0' }}>
                            Tu confianza es nuestro ingrediente principal
                        </h4>
                        <p style={{ color: '#C6676D', fontSize: '15px', fontFamily: 'Poppins-Medium', margin: '0' }}>
                            Gracias por permitirnos ser parte de tus momentos más dulces.
                        </p>
                    </div>
                </div>

            </div>

            {/* PROPUESTAS DE VALOR (Ancho de 1100px para alinear con footer) */}
            <div style={{ maxWidth: '1100px', margin: '60px auto 0 auto', display: 'flex', justifyContent: 'space-between', padding: '30px 40px 0 40px', borderTop: '2px solid #FADADD' }}>
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
            </div>

        </div>
    );
};

export default PoliticasPrivacidad;