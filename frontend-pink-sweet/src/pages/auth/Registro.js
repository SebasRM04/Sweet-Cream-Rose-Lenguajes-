import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Las contraseñas coinciden solo si ambos campos tienen algo y son iguales
  const passwordsCoinciden = confirmar.length > 0 && password === confirmar;
  const passwordsNoCoinciden = confirmar.length > 0 && password !== confirmar;

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !apellido || !correo || !password || !confirmar) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Validar que el apellido empiece con mayúscula
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(apellido.trim())) {
      setError('El apellido debe comenzar con mayúscula.');
      return;
    }

    // Validar que el nombre empiece con mayúscula
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(nombre.trim())) {
      setError('El nombre debe comenzar con mayúscula.');
      return;
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch('http://localhost:8081/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          correo,
          contrasena: password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Error al registrarse. Intenta de nuevo.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card auth-card-reversed">

        {/* Panel blanco izquierdo (formulario) */}
        <div className="panel-right">
          <button className="close-btn close-blanco" onClick={() => navigate('/')}>✕</button>
          <div className="form-content">
            <h2 className="form-title">Registrarse</h2>

            <div className="social-row">
              <span className="social-icon"><i className="fab fa-facebook-f"></i></span>
              <span className="social-icon"><i className="fab fa-google"></i></span>
              <span className="social-icon"><i className="fab fa-linkedin-in"></i></span>
            </div>
            <p className="hint-text">Regístrate con tu gmail y contraseña</p>

            {error && <div className="error-msg">{error}</div>}

            <input
              className="auth-input"
              type="text"
              placeholder="Nombre (ej: Oscar)"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />

            <input
              className="auth-input"
              type="text"
              placeholder="Apellido (ej: Rodriguez)"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
            />

            <input
              className="auth-input"
              type="email"
              placeholder="Gmail"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
            />

            <input
              className="auth-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <input
              className={`auth-input ${passwordsNoCoinciden ? 'input-error' : passwordsCoinciden ? 'input-ok' : ''}`}
              type="password"
              placeholder="Repetir contraseña"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
            />

            {/* Indicador visual en tiempo real */}
            {passwordsNoCoinciden && (
              <p className="pass-hint bad">✗ Las contraseñas no coinciden</p>
            )}
            {passwordsCoinciden && (
              <p className="pass-hint ok">✓ Las contraseñas coinciden</p>
            )}

            <button
              className="btn-main"
              onClick={handleRegistro}
              disabled={cargando || passwordsNoCoinciden}
            >
              {cargando ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </div>

        {/* Panel rosado derecho */}
        <div className="panel-left">
          <button className="close-btn close-rosado" onClick={() => navigate('/')}>✕</button>
          <div className="panel-top">
            <h2 className="welcome-title">
              Bienvenido a<br />
              <span>Sweet Cream Rose</span>
            </h2>
            <p className="welcome-desc">
              Más que una torta, creamos momentos dulces que acompañan
              tus mejores celebraciones, con sabor, dedicación y un toque de
              felicidad en cada porción.
            </p>
          </div>
          <img src="/imagenes/trufas_fresa.jpg" alt="Postre" className="food-img"
               onError={e => e.target.style.display = 'none'} />
          <button className="btn-outline" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </div>

      </div>
    </div>
  );
}

export default Registro;