import React, { useState } from 'react';

import dividerTitle from "../../assets/divider-title.png"; 

const PoliticasEnvio = ({ setPage }) => {
    // Estado para manejar el efecto "hover" en cada fila
    const [hoveredId, setHoveredId] = useState(null);
    // Estado para el efecto "hover" del botón volver
    const [volverHover, setVolverHover] = useState(false);

    // Cambiamos 'descripcion' para que acepte nodos JSX y poder darle formato (colores, listas, saltos de línea)
    const politicasEnvioData = [
        {
            id: 1,
            titulo: "TIPO DE ENTREGA",
            descripcion: "El envío es realizado mediante una plataforma de delivery externa (como Rappi), sujeta a disponibilidad en la zona.",
            icon: "fas fa-motorcycle"
        },
        {
            id: 2,
            titulo: "TIEMPO DE ENTREGA",
            descripcion: (
                <>
                    El tiempo estimado de entrega puede variar según la distancia, el tráfico y las condiciones del servicio de delivery.
                    <br /><br />
                    <span style={{ color: '#C6676D' }}>Tiempo referencial: entre 20 y 60 minutos.</span>
                </>
            ),
            icon: "fas fa-shipping-fast"
        },
        {
            id: 3,
            titulo: "SEGUIMIENTO DEL PEDIDO",
            descripcion: "Podrás realizar el seguimiento de tu pedido en tiempo real a través del sistema de la plataforma de delivery, donde se mostrará el estado y ubicación del repartidor.",
            icon: "fas fa-map-marker-alt"
        },
        {
            id: 4,
            titulo: "EMPAQUE DEL PRODUCTO",
            descripcion: (
                <>
                    Todos nuestros productos son empacados cuidadosamente utilizando un sistema de doble protección:
                    <ul style={{ margin: '5px 0 5px 20px', padding: 0 }}>
                        <li>Una caja interna decorada que contiene el producto.</li>
                        <li>Una caja externa resistente que protege el traslado.</li>
                    </ul>
                    Esto nos permite conservar la calidad y presentación del postre durante el envío.
                </>
            ),
            icon: "fas fa-box-open"
        },
        {
            id: 5,
            titulo: "RESPONSABILIDAD",
            descripcion: "Nos responsabilizamos por la correcta preparación y embalaje del producto. El servicio de transporte es responsabilidad de la plataforma de delivery.",
            icon: "fas fa-shield-alt"
        },
        {
            id: 6,
            titulo: "CONDICIONES DE ENTREGA",
            descripcion: "Es responsabilidad del cliente brindar una dirección correcta y estar disponible al momento de la entrega para recibir el pedido.",
            icon: "fas fa-user"
        },
        {
            id: 7,
            titulo: "COBERTURA",
            descripcion: "El servicio de envío está disponible únicamente en zonas cercanas y dentro del área de cobertura de la plataforma de delivery.",
            icon: "fas fa-map-marked-alt"
        },
        {
            id: 8,
            titulo: "COSTO DE ENVÍO",
            descripcion: "El costo de envío será determinado por la plataforma de delivery según la distancia y ubicación del cliente.",
            icon: "fas fa-dollar-sign"
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
                        POLÍTICAS DE ENVÍO
                    </h2>
                    
                    <img 
                        src={dividerTitle} 
                        alt="divisor" 
                        style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 20px auto' }} 
                    />
                    
                    <p style={{ color: '#5A3E41', fontSize: '15px', fontFamily: 'Poppins-Medium', lineHeight: '1.5', margin: '0' }}>
                        Nos aseguramos de que tu pedido llegue en perfectas condiciones para que<br />
                        disfrutes cada detalle de nuestros productos.
                    </p>
                </div>

                {/* Caja Unificada de Políticas (Molde Maestro) */}
                <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', overflow: 'hidden', marginBottom: '45px' }}>
                    {politicasEnvioData.map((item, index) => (
                        <div 
                            key={item.id} 
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '35px', 
                                padding: '35px 50px', 
                                borderBottom: index === politicasEnvioData.length - 1 ? 'none' : '1px solid #EAAFB8',
                                backgroundColor: hoveredId === item.id ? '#F9D7DD' : 'transparent',
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            {/* Círculo contenedor del icono */}
                            <div style={{ flexShrink: 0 }}>
                                <div style={{ 
                                    backgroundColor: '#FDF2F3', 
                                    width: '85px', 
                                    height: '85px', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <i className={item.icon} style={{ color: '#C6676D', fontSize: '35px' }}></i>
                                </div>
                            </div>
                            
                            {/* Textos informativos */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '16px', fontFamily: 'Poppins-Bold', color: '#5A3E41', margin: '0 0 10px 0', letterSpacing: '0.5px' }}>
                                    {item.titulo}
                                </h3>
                                {/* Renderizamos la descripción que ahora soporta JSX */}
                                <div style={{ fontSize: '14px', fontFamily: 'Poppins-Medium', color: '#777777', lineHeight: '1.6', margin: '0' }}>
                                    {item.descripcion}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Banner Destacado Inferior de Confianza */}
                <div style={{ 
                    backgroundColor: '#F9D7DD', 
                    borderRadius: '20px', 
                    padding: '35px 50px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '35px',
                    margin: '0 auto',
                    maxWidth: '1700px'
                }}>
                    <div style={{ flexShrink: 0 }}>
                        <i className="fas fa-box" style={{ color: '#C6676D', fontSize: '65px' }}></i>
                    </div>
                    <div>
                        <h4 style={{ color: '#5A3E41', fontSize: '20px', fontFamily: 'Poppins-Bold', margin: '0 0 8px 0' }}>
                            Nuestros postres viajan con amor
                        </h4>
                        <p style={{ color: '#C6676D', fontSize: '15px', fontFamily: 'Poppins-Medium', margin: '0' }}>
                            Para que lleguen tan perfectos como salieron de nuestra repostería.
                        </p>
                    </div>
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

export default PoliticasEnvio;