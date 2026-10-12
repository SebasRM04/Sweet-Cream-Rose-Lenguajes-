import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // FIX: el backend espera "contrasena", no "password"
        body: JSON.stringify({ correo, contrasena: password }),
      });

      const data = await res.json();

      if (res.ok) {
        // FIX: el backend devuelve { token: "..." }, guardar el JWT correctamente
        sessionStorage.setItem('token', data.token);
        // Decodificar el payload del JWT para saber nombre/rol sin llamada extra
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          sessionStorage.setItem('correo', payload.sub || correo);
          sessionStorage.setItem('rol', payload.rol || '');
        } catch (_) { /* si el decode falla, no es crítico */ }
        navigate('/');
      } else {
        setError(data.error || 'Correo o contraseña incorrectos.');
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

        {/* Panel rosado izquierdo */}
        <div className="panel-left">
          <button className="close-btn close-rosado" onClick={() => navigate('/')}>✕</button>
          <div className="panel-top">
            <h2 className="welcome-title">
              Bienvenido a<br />
              <span>Rosa Cream Sweet</span>
            </h2>
            <p className="welcome-desc">
              Donde Más que una torta, creamos momentos dulces que acompañan
              tus mejores celebraciones, con sabor, dedicación y un toque de
              felicidad en cada porción.
            </p>
          </div>
          <img src="/imagenes/cupcake_sanvalentin.jpg" alt="Postre" className="food-img"
               onError={e => e.target.style.display = 'none'} />
          <button className="btn-outline" onClick={() => navigate('/registro')}>
            Regístrase
          </button>
        </div>

        {/* Panel blanco derecho */}
        <div className="panel-right">
          <button className="close-btn close-blanco" onClick={() => navigate('/')}>✕</button>
          <div className="form-content">
            <h2 className="form-title">Iniciar Sesión</h2>

            <div className="social-row">
              <span className="social-icon"><i className="fab fa-facebook-f"></i></span>
              <span className="social-icon"><i className="fab fa-google"></i></span>
              <span className="social-icon"><i className="fab fa-linkedin-in"></i></span>
            </div>
            <p className="hint-text">Inicia Sesion con tu gmail y contraseña</p>

            {error && <div className="error-msg">{error}</div>}

            <input className="auth-input" type="email" placeholder="Gmail"
                   value={correo} onChange={e => setCorreo(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleLogin(e)} />

            <input className="auth-input" type="password" placeholder="Contraseña"
                   value={password} onChange={e => setPassword(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleLogin(e)} />

            <p className="forgot-link" onClick={() => navigate('/cambiar-password-1')}> ¿Olvidaste tu contraseña?</p>

            <button className="btn-main" onClick={handleLogin} disabled={cargando}>
              {cargando ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;