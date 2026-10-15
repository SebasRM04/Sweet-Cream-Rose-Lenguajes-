import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import cupcakeImg from '../../assets/cupcake_grafico.png';
import candadoImg from '../../assets/candadorosa.png';
import mensajeImg from '../../assets/mensajeGris.png';

function RecuperarSolicitar() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleEnviar = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }

    setCargando(true);
    try {
      // FIX: el endpoint correcto es /api/auth/olvide-contrasena (no /api/auth/olvide-contrasena)
      const res = await fetch('http://localhost:8081/api/auth/olvide-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      });

      // FIX: el backend SIEMPRE responde 200 OK por seguridad (no revela si el correo existe)
      // Por eso siempre avanzamos al paso 2 si la respuesta fue ok
      if (res.ok) {
        sessionStorage.setItem('correo_recuperacion', correo);
        navigate('/cambiar-password-2');
      } else {
        const data = await res.json();
        setError(data.error || 'Ocurrió un error. Intenta de nuevo.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">

        {/* ── Panel rosado izquierdo ── */}
        <div className="panel-left">
          <h2 className="welcome-title">
            Bienvenido a<br />
            <span>Sweet Cream Rose</span>
          </h2>
        
          <div className="panel-middle">
            <img 
              src={cupcakeImg} 
              alt="Postre" 
              className="food-img"
            />
            <p className="welcome-desc">
              Donde Más que una torta, creamos momentos dulces que acompañan
              tus mejores celebraciones, con sabor, dedicación y un toque de
              felicidad en cada porción.
            </p>
          </div>
        
          <button className="btn-outline btn-outline-cambiar" onClick={() => navigate('/registro')}>
          Regístrase
        </button>
        </div>

        {/* ── Panel blanco derecho ── */}
        <div className="panel-right">
          <div className="form-content">

            {/* Volver */}
            <button className="back-link" onClick={() => navigate('/login')}>
              ← Volver
            </button>

            {/* Ícono candado */}
            <img src={candadoImg} alt="Candado" className="recover-icon-img" />

            <h2 className="form-title">Recuperar Contraseña</h2>

            <p className="hint-text">
              ¿Olvidaste tu contraseña?<br />
              Ingresa el correo asociado a tu cuenta.<br />
              Te enviaremos un enlace de recuperación.
            </p>

            {error && <div className="error-msg">{error}</div>}

            <label className="input-label">Correo electrónico</label>

            {/* Input con ícono de mensaje */}
            <div className="input-icon-wrap">
              <img src={mensajeImg} alt="correo" className="input-icon-img" />
              <input
                className="auth-input with-icon"
                type="email"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEnviar(e)}
              />
            </div>

            <button
              className="btn-main"
              onClick={handleEnviar}
              disabled={cargando}
            >
              {cargando ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>

            <p className="hint-text" style={{ marginTop: '1.5rem' }}>
              ¿Recordaste tu contraseña?
            </p>
            <button className="link-btn" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default RecuperarSolicitar;