import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import cupcakeImg from '../../assets/cupcake_grafico.png';
import mensajeRosaImg from '../../assets/mensajeRosa.png';

/**
 * CambiarPassword2 — Pantalla de confirmación de envío de enlace.
 *
 * NOTA TÉCNICA: El backend (AuthController) usa el flujo de TOKEN JWT de
 * recuperación, NO códigos de 6 dígitos. El enlace que llega al correo
 * contiene el token y redirige a /cambiar-password-3?token=XXX.
 *
 * Esta pantalla informa al usuario que revise su correo y permite reenviar.
 */
function RecuperarRevisarCorreo() {
  const navigate = useNavigate();
  const [segundos, setSegundos] = useState(48);
  const [reenviando, setReenviando] = useState(false);
  const [mensajeReenvio, setMensajeReenvio] = useState('');

  const correo = sessionStorage.getItem('correo_recuperacion') || 'tu correo';

  // ── Temporizador regresivo ──
  useEffect(() => {
    if (segundos <= 0) return;
    const timer = setInterval(() => {
      setSegundos(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [segundos]);

  const formatTiempo = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const seg = (s % 60).toString().padStart(2, '0');
    return `(${m}:${seg})`;
  };

  // ── Reenviar enlace ──
  const handleReenviar = async () => {
    if (segundos > 0) return;
    setReenviando(true);
    setMensajeReenvio('');
    try {
      // FIX: endpoint correcto del backend
      await fetch('http://localhost:8081/api/auth/olvide-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      });
      setSegundos(48);
      setMensajeReenvio('¡Enlace reenviado! Revisa tu bandeja de entrada.');
    } catch {
      setMensajeReenvio('No se pudo reenviar. Intenta de nuevo.');
    } finally {
      setReenviando(false);
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

            <button className="back-link" onClick={() => navigate('/cambiar-password-1')}>
              ← Volver
            </button>

            <img src={mensajeRosaImg} alt="Mensaje" className="recover-icon-img" />

            <h2 className="form-title">Revisa tu correo</h2>

            <p className="hint-text" style={{ color: '#888' }}>
              Hemos enviado un enlace de recuperación a<br />
              <span style={{ color: '#b86b6b', fontWeight: '600' }}>{correo}</span>
            </p>
            <p className="hint-text" style={{ color: '#888' }}>
              Haz clic en el enlace del correo para crear<br />
              tu nueva contraseña.
            </p>

            {mensajeReenvio && (
              <div className="error-msg" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                {mensajeReenvio}
              </div>
            )}

            {/* Reenviar enlace + temporizador */}
            <p className="hint-text" style={{ color: '#888', marginTop: '12px' }}>
              ¿No recibiste el correo?
            </p>
            <div className="reenviar-row">
              <button
                className="link-btn"
                onClick={handleReenviar}
                disabled={segundos > 0 || reenviando}
                style={{ opacity: segundos > 0 ? 0.5 : 1 }}
              >
                {reenviando ? 'Reenviando...' : 'Reenviar enlace'}
              </button>
              {segundos > 0 && (
                <span className="timer-text">{formatTiempo(segundos)}</span>
              )}
            </div>

            <button
              className="btn-main"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/login')}
            >
              Volver al inicio de sesión
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default RecuperarRevisarCorreo;