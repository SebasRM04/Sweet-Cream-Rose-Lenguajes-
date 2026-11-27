import React, { useState } from 'react';

import dividerTitle from "../../assets/divider-title.png";

const TerminosCondiciones = ({ setPage }) => {
    const [hoveredId, setHoveredId] = useState(null);
    // Estado para el efecto "hover" del botón volver
    const [volverHover, setVolverHover] = useState(false);

    const terminosData = [
        { id: 1, titulo: "1. ACEPTACIÓN DE LOS TÉRMINOS", descripcion: "Al acceder y utilizar nuestra aplicación, aceptas cumplir con estos términos y condiciones, así como nuestras políticas de privacidad y envío.", icon: "fas fa-file-alt" },
        { id: 2, titulo: "2. PRODUCTOS", descripcion: "Nuestros productos son elaborados artesanalmente con ingredientes de calidad. Las imágenes son referenciales y pueden variar ligeramente en decoración y presentación.", icon: "fas fa-shopping-bag" },
        { id: 3, titulo: "3. PRECIOS Y PAGOS", descripcion: "Todos los precios están expresados en soles (S/). El pago debe realizarse al momento de confirmar el pedido a través de los métodos disponibles en la aplicación.", icon: "fas fa-credit-card" },
        { id: 4, titulo: "4. ENVÍOS", descripcion: "Los envíos son realizados mediante plataformas externas de delivery. El tiempo de entrega puede variar según la ubicación y condiciones del servicio.", icon: "fas fa-motorcycle" },
        { id: 5, titulo: "5. CANCELACIONES Y MODIFICACIONES", descripcion: "Los pedidos solo pueden ser cancelados o modificados dentro del tiempo establecido antes de su preparación. Una vez en proceso, no podrán ser modificados.", icon: "fas fa-box" },
        { id: 6, titulo: "6. DEVOLUCIONES Y REEMBOLSOS", descripcion: "No realizamos devoluciones en productos perecederos. Si tu pedido llega con algún error o daño, contáctanos dentro de los primeros 30 minutos de recibido.", icon: "fas fa-sync-alt" },
        { id: 7, titulo: "7. PROTECCIÓN DE DATOS", descripcion: "Tu información personal está protegida y será utilizada únicamente para procesar tu pedido y mejorar tu experiencia en nuestra aplicación.", icon: "fas fa-shield-alt" },
        { id: 8, titulo: "8. RESPONSABILIDAD", descripcion: "Sweet Cream Rose no se hace responsable por retrasos o incidencias ocasionadas por terceros (servicio de delivery, proveedores o fuerza mayor).", icon: "fas fa-balance-scale" },
        { id: 9, titulo: "9. MODIFICACIONES", descripcion: "Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones serán publicadas en la aplicación.", icon: "fas fa-pen-square" },
        { id: 10, titulo: "10. CONTACTO", descripcion: "Para cualquier consulta, puedes escribirnos a través de nuestros canales de atención disponibles en la aplicación.", icon: "fas fa-heart" }
    ];

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 20px 80px 20px', fontFamily: 'Poppins-Regular' }}>
            
            {/* Contenedor Principal Central (800px) */}
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

                {/* Header Actualizado */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ color: '#5A3E41', fontSize: '26px', fontFamily: 'Poppins-Bold', margin: '0 0 0px 0', letterSpacing: '1px' }}>
                        TÉRMINOS Y CONDICIONES
                    </h2>
                    
                    {/* AQUÍ ESTÁ EL CAMBIO: Reemplazamos el texto por tu imagen */}
                    <img 
                        src={dividerTitle} 
                        alt="divisor" 
                        style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 20px auto' }} 
                    />
                    
                    <p style={{ color: '#5A3E41', fontSize: '15px', fontFamily: 'Poppins-Medium', lineHeight: '1.5', margin: '0' }}>
                        Al utilizar nuestra aplicación y realizar compras en Sweet Cream Rose, aceptas<br />
                        los siguientes términos y condiciones:
                    </p>
                </div>

                {/* Contenedor con borde estándar de 2px */}
                <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', overflow: 'hidden' }}>
                    {terminosData.map((item, index) => (
                        <div 
                            key={item.id} 
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '35px', 
                                padding: '30px 60px',
                                borderBottom: index === terminosData.length - 1 ? 'none' : '1px solid #EAAFB8',
                                backgroundColor: hoveredId === item.id ? '#F9D7DD' : 'transparent',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            {/* Círculo del icono */}
                            <div style={{ flexShrink: 0 }}>
                                <div style={{ backgroundColor: '#FDF2F3', width: '85px', height: '85px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #F9D5DA' }}>
                                    <i className={item.icon} style={{ color: '#C6676D', fontSize: '32px' }}></i>
                                </div>
                            </div>
                            
                            {/* Texto informativo */}
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

export default TerminosCondiciones;