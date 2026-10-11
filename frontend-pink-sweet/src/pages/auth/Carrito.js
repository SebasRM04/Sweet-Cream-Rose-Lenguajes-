import React, { useState, useEffect, useRef } from 'react';
import { apiGet, apiPost, getUsuarioId } from '../../api';
import logoPrincipal from '../../assets/logo.png';
import dividerTitle from "../../assets/divider-title.png";

// Imágenes de Inicio
import torta from "../../assets/products/torta_principal.jpg";
import navidad from "../../assets/products/navidad.jpg";
import halloween from "../../assets/products/halloween.jpg";
import cupcake from "../../assets/products/cupcake.jpg";
import payLimon from "../../assets/products/pay_limon.jpg";
import flan from "../../assets/products/flan.jpg";
import galletas from "../../assets/products/galletas.jpg";
import gelatina from "../../assets/products/gelatina.jpg";
import pastelImposible from "../../assets/products/pastel_imposible.jpg";
import { resolverImagenProducto, onImgErrorFallback } from '../../utils/imagenProducto';

// Datos de Inicio
const slides = [
  { img: torta,     title: "Nuestros\nEspeciales",  text: "Especiales para cualquier ocasión y disfrutar con las personas que más quieres" },
  { img: navidad,   title: "Postres\nNavideños",    text: "Celebra la navidad con los mejores postres artesanales para compartir en familia" },
  { img: halloween, title: "Postres de\nHalloween",  text: "Sorprende a todos con postres espeluznantes y deliciosos para Halloween" },
];

const homeProducts = [
  { img: cupcake,        label: "Cupcake de fresa" },
  { img: payLimon,       label: "Pay de limón" },
  { img: flan,           label: "Flan de vainilla" },
  { img: galletas,       label: "Galletas de fresa" },
  { img: gelatina,       label: "Gelatina" },
  { img: pastelImposible,label: "Pastel Imposible" },
];

const testimonials = [
  { name: "Juliana López",   text: "Sus paquetes son ideales para regalar sorpresas." },
  { name: "Emilio Orozco",   text: "Entregan a tiempo y con buena calidad cada postre." },
  { name: "Valentina Gómez", text: "Tienen ricos sabores y los productos llegan a tiempo." },
];

const Inicio = ({ setPage }) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(testimonials);
  const [productosDB, setProductosDB] = useState([]);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [mensajeComentario, setMensajeComentario] = useState("");
  const timerRef = useRef(null);

  const startSlider = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % slides.length), 5000);
  };
  
  useEffect(() => { 
    startSlider(); 
    return () => clearInterval(timerRef.current); 
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/productos`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setProductosDB(Array.isArray(data) ? data : []))
      .catch(() => setProductosDB([]));
  }, [API_BASE]);

  useEffect(() => {
    apiGet('/api/comentarios/aprobados')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapeados = data.map(c => ({ name: c.nombre || 'Anónimo', text: c.contenido }));
          setComments(mapeados);
        }
      })
      .catch(() => {});
  }, []);

  const productosDestacados = productosDB.length > 0
    ? productosDB.slice(0, 6).map(p => ({
        img: resolverImagenProducto(p.imagenUrl, torta),
        label: p.nombre,
        id: p.id,
      }))
    : homeProducts;
  
  const goToSlide = i => { 
    setCurrentSlide(i); 
    startSlider(); 
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setEnviandoComentario(true);
    setMensajeComentario("");
    try {
      await apiPost('/api/comentarios', {
        usuarioId: getUsuarioId(),
        contenido: commentText.trim(),
        nombre: commentName.trim(),
      });
      setMensajeComentario("¡Gracias! Tu comentario fue enviado y se publicará cuando el administrador lo apruebe.");
      setCommentName("");
      setCommentText("");
    } catch (err) {
      setMensajeComentario("No se pudo enviar tu comentario. Intenta de nuevo.");
    } finally {
      setEnviandoComentario(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFEFEF', fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* 1. LOGO SUPERIOR CENTRADO UNIVERSAL */}
      <section style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '20px' }}>
        <img src={logoPrincipal} alt="Logo Sweet Cream Rose" style={{ width: '230px', objectFit: 'contain', marginBottom: '15px' }} />
        <h1 style={{ color: '#5A3E41', margin: '10 0 5px 30', fontFamily: 'Poppins-Bold', fontSize: '30px', letterSpacing: '2px' }}>INICIO</h1>
        <img src={dividerTitle} alt="divisor" style={{ width: '180px', height: 'auto', display: 'block', margin: '0 auto 10px auto' }} />
      </section>

      {/* SECCIÓN HERO (BANNER PRINCIPAL) */}
      <section style={{ textAlign: 'center', padding: '0 20px' }}>
        <div style={{ position: 'relative', maxWidth: '850px', margin: '0 auto', overflow: 'hidden' }}>
          {slides.map((slide, i) => (
            <div key={i} style={{ display: currentSlide === i ? 'flex' : 'none', height: '300px' }}>
              <div style={{ flex: '1' }}>
                <img src={slide.img} alt="Torta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: '1', backgroundColor: '#FCAEBA', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 40px', textAlign: 'left' }}>
                <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '38px', color: '#000', margin: '0 0 10px 0', lineHeight: '1.1', whiteSpace: 'pre-line' }}>{slide.title}</h2>
                <p style={{ fontFamily: 'Poppins-Medium', fontSize: '15px', color: '#000', margin: '0 0 20px 0', lineHeight: '1.4' }}>{slide.text}</p>
                <button onClick={() => setPage('productos')} style={{ backgroundColor: 'white', color: '#000', border: 'none', padding: '6px 20px', fontFamily: 'Poppins-SemiBold', fontSize: '14px', cursor: 'pointer' }}>
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
          {slides.map((_, i) => (
            <span key={i} onClick={() => goToSlide(i)} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: currentSlide === i ? '#C6676D' : '#EAAFB8', cursor: 'pointer' }} />
          ))}
        </div>
      </section>

      {/* SECCIÓN LO MÁS COMPRADO */}
      <section style={{ maxWidth: '900px', margin: '40px auto 0' }}>
        <h2 style={{ fontFamily: 'Poppins-SemiBold', fontSize: '26px', textAlign: 'center', color: '#5A3E41', marginBottom: '30px' }}>LO MÁS COMPRADO</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {productosDestacados.map((p, i) => (
            <div key={p.id ?? i} onClick={() => setPage("productos")} style={{ position: 'relative', height: '280px', cursor: 'pointer', overflow: 'hidden' }}>
              <img src={p.img} alt={p.label} onError={(e) => onImgErrorFallback(e, torta)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '0', width: '100%', backgroundColor: 'rgba(231, 199, 200, 0.8)', padding: '20px 0', textAlign: 'center' }}>
                <span style={{ fontFamily: 'Poppins-SemiBold', fontSize: '14px', color: '#5A3E41' }}>{p.label}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => setPage("productos")} style={{ backgroundColor: '#FACFD8', color: '#5A3E41', border: 'none', padding: '8px 40px', fontFamily: 'Poppins-SemiBold', fontSize: '15px', cursor: 'pointer' }}>
            Ver más
          </button>
        </div>
      </section>

      {/* SECCIÓN FESTIVIDADES */}
      <section style={{ maxWidth: '900px', margin: '60px auto 0' }}>
        <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '26px', textAlign: 'center', color: '#5A3E41', marginBottom: '30px' }}>Promociones de Festividad</h2>
        
        {/* BANNER NAVIDAD */}
        <div style={{ display: 'flex', height: '310px', marginBottom: '20px', backgroundColor: '#B26459' }}>
          <div style={{ flex: '1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '36px', color: '#5F2222', margin: '0 0 15px 0', lineHeight: '1.1' }}>
              POSTRES para<br/>acompañar<br/>esta NAVIDAD
            </h3>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: 'white', margin: '0 0 25px 0', maxWidth: '300px', lineHeight: '1.5' }}>
              Mira los mejores postres para esta navidad y pasar tiempo en familia inolvidable.
            </p>
            <button onClick={() => setPage("ofertas")} style={{ backgroundColor: 'white', color: '#000', border: 'none', padding: '8px 30px', fontFamily: 'Poppins-Bold', fontSize: '14px', cursor: 'pointer' }}>
              Ver más
            </button>
          </div>
          <div style={{ flex: '1.2' }}>
            <img src={navidad} alt="Navidad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* BANNER HALLOWEEN */}
        <div style={{ display: 'flex', height: '310px', backgroundColor: '#DD7C32' }}>
          <div style={{ flex: '1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '36px', color: '#5F2222', margin: '0 0 15px 0', lineHeight: '1.1' }}>
              POSTRES para<br/>disfrutar en<br/>HALLOWEEN
            </h3>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: 'white', margin: '0 0 25px 0', maxWidth: '300px', lineHeight: '1.5' }}>
              Descubre nuestros deliciosos postres para Halloween y organiza una fiesta espeluznante.
            </p>
            <button onClick={() => setPage("ofertas")} style={{ backgroundColor: 'white', color: '#000', border: 'none', padding: '8px 30px', fontFamily: 'Poppins-Bold', fontSize: '14px', cursor: 'pointer' }}>
              Ver más
            </button>
          </div>
          <div style={{ flex: '1.2' }}>
            <img src={halloween} alt="Halloween" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => setPage("ofertas")} style={{ backgroundColor: '#FACFD8', color: '#5A3E41', border: 'none', padding: '8px 40px', fontFamily: 'Poppins-SemiBold', fontSize: '15px', cursor: 'pointer' }}>
            Ver más
          </button>
        </div>
      </section>

      {/* SECCIÓN COMENTARIOS */}
      <section style={{ maxWidth: '850px', margin: '60px auto 0' }}>
        <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '26px', textAlign: 'center', color: '#5A3E41', marginBottom: '40px' }}>Deja tu comentario</h2>
        
        <form onSubmit={handleComment} style={{ maxWidth: '700px', margin: '0 auto 50px auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* FILA 1: NOMBRE e Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <label style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#5A3E41', width: '80px', textAlign: 'left' }}>
              NOMBRE
            </label>
            <input 
              type="text" 
              value={commentName} 
              onChange={e => setCommentName(e.target.value)} 
              placeholder="Escribe tu nombre completo" 
              style={{ width: '300px', backgroundColor: '#FBD0D9', border: 'none', padding: '12px 15px', fontFamily: 'Poppins-Medium', fontSize: '14px', outline: 'none', color: '#5A3E41' }} 
            />
          </div>

          {/* FILA 2: Textarea */}
          <textarea 
            value={commentText} 
            onChange={e => setCommentText(e.target.value)} 
            rows={4} 
            placeholder="Deja un comentario" 
            style={{ width: '100%', backgroundColor: '#FBD0D9', border: 'none', padding: '15px', fontFamily: 'Poppins-Medium', fontSize: '14px', outline: 'none', resize: 'vertical', color: '#5A3E41' }} 
          />

          {/* FILA 3: Botón */}
          <div style={{ textAlign: 'right' }}>
            <button type="submit" disabled={enviandoComentario} style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '10px 40px', fontFamily: 'Poppins-SemiBold', fontSize: '14px', cursor: 'pointer' }}>
              {enviandoComentario ? 'ENVIANDO...' : 'COMENTAR'}
            </button>
            {mensajeComentario && (
              <p style={{ marginTop: '10px', fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41' }}>
                {mensajeComentario}
              </p>
            )}
          </div>
        </form>

        {/* TARJETAS DE TESTIMONIOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', maxWidth: '850px', margin: '0 auto' }}>
          {comments.slice(0,3).map((t,i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ backgroundColor: '#C6676D', padding: '12px', textAlign: 'center', color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: '15px' }}>
                {t.name}
              </div>
              <div style={{ backgroundColor: '#FBD0D9', padding: '32px 20px', textAlign: 'center', color: '#5A3E41', fontFamily: 'Poppins-Medium', fontSize: '14px', flexGrow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.text}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Inicio;