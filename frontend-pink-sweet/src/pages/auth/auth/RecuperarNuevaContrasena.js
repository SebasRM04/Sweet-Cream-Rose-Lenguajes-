import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
import cupcakeImg from '../../assets/cupcake_grafico.png';
import candadoRosa2Img from '../../assets/candadoRosa_2.png';
import candadoGrisImg from '../../assets/candadoGris.png';
import ojoGrisImg from '../../assets/ojoGris.png';

/**
 * CambiarPassword3 — Formulario para crear la nueva contraseña.
 *
 * FIX: El backend usa el endpoint /api/auth/restablecer-contrasena
 * y espera { token, nuevaContrasena }.
 * El token llega por la URL como query param: ?token=XXX
 */
function RecuperarNuevaContrasena() {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verPass, setVerPass] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // FIX: leer el token JWT de recuperación desde la URL (?token=XXX)
  // Si viene desde el enlace del correo, el token estará en los query params.
  // También se guarda en sessionStorage como fallback para el flujo de desarrollo.
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenUrl = params.get('token');
    if (tokenUrl) {
      setToken(tokenUrl);
      sessionStorage.setItem('reset_token', tokenUrl);
    } else {
      // Fallback: intentar desde sessionStorage (para pruebas)
      const tokenGuardado = sessionStorage.getItem('reset_token');
      if (tokenGuardado) setToken(tokenGuardado);
      else setError('Enlace de recuperación inválido o expirado. Solicita uno nuevo.');
    }
  }, [location.search]);

  // ── Validaciones en tiempo real ──
  const tiene8 = password.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);
  const passwordsCoinciden = confirmar.length > 0 && password === confirmar;

  const handleActualizar = async () => {
    setError('');
    if (!tiene8 || !tieneMayuscula || !tieneNumero) {
      setError('La contraseña no cumple los requisitos.');
      return;
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!token) {
      setError('Enlace de recuperación inválido. Solicita uno nuevo.');
      return;
    }
    setCargando(true);
    try {
      // FIX: endpoint correcto /api/auth/restablecer-contrasena
      // FIX: campo correcto "nuevaContrasena" (no "password" ni "nueva")
      const res = await fetch('http://localhost:8081/api/auth/restablecer-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaContrasena: password }),
      });
      if (res.ok) {
        sessionStorage.removeItem('reset_token');
        sessionStorage.removeItem('correo_recuperacion');
        navigate('/cambiar-password-4');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar la contraseña. El enlace puede haber expirado.');
      }
    } catch {
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
            <img src={cupcakeImg} alt="Postre" className="food-img" />
            <p className="welcome-desc">
              Donde Más que una torta, creamos momentos dulces que acompañan
              tus mejores celebraciones, con sabor, dedicación y un toque de
              felicidad en cada porción.
            </p>
          </div>
          <button className="btn-outline" onClick={() => navigate('/registro')}>
            Regístrase
          </button>
        </div>

        {/* ── Panel blanco derecho ── */}
        <div className="panel-right">
          <div className="form-content">

            <button className="back-link" onClick={() => navigate('/cambiar-password-2')}>
              ← Volver
            </button>

            <img src={candadoRosa2Img} alt="Candado" className="recover-icon-img" />

            <h2 className="form-title">Crear nueva contraseña</h2>

            <p className="hint-text" style={{ color: '#888' }}>
              Ingresa tu nueva contraseña para acceder a tu cuenta.
            </p>

            {error && <div className="error-msg">{error}</div>}

            {/* Nueva contraseña */}
            <label className="input-label">Nueva contraseña</label>
            <div className="input-icon-wrap">
              <img src={candadoGrisImg} alt="candado" className="input-icon-img"
                style={{ width: '55px', height: '55px', top: '45%', transform: 'translateY(-50%)' }} />
              <input
                className="auth-input with-icon with-icon-right"
                type={verPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ height: '55px', paddingLeft: '4rem', paddingRight: '4rem' }}
              />
              <img src={ojoGrisImg} alt="ver" className="input-icon-right"
                style={{ width: '75px', height: '75px', top: '45%', transform: 'translateY(-50%)' }}
                onClick={() => setVerPass(!verPass)} />
            </div>

            {/* Confirmar contraseña */}
            <label className="input-label">Confirmar contraseña</label>
            <div className="input-icon-wrap">
              <img src={candadoGrisImg} alt="candado" className="input-icon-img"
                style={{ width: '55px', height: '55px', top: '45%', transform: 'translateY(-50%)' }} />
              <input
                className={`auth-input with-icon with-icon-right ${
                  confirmar.length > 0 ? (passwordsCoinciden ? 'input-ok' : 'input-error') : ''
                }`}
                type={verConfirmar ? 'text' : 'password'}
                placeholder="••••••••••"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                style={{ height: '55px', paddingLeft: '4.5rem', paddingRight: '4rem' }}
              />
              <img src={ojoGrisImg} alt="ver" className="input-icon-right"
                style={{ width: '75px', height: '75px', top: '45%', transform: 'translateY(-50%)' }}
                onClick={() => setVerConfirmar(!verConfirmar)} />
            </div>

            {/* Caja de validaciones */}
            <div className="validaciones-box">
              <p className="validaciones-titulo">Tu contraseña debe contener:</p>
              <div className={`validacion-item ${tiene8 ? 'ok' : ''}`}>
                <span className="validacion-check">{tiene8 ? '✅' : '⬜'}</span>
                Mínimo 8 caracteres
              </div>
              <div className={`validacion-item ${tieneMayuscula ? 'ok' : ''}`}>
                <span className="validacion-check">{tieneMayuscula ? '✅' : '⬜'}</span>
                Al menos una mayúscula
              </div>
              <div className={`validacion-item ${tieneNumero ? 'ok' : ''}`}>
                <span className="validacion-check">{tieneNumero ? '✅' : '⬜'}</span>
                Al menos un número
              </div>
            </div>

            <button
              className="btn-main"
              onClick={handleActualizar}
              disabled={cargando || !token}
            >
              {cargando ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default RecuperarNuevaContrasena;