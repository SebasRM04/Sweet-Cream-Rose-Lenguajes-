import React, { useState } from 'react';

import dividerTitle from "../../assets/divider-title.png"; 

// Componente hijo para manejar el estado (abierto/cerrado) de cada pregunta de forma independiente
const FAQItem = ({ pregunta, respuesta, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                border: '1px solid',
                borderColor: isOpen || isHovered ? '#EAAFB8' : '#F3D2D7',
                borderRadius: '16px',
                backgroundColor: isOpen || isHovered ? '#F9D7DD' : 'white',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                marginBottom: '15px'
            }}
        >
            {/* Cabecera clickeable de la pregunta */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '15px 45px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '15px', fontFamily: 'Poppins-Bold', color: '#5A3E41' }}>
                    {/* Círculo del icono (Más pequeño que en otras vistas para la lista) */}
                    <div style={{ 
                        width: '55px', 
                        height: '55px', 
                        backgroundColor: 'white', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: '1px solid #EAAFB8', 
                        flexShrink: 0 
                    }}>
                        <i className={icon} style={{ color: '#C6676D', fontSize: '22px' }}></i>
                    </div>
                    {pregunta}
                </div>
                
                {/* Icono de la derecha dinámico (Chevrón o Círculo de Resta) */}
                {isOpen ? (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #C6676D', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C6676D', flexShrink: 0 }}>
                        <i className="fas fa-minus" style={{ fontSize: '12px' }}></i>
                    </div>
                ) : (
                    <i className="fas fa-chevron-down" style={{ color: '#C6676D', fontSize: '18px', flexShrink: 0 }}></i>
                )}
            </div>
            
            {/* Contenido desplegable (Respuesta) */}
            {isOpen && (
                <div style={{ padding: '0 60px 25px 120px', color: '#C6676D', fontSize: '14px', fontFamily: 'Poppins-Medium', lineHeight: '1.6' }}>
                    <p style={{ margin: 0 }}>{respuesta}</p>
                </div>
            )}
        </div>
    );
};

const PreguntasFrecuentes = ({ setPage }) => {
    const [btnHover, setBtnHover] = useState(false);
    // Estado para el efecto "hover" del botón volver
    const [volverHover, setVolverHover] = useState(false);

    // Datos estructurados idénticos a la foto del Figma
    const data = [
        { 
            pregunta: "¿Cómo puedo realizar un pedido?", 
            respuesta: "Puedes realizar tu pedido a través de nuestra tienda online seleccionando tus productos favoritos y agregándolos al carrito. Luego, sigue los pasos para completar tu compra.", 
            icon: "fas fa-shopping-bag" 
        },
        { 
            pregunta: "¿Con cuánta anticipación debo hacer mi pedido?", 
            respuesta: "Para postres del catálogo regular, puedes hacer tu pedido el mismo día (sujeto a stock). Para pasteles personalizados o eventos, te recomendamos solicitarlos con un mínimo de 48 a 72 horas de anticipación.", 
            icon: "fas fa-birthday-cake" 
        },
        { 
            pregunta: "¿Realizan envíos a domicilio?", 
            respuesta: "Sí, realizamos envíos a domicilio mediante plataformas de delivery externas que garantizan la rapidez y el cuidado de tus postres hasta llegar a tu puerta.", 
            icon: "fas fa-truck" 
        },
        { 
            pregunta: "¿En qué zonas realizan envíos?", 
            respuesta: "Actualmente llegamos a la mayor parte de Lima Metropolitana. Podrás verificar la cobertura exacta ingresando tu dirección en el checkout de la tienda.", 
            icon: "fas fa-map-marker-alt" 
        },
        { 
            pregunta: "¿Cuál es el horario de atención?", 
            respuesta: "Nuestro horario de atención al cliente es de Lunes a Sábado de 9:00 am a 6:00 pm.", 
            icon: "far fa-clock" 
        },
        { 
            pregunta: "¿Qué métodos de pago aceptan?", 
            respuesta: "Aceptamos todas las tarjetas de crédito y débito, transferencias bancarias y billeteras digitales (Yape, Plin).", 
            icon: "far fa-credit-card" 
        },
        { 
            pregunta: "¿Puedo modificar o cancelar mi pedido?", 
            respuesta: "Los pedidos solo pueden ser modificados o cancelados si aún no han entrado en proceso de preparación. Contáctanos lo antes posible para ayudarte.", 
            icon: "fas fa-box-open" 
        },
        { 
            pregunta: "¿Los productos contienen preservantes?", 
            respuesta: "No, en Sweet Cream Rose preparamos todos nuestros postres de manera artesanal y fresca, sin utilizar preservantes añadidos.", 
            icon: "fas fa-cake" 
        },
        { 
            pregunta: "¿Tienen opciones para personas con alergias o restricciones alimentarias?", 
            respuesta: "Sí, contamos con opciones específicas libres de gluten y sin lactosa. Te sugerimos revisar la descripción detallada de cada producto en el catálogo.", 
            icon: "fas fa-leaf" 
        },
        { 
            pregunta: "¿Cómo obtengo mi factura o boleta?", 
            respuesta: "Al finalizar tu compra podrás elegir entre recibir boleta o factura. El comprobante electrónico será enviado automáticamente a tu correo registrado.", 
            icon: "fas fa-file-invoice" 
        },
        { 
            pregunta: "¿Ofrecen opciones para eventos o pedidos corporativos?", 
            respuesta: "¡Por supuesto! Preparamos mesas de dulces, pasteles para celebraciones grandes y regalos corporativos. Escríbenos para enviarte una propuesta personalizada.", 
            icon: "fas fa-gift" 
        }
    ];

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 20px 80px 20px', fontFamily: 'Poppins-Regular' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                {/* Botón Volver */}
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
                        PREGUNTAS FRECUENTES
                    </h2>
                    
                    <img 
                        src={dividerTitle} 
                        alt="divisor" 
                        style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 20px auto' }} 
                    />
                    
                    <p style={{ color: '#5A3E41', fontSize: '15px', fontFamily: 'Poppins-Medium', lineHeight: '1.5', margin: '0' }}>
                        Encuentra respuestas a las preguntas más comunes sobre nuestros productos,<br />
                        pedidos y envíos
                    </p>
                </div>

                {/* Lista de Acordeones Independientes */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {data.map((item, index) => (
                        <FAQItem key={index} {...item} />
                    ))}
                </div>

                {/* Banner de contacto inferior (Estilo Figma) */}
                <div style={{ 
                    backgroundColor: '#F9D7DD', 
                    borderRadius: '20px', 
                    padding: '30px 45px', 
                    marginTop: '30px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        {/* Puedes reemplazar este icono por tu PNG de audífonos cuando lo tengas */}
                        <i className="fas fa-headset" style={{ fontSize: '50px', color: '#C6676D' }}></i>
                        <div>
                            <h3 style={{ fontSize: '18px', fontFamily: 'Poppins-Bold', color: '#5A3E41', margin: '0 0 5px 0' }}>¿No encuentras lo que buscas?</h3>
                            <p style={{ fontSize: '14px', color: '#6E464C', fontFamily: 'Poppins-Medium', lineHeight: '1.4', margin: '0' }}>
                                Contáctanos y con gusto te ayudamos a crear<br />el postre perfecto
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setPage('nosotros')}
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        style={{
                            backgroundColor: btnHover ? '#B14B47' : '#C6676D', 
                            color: 'white',
                            border: 'none',
                            padding: '12px 25px',
                            borderRadius: '10px',
                            fontFamily: 'Poppins-Bold',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        CONTACTAR <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
                    </button>
                </div>

            </div>

            {/* PROPUESTAS DE VALOR (Alineación perfecta a 1100px) */}
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

export default PreguntasFrecuentes;