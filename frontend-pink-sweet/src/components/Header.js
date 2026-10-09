import React, { useState, useEffect, useRef } from 'react';
import bannerPrincipal from '../assets/banner.png';
import iconUser from '../assets/icon-user.png';
import iconCart from '../assets/icon-cart.png';
import iconLupa from '../assets/icon-lupa.png';
import { API_BASE } from '../api';
import { resolverImagenProducto } from '../utils/imagenProducto';
 
// ─── ESTILOS INLINE DEL MODAL + DRAWER ─────────────────────────────────────
const modalCSS = `
  /* ── Overlay oscuro ── */
  .scr-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 9000;
    display: flex; align-items: center; justify-content: center;
    animation: scrFadeIn .18s ease;
  }
  @keyframes scrFadeIn { from { opacity:0 } to { opacity:1 } }
 
  /* ── Tarjeta auth ── */
  .scr-auth-card {
    display: flex;
    width: 100%; max-width: 860px;
    min-height: 560px;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.30);
    position: relative;
    animation: scrSlideUp .22s ease;
    margin: 16px;
  }
  @keyframes scrSlideUp { from { transform:translateY(30px); opacity:0 } to { transform:translateY(0); opacity:1 } }
 
  /* ── Panel rosado izquierdo ── */
  .scr-panel-left {
    background: linear-gradient(160deg, #C6676D 0%, #a83858 100%);
    flex: 0 0 42%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: space-between;
    padding: 36px 28px 28px;
    position: relative;
    color: #fff;
  }
  .scr-panel-right {
    background: #fff;
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 36px;
    position: relative;
  }
 
  /* ── Botón cerrar ── */
  .scr-close-btn {
    position: absolute; top: 14px; right: 14px;
    background: rgba(255,255,255,0.25); color: #fff;
    border: none; border-radius: 50%;
    width: 30px; height: 30px;
    font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s;
    z-index: 2;
  }
  .scr-close-btn:hover { background: rgba(255,255,255,0.45); }
  .scr-close-btn.dark {
    background: #f0e4e8; color: #7a3a3a;
  }
  .scr-close-btn.dark:hover { background: #e8d0d8; }
 
  /* ── Textos panel izquierdo ── */
  .scr-welcome-title {
    font-family: 'Georgia', serif;
    font-size: 1.7rem; font-weight: 400;
    color: #fff; text-align: center; line-height: 1.3;
    margin-bottom: 10px;
  }
  .scr-welcome-title span { font-size: 2rem; display: block; }
  .scr-welcome-desc {
    font-size: 0.82rem; color: rgba(255,255,255,0.88);
    text-align: center; line-height: 1.5; margin-bottom: 12px;
  }
  .scr-food-img {
    width: 70%; max-height: 180px;
    object-fit: contain;
    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
    margin: 10px 0;
  }
  .scr-btn-outline-white {
    background: transparent; color: #fff;
    border: 2px solid rgba(255,255,255,0.7);
    padding: 9px 28px; border-radius: 4px;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 13px; letter-spacing: 1px;
    cursor: pointer; transition: background .2s;
    margin-top: 8px;
  }
  .scr-btn-outline-white:hover { background: rgba(255,255,255,0.2); }
 
  /* ── Formulario derecho ── */
  .scr-form-wrap { width: 100%; max-width: 320px; }
  .scr-form-title {
    font-family: 'Georgia', serif;
    font-size: 1.65rem; font-weight: 400;
    color: #58413B; text-align: center;
    margin-bottom: 16px;
  }
  .scr-hint { font-size: 0.82rem; color: #999; text-align: center; margin-bottom: 14px; }
  .scr-input {
    width: 100%; padding: 10px 14px;
    border: 1.5px solid #e0c8cc; border-radius: 7px;
    font-size: 0.92rem; font-family: 'Lato', sans-serif;
    color: #4a3030; outline: none; margin-bottom: 10px;
    transition: border-color .2s;
    box-sizing: border-box;
  }
  .scr-input:focus { border-color: #c8506a; }
  .scr-input.ok { border-color: #4caf50; }
  .scr-input.err { border-color: #e53935; }
  .scr-error {
    background: #ffeaea; color: #c0392b;
    border-radius: 6px; padding: 8px 12px;
    font-size: 0.83rem; margin-bottom: 10px;
    text-align: center;
  }
  .scr-btn-main {
    width: 100%; padding: 11px;
    background: #c8506a; color: #fff;
    border: none; border-radius: 6px;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 14px; letter-spacing: 1px;
    cursor: pointer; transition: background .2s;
    margin-top: 4px;
  }
  .scr-btn-main:hover:not(:disabled) { background: #a83858; }
  .scr-btn-main:disabled { opacity: 0.6; cursor: not-allowed; }
  .scr-forgot {
    font-size: 0.83rem; color: #b86b6b;
    cursor: pointer; text-align: right;
    margin-bottom: 10px;
    text-decoration: underline;
  }
  .scr-forgot:hover { color: #7a3a3a; }
  .scr-pass-hint { font-size: 0.82rem; margin: -6px 0 8px; }
  .scr-pass-hint.ok { color: #4caf50; }
  .scr-pass-hint.bad { color: #e53935; }
 
  /* ── Pantalla "Revisa tu correo" ── */
  .scr-recover-icon {
    font-size: 2.5rem; text-align: center; margin: 8px 0 14px;
  }
  .scr-back-link {
    background: none; border: none;
    color: #b86b6b; cursor: pointer;
    font-size: 0.88rem; padding: 0;
    margin-bottom: 16px; align-self: flex-start;
    text-decoration: underline;
  }
  .scr-back-link:hover { color: #7a3a3a; }
  .scr-timer { font-size: 0.82rem; color: #aaa; margin-left: 6px; }
  .scr-resend-row { display: flex; align-items: center; margin: 6px 0 14px; }
  .scr-link-btn {
    background: none; border: none;
    color: #b86b6b; cursor: pointer;
    font-size: 0.85rem; text-decoration: underline; padding: 0;
  }
  .scr-link-btn:hover { color: #7a3a3a; }
  .scr-link-btn:disabled { opacity: 0.4; cursor: not-allowed; }
 
  /* ── DRAWER CARRITO ── */
  .scr-cart-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 9000;
    animation: scrFadeIn .18s ease;
  }
  .scr-cart-drawer {
    position: fixed; top: 0; right: 0;
    width: 380px; max-width: 100vw;
    height: 100vh;
    background: #fff;
    box-shadow: -8px 0 40px rgba(0,0,0,0.18);
    z-index: 9001;
    display: flex; flex-direction: column;
    animation: scrSlideLeft .22s ease;
    overflow: hidden;
  }
  @keyframes scrSlideLeft {
    from { transform: translateX(60px); opacity:0 }
    to   { transform: translateX(0);    opacity:1 }
  }
  .scr-cart-header {
    background: #C6676D; color: #fff;
    padding: 20px 20px 14px;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .scr-cart-title { font-family: 'Georgia', serif; font-size: 1.25rem; margin: 0; }
  .scr-cart-close {
    background: rgba(255,255,255,0.25); border: none; color: #fff;
    border-radius: 50%; width: 30px; height: 30px;
    font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s;
  }
  .scr-cart-close:hover { background: rgba(255,255,255,0.45); }
  .scr-cart-body { flex: 1; overflow-y: auto; padding: 16px 18px; }
  .scr-cart-empty { text-align: center; color: #bbb; padding: 40px 0; font-size: 0.95rem; }
  .scr-cart-item {
    display: flex; gap: 12px; align-items: center;
    padding: 12px 0; border-bottom: 1px solid #f0dde0;
  }
  .scr-cart-item-img {
    width: 60px; height: 60px; object-fit: cover;
    border-radius: 8px; flex-shrink: 0;
    background: #fdf2f4;
  }
  .scr-cart-item-info { flex: 1; }
  .scr-cart-item-name { font-size: 0.88rem; color: #4a3030; font-weight: 600; margin-bottom: 2px; }
  .scr-cart-item-price { font-size: 0.82rem; color: #c8506a; font-weight: 700; }
  .scr-qty-row { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .scr-qty-btn {
    background: #fdf2f4; border: 1px solid #e0c8cc;
    color: #c8506a; width: 24px; height: 24px;
    border-radius: 4px; cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s;
  }
  .scr-qty-btn:hover { background: #f5e0e4; }
  .scr-qty-val { font-size: 0.88rem; min-width: 20px; text-align: center; }
  .scr-del-btn {
    background: none; border: none; color: #daa;
    cursor: pointer; font-size: 0.78rem;
    text-decoration: underline;
    transition: color .2s;
  }
  .scr-del-btn:hover { color: #c0392b; }
  .scr-cart-footer {
    padding: 16px 18px 20px;
    border-top: 2px solid #f0dde0;
    flex-shrink: 0;
    background: #fdf7f8;
  }
  .scr-cart-total-row {
    display: flex; justify-content: space-between;
    font-size: 0.95rem; color: #4a3030;
    margin-bottom: 6px;
  }
  .scr-cart-total-row.big { font-weight: 700; font-size: 1.05rem; color: #c8506a; }
  .scr-cart-pay-btn {
    width: 100%; padding: 12px;
    background: #c8506a; color: #fff;
    border: none; border-radius: 6px;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 14px; letter-spacing: 1px;
    cursor: pointer; transition: background .2s;
    margin-top: 12px;
  }
  .scr-cart-pay-btn:hover { background: #a83858; }
 
  /* Responsive */
  @media(max-width:600px) {
    .scr-auth-card { flex-direction: column; min-height: auto; }
    .scr-panel-left { flex: 0 0 auto; padding: 28px 20px 20px; }
    .scr-panel-right { padding: 28px 20px; }
    .scr-cart-drawer { width: 100vw; }
  }
`;
 
// ─── ÍTEM CARRITO (componente pequeño) ──────────────────────────────────────
function CartItem({ item, onQty, onDel }) {
  return (
    <div className="scr-cart-item">
      <img
        src={item.img}
        alt={item.nombre}
        className="scr-cart-item-img"
        onError={e => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect fill=%22%23fdf2f4%22 width=%2260%22 height=%2260%22/><text x=%2230%22 y=%2235%22 text-anchor=%22middle%22 font-size=%2220%22>🍰</text></svg>'; }}
      />
      <div className="scr-cart-item-info">
        <div className="scr-cart-item-name">{item.nombre}</div>
        <div className="scr-cart-item-price">
          {item.tieneOferta && item.precioConDescuento != null ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px', marginRight: '6px' }}>
                S/ {item.precio.toFixed(2)}
              </span>
              <span style={{ color: '#C3666D', fontWeight: 'bold' }}>
                S/ {item.precioConDescuento.toFixed(2)}
              </span>
              <span style={{ fontFamily: 'Poppins-Bold', fontSize: '10px', color: 'white', backgroundColor: '#7DCEA0', padding: '2px 7px', borderRadius: '20px', marginLeft: '6px' }}>
                Ahorras S/ {(item.precio - item.precioConDescuento).toFixed(2)}
              </span>
            </>
          ) : (
            <>S/ {item.precio.toFixed(2)}</>
          )}
        </div>
        <div className="scr-qty-row">
          <button className="scr-qty-btn" onClick={() => onQty(item.id, -1)}>−</button>
          <span className="scr-qty-val">{item.cantidad}</span>
          <button className="scr-qty-btn" onClick={() => onQty(item.id, +1)}>+</button>
          {/* ✅ CORRECCIÓN: Eliminar llama a onDel que borra del backend */}
          <button className="scr-del-btn" onClick={() => onDel(item.id)}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
 
// ─── MODAL DE AUTENTICACIÓN ──────────────────────────────────────────────────
function AuthModal({ onClose }) {
  const [pantalla, setPantalla] = useState('login');
 
  const [loginCorreo, setLoginCorreo] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
 
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regCorreo, setRegCorreo] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmar, setRegConfirmar] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const passOk = regConfirmar.length > 0 && regPass === regConfirmar;
  const passMal = regConfirmar.length > 0 && regPass !== regConfirmar;
 
  const [recCorreo, setRecCorreo] = useState('');
  const [recError, setRecError] = useState('');
  const [recLoading, setRecLoading] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [reenvioMsg, setReenvioMsg] = useState('');
  const correoGuardado = recCorreo || sessionStorage.getItem('correo_recuperacion') || '';
 
  useEffect(() => {
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);
 
  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sg = (s % 60).toString().padStart(2, '0');
    return `(${m}:${sg})`;
  };
 
  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoginError('');
    if (!loginCorreo || !loginPass) { setLoginError('Completa todos los campos.'); return; }
    setLoginLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: loginCorreo, contrasena: loginPass }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem('token', data.token);
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          sessionStorage.setItem('correo', payload.sub || loginCorreo);
          sessionStorage.setItem('rol', payload.rol || '');
          sessionStorage.setItem('nombre', payload.nombre || '');
        } catch (_) {}
        onClose(true);
      } else {
        setLoginError(data.error || 'Correo o contraseña incorrectos.');
      }
    } catch {
      setLoginError('No se pudo conectar al servidor.');
    } finally {
      setLoginLoading(false);
    }
  };
 
  const handleRegistro = async (e) => {
    e?.preventDefault();
    setRegError('');
    if (!regNombre || !regApellido || !regCorreo || !regPass || !regConfirmar) {
      setRegError('Completa todos los campos.');
      return;
    }
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(regNombre.trim())) {
      setRegError('El nombre debe comenzar con mayúscula.');
      return;
    }
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(regApellido.trim())) {
      setRegError('El apellido debe comenzar con mayúscula.');
      return;
    }
    if (regPass !== regConfirmar) { setRegError('Las contraseñas no coinciden.'); return; }
    setRegLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: regNombre.trim(),
          apellido: regApellido.trim(),
          correo: regCorreo,
          contrasena: regPass
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPantalla('login');
        setLoginError('¡Registro exitoso! Inicia sesión.');
      } else {
        setRegError(data.error || 'Error al registrarse. Intenta de nuevo.');
      }
    } catch {
      setRegError('No se pudo conectar al servidor.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleOlvide = async (e) => {
    e?.preventDefault();
    setRecError('');
    if (!recCorreo) { setRecError('Ingresa tu correo.'); return; }
    setRecLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/auth/olvide-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: recCorreo }),
      });
      if (res.ok) {
        sessionStorage.setItem('correo_recuperacion', recCorreo);
        setPantalla('enviado');
        setSegundos(60);
      } else {
        setRecError('No se encontró ese correo.');
      }
    } catch {
      setRecError('No se pudo conectar al servidor.');
    } finally {
      setRecLoading(false);
    }
  };

  const handleReenviar = async () => {
    setReenvioMsg('');
    try {
      await fetch('http://localhost:8081/api/auth/olvide-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correoGuardado }),
      });
      setReenvioMsg('¡Enlace reenviado!');
      setSegundos(60);
    } catch {
      setReenvioMsg('Error al reenviar.');
    }
  };
 
  const renderLeft = () => (
    <div className="scr-panel-left">
      <div>
        <h2 className="scr-welcome-title">
          <span>🍰</span>Sweet Cream Rose
        </h2>
        <p className="scr-welcome-desc">
          Repostería artesanal con amor, para cada momento especial.
        </p>
      </div>
      <img
        className="scr-food-img"
        src={bannerPrincipal}
        alt="Dulces"
        onError={e => { e.target.style.display = 'none'; }}
      />
      {pantalla === 'login' && (
        <button className="scr-btn-outline-white" onClick={() => setPantalla('registro')}>
          Regístrate
        </button>
      )}
      {(pantalla === 'registro') && (
        <button className="scr-btn-outline-white" onClick={() => setPantalla('login')}>
          Iniciar Sesión
        </button>
      )}
      {(pantalla === 'olvide' || pantalla === 'enviado') && (
        <button className="scr-btn-outline-white" onClick={() => setPantalla('registro')}>
          Regístrate
        </button>
      )}
    </div>
  );
 
  const renderRight = () => {
    if (pantalla === 'login') return (
      <div className="scr-panel-right">
        <button className="scr-close-btn dark" onClick={() => onClose(false)}>✕</button>

        {/* === EASTER EGG === */}
        <div 
          onClick={() => window.location.href = '/adminmenu'}
          style={{ position: 'absolute', bottom: '15px', right: '15px', cursor: 'pointer', color: '#E0C8CC', fontSize: '14px', fontWeight: 'bold' }}
          title="Acceso Administrativo"
        >
          ?
        </div>
        {/* ================== */}

        <div className="scr-form-wrap">
          <h2 className="scr-form-title">Iniciar Sesión</h2>
          <p className="scr-hint">Inicia sesión con tu correo y contraseña</p>
          {loginError && <div className="scr-error">{loginError}</div>}
          <input
            className="scr-input" type="email" placeholder="Correo electrónico"
            value={loginCorreo} onChange={e => setLoginCorreo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
          />
          <input
            className="scr-input" type="password" placeholder="Contraseña"
            value={loginPass} onChange={e => setLoginPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
          />
          <div className="scr-forgot" onClick={() => setPantalla('olvide')}>
            ¿Olvidaste tu contraseña?
          </div>
          <button className="scr-btn-main" onClick={handleLogin} disabled={loginLoading}>
            {loginLoading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    );
 
    if (pantalla === 'registro') return (
      <div className="scr-panel-right">
        <button className="scr-close-btn dark" onClick={() => onClose(false)}>✕</button>
        <div className="scr-form-wrap">
          <h2 className="scr-form-title">Registrarse</h2>
          <p className="scr-hint">Crea tu cuenta con tu correo</p>
          {regError && <div className="scr-error">{regError}</div>}
          <input
            className="scr-input" type="text" placeholder="Nombre (ej: Oscar)"
            value={regNombre} onChange={e => setRegNombre(e.target.value)}
          />
          <input
            className="scr-input" type="text" placeholder="Apellido (ej: Torres)"
            value={regApellido} onChange={e => setRegApellido(e.target.value)}
          />
          <input
            className="scr-input" type="email" placeholder="Correo electrónico"
            value={regCorreo} onChange={e => setRegCorreo(e.target.value)}
          />
          <input
            className="scr-input" type="password" placeholder="Contraseña"
            value={regPass} onChange={e => setRegPass(e.target.value)}
          />
          <input
            className={`scr-input ${passMal ? 'err' : passOk ? 'ok' : ''}`}
            type="password" placeholder="Repetir contraseña"
            value={regConfirmar} onChange={e => setRegConfirmar(e.target.value)}
          />
          {passMal && <p className="scr-pass-hint bad">✗ Las contraseñas no coinciden</p>}
          {passOk && <p className="scr-pass-hint ok">✓ Las contraseñas coinciden</p>}
          <button className="scr-btn-main" onClick={handleRegistro} disabled={regLoading || passMal}>
            {regLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </div>
    );
 
    if (pantalla === 'olvide') return (
      <div className="scr-panel-right">
        <button className="scr-close-btn dark" onClick={() => onClose(false)}>✕</button>
        <div className="scr-form-wrap" style={{ display: 'flex', flexDirection: 'column' }}>
          <button className="scr-back-link" onClick={() => setPantalla('login')}>← Volver</button>
          <div className="scr-recover-icon">🔒</div>
          <h2 className="scr-form-title">Recuperar Contraseña</h2>
          <p className="scr-hint">
            Ingresa el correo de tu cuenta y te enviaremos un enlace de recuperación.
          </p>
          {recError && <div className="scr-error">{recError}</div>}
          <input
            className="scr-input" type="email" placeholder="ejemplo@correo.com"
            value={recCorreo} onChange={e => setRecCorreo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleOlvide(e)}
          />
          <button className="scr-btn-main" onClick={handleOlvide} disabled={recLoading}>
            {recLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
          <p className="scr-hint" style={{ marginTop: 16 }}>
            ¿Recordaste tu contraseña?{' '}
            <span className="scr-link-btn" style={{ cursor: 'pointer' }} onClick={() => setPantalla('login')}>
              Iniciar Sesión
            </span>
          </p>
        </div>
      </div>
    );
 
    if (pantalla === 'enviado') return (
      <div className="scr-panel-right">
        <button className="scr-close-btn dark" onClick={() => onClose(false)}>✕</button>
        <div className="scr-form-wrap" style={{ display: 'flex', flexDirection: 'column' }}>
          <button className="scr-back-link" onClick={() => setPantalla('olvide')}>← Volver</button>
          <div className="scr-recover-icon">✉️</div>
          <h2 className="scr-form-title">Revisa tu correo</h2>
          <p className="scr-hint">
            Enviamos un enlace de recuperación a{' '}
            <strong style={{ color: '#b86b6b' }}>{correoGuardado}</strong>.
            Haz clic en el enlace para crear tu nueva contraseña.
          </p>
          {reenvioMsg && (
            <div className="scr-error" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
              {reenvioMsg}
            </div>
          )}
          <p className="scr-hint">¿No recibiste el correo?</p>
          <div className="scr-resend-row">
            <button
              className="scr-link-btn"
              onClick={handleReenviar}
              disabled={segundos > 0}
            >
              Reenviar enlace
            </button>
            {segundos > 0 && <span className="scr-timer">{fmt(segundos)}</span>}
          </div>
          <button className="scr-btn-main" onClick={() => setPantalla('login')}>
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  };
 
  return (
    <div
      className="scr-overlay"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(false); }}
    >
      <div className="scr-auth-card">
        {pantalla === 'registro'
          ? <>{renderRight()}{renderLeft()}</>
          : <>{renderLeft()}{renderRight()}</>
        }
      </div>
    </div>
  );
}
 
// ─── DRAWER CARRITO ──────────────────────────────────────────────────────────
const API_BASE_CART = process.env.REACT_APP_API_URL || 'http://localhost:8081';
 
// ✅ CORRECCIÓN: CartDrawer ahora recibe setPage para navegar al pago
function CartDrawer({ onClose, setPage }) {
  const [items, setItems] = useState([]);
 
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    fetch(`${API_BASE_CART}/api/carrito`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        const mapeados = (Array.isArray(data) ? data : []).map(ci => ({
          id:                 ci.producto?.id,
          img:                ci.producto?.imagenUrl
                                ? `${API_BASE_CART}${ci.producto.imagenUrl}`
                                : '/assets/products/logo.png',
          nombre:             ci.producto?.nombre || 'Producto',
          precio:             Number(ci.producto?.precio || 0),
          tieneOferta:        ci.tieneOferta || false,
          precioConDescuento: ci.precioConDescuento != null ? Number(ci.precioConDescuento) : null,
          cantidad:           ci.cantidad || 1,
        }));
        setItems(mapeados);
      })
      .catch(() => {});
  }, []);
 
  const onQty = (id, delta) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const nueva = it.cantidad + delta;
      return nueva < 1 ? it : { ...it, cantidad: nueva };
    }));
  };

  // ✅ CORRECCIÓN: onDel ahora llama al backend para eliminar el ítem
  // y actualiza el badge del carrito. El ítem desaparece del drawer
  // y si se vuelve a abrir el carrito tampoco aparece (porque ya no está en BD).
  const onDel = (id) => {
    const token = sessionStorage.getItem('token');
    // Eliminar del estado local inmediatamente (UX rápido)
    setItems(prev => {
      const nuevos = prev.filter(it => it.id !== id);
      // Actualizar badge
      const totalItems = nuevos.reduce((acc, it) => acc + it.cantidad, 0);
      sessionStorage.setItem('cartCount', String(totalItems));
      window.dispatchEvent(new Event('cartUpdated'));
      return nuevos;
    });
    // Eliminar del backend
    if (token) {
      fetch(`${API_BASE_CART}/api/carrito/eliminar/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };
 
  const getPrecioEfectivo = (it) => (it.tieneOferta && it.precioConDescuento != null) ? it.precioConDescuento : it.precio;
  const subtotal = items.reduce((acc, it) => acc + getPrecioEfectivo(it) * it.cantidad, 0);
  // El envío ya no se precarga aquí, se elige recién en la página Carrito.js (botón "Elegir opciones de envío"), así que el mini-carrito solo muestra el subtotal como referencia rápida

  // ✅ CORRECCIÓN: Ir a pagar cierra el drawer y navega a la página Carrito
  const handleIrAPagar = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para pagar.');
      onClose();
      return;
    }
    onClose();
    if (setPage) setPage('carrito');
  };
 
  return (
    <>
      <div
        className="scr-cart-overlay"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      />
      <div className="scr-cart-drawer">
        <div className="scr-cart-header">
          <h3 className="scr-cart-title">🛒 Mi Carrito</h3>
          <button className="scr-cart-close" onClick={onClose}>✕</button>
        </div>
        <div className="scr-cart-body">
          {items.length === 0
            ? <p className="scr-cart-empty">Tu carrito está vacío 🍰</p>
            : items.map(it => (
                <CartItem key={it.id} item={it} onQty={onQty} onDel={onDel} />
              ))
          }
        </div>
        {items.length > 0 && (
          <div className="scr-cart-footer">
            <div className="scr-cart-total-row big">
              <span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#8A7A7C', margin: '2px 0 8px 0' }}>
              Envío e IGV se calculan en el siguiente paso.
            </p>
            {/* ✅ CORRECCIÓN: botón ahora navega a la sección de pago */}
            <button className="scr-cart-pay-btn" onClick={handleIrAPagar}>
              IR A PAGAR →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
 
// ─── HEADER PRINCIPAL ────────────────────────────────────────────────────────
const Header = ({ page, setPage }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem('correo') || null);
 
  const handleAuthClose = (loggedIn) => {
    setShowAuth(false);
    if (loggedIn) {
      setUsuario(sessionStorage.getItem('correo') || 'Usuario');
      setPage('perfil');
    }
  };
 
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('correo');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('cartCount');
    setUsuario(null);
    setCartCount(0);
  };
 
  const estiloBoton = (ruta) => ({
    border: 'none',
    padding: '8px 20px',
    backgroundColor: page === ruta ? '#FFEFEF' : '#EAAFB8',
    color: '#5A3E41',
    fontFamily: 'Poppins-SemiBold',
    fontSize: '14px',
    cursor: 'pointer',
  });
 
  const [cartCount, setCartCount] = useState(() => {
    if (!sessionStorage.getItem('token')) return 0;
    const saved = sessionStorage.getItem('cartCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSug, setMostrarSug] = useState(false);
  const searchBoxRef = useRef(null);
  const searchTimer = useRef(null);

  const irABusqueda = (texto) => {
    const q = (texto ?? busqueda).trim();
    sessionStorage.setItem('busquedaProductos', q);
    window.dispatchEvent(new Event('busquedaProductos'));
    setMostrarSug(false);
    if (setPage) setPage('productos');
  };

  const onChangeBusqueda = (e) => {
    const v = e.target.value;
    setBusqueda(v);
    clearTimeout(searchTimer.current);
    if (!v.trim()) {
      setSugerencias([]);
      setMostrarSug(false);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/productos/buscar?q=${encodeURIComponent(v.trim())}`);
        const data = res.ok ? await res.json() : [];
        setSugerencias(Array.isArray(data) ? data.slice(0, 6) : []);
        setMostrarSug(true);
      } catch {
        setSugerencias([]);
      }
    }, 250);
  };

  useEffect(() => {
    const onClick = (ev) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(ev.target)) {
        setMostrarSug(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // SUBTÍTULO ROTATIVO
  const frasesSubtitulo = [
    "Repostería artesanal",
    "Hecho con mucho amor",
    "Endulzando tus momentos",
    "Calidad en cada bocado",
    "El capricho que mereces"
  ];
  const [fraseIdx, setFraseIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFade(false); // Inicia el desvanecimiento (fade-out)
      setTimeout(() => {
        setFraseIdx((prev) => (prev + 1) % frasesSubtitulo.length);
        setFade(true); // Vuelve a aparecer (fade-in) con el nuevo texto
      }, 500); // 500ms es la duración de la transición
    }, 8000); // Cambia de frase cada 8 segundos

    return () => clearInterval(intervalo);
  }, []);
 
  useEffect(() => {
    const onUpdate = () => {
      const token = sessionStorage.getItem('token');
      if (!token) { setCartCount(0); return; }
      fetch((process.env.REACT_APP_API_URL || 'http://localhost:8081') + '/api/carrito', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : [])
        .then(data => {
          const n = Array.isArray(data) ? data.reduce((a, ci) => a + (ci.cantidad || 1), 0) : 0;
          setCartCount(n);
          sessionStorage.setItem('cartCount', String(n));
        })
        .catch(() => {});
    };
    window.addEventListener('cartUpdated', onUpdate);
    return () => window.removeEventListener('cartUpdated', onUpdate);
  }, []);
 
 
  return (
    <>
      <style>{modalCSS}</style>
 
      <header style={{ backgroundColor: '#C6676D', width: '100%', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 
          {/* LOGO + SUBTÍTULO ROTATIVO */}
          <div 
            onClick={() => setPage('inicio')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              width: '165px',
              height: '45px' 
            }}
          >
            <img
              src={bannerPrincipal}
              alt="Sweet Cream Rose Logo"
              style={{ 
                width: '100%', 
                height: '28px', 
                objectFit: 'contain' 
              }}
            />
            <span style={{
              color: '#f8d7dc',
              fontSize: '10px',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              marginTop: '1px',
              letterSpacing: '0.3px',
              textAlign: 'center',
              transition: 'opacity 0.5s ease-in-out',
              opacity: fade ? 0.95 : 0,
              whiteSpace: 'nowrap',
              transform: 'translateX(-4px)' // esto es para ajustar el centrado moviéndolo un poco a la izquierda
            }}>
              {`• ${frasesSubtitulo[fraseIdx]} •`}
            </span>
          </div>
 
          {/* NAVEGACIÓN */}
          <nav style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => setPage('inicio')}    style={estiloBoton('inicio')}>INICIO</button>
            <button onClick={() => setPage('productos')} style={estiloBoton('productos')}>PRODUCTOS</button>
            <button onClick={() => setPage('ofertas')}   style={estiloBoton('ofertas')}>OFERTAS</button>
            <button onClick={() => setPage('nosotros')}  style={estiloBoton('nosotros')}>NOSOTROS</button>
          </nav>
 
          {/* LADO DERECHO: buscador + usuario + carrito */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
 
            {/* Buscador */}
            <div ref={searchBoxRef} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: 'white', 
              borderRadius: '4px', 
              padding: '0 4px 0 12px', 
              width: '220px',
              marginRight: '4px',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={onChangeBusqueda}
                onFocus={() => sugerencias.length > 0 && setMostrarSug(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') irABusqueda(); }}
                style={{ border: 'none', outline: 'none', width: '100%', padding: '8px 0', backgroundColor: 'transparent', fontFamily: 'sans-serif' }}
              />
              <img 
                src={iconLupa} 
                alt="Buscar" 
                onClick={() => irABusqueda()}
                style={{ width: '30px', height: '24px', objectFit: 'contain', cursor: 'pointer', marginLeft: '5px' }} 
              />
              {mostrarSug && sugerencias.length > 0 && (
                <div style={{
                  position: 'absolute', top: '110%', left: 0, right: 0,
                  background: 'white', borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  zIndex: 1200, overflow: 'hidden', minWidth: '260px'
                }}>
                  {sugerencias.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setBusqueda(p.nombre || '');
                        irABusqueda(p.nombre || '');
                      }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 10px', border: 'none', background: 'white',
                        cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      <img
                        src={resolverImagenProducto(p.imagenUrl)}
                        alt=""
                        style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, background: '#fdf2f4' }}
                      />
                      <span style={{ fontSize: 13, color: '#5A3E41', fontFamily: 'sans-serif' }}>{p.nombre}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => irABusqueda()}
                    style={{
                      width: '100%', border: 'none', background: '#FDF2F3',
                      color: '#C3666D', padding: '8px', cursor: 'pointer',
                      fontWeight: 600, fontSize: 12
                    }}
                  >
                    Ver todos los resultados
                  </button>
                </div>
              )}
            </div>
 
            {/* ICONO USUARIO */}
            {usuario ? (
              <img
                src={iconUser}
                alt="Ir a mi perfil"
                title="Ir a mi perfil"
                style={{ width: '32px', height: '32px', objectFit: 'contain', cursor: 'pointer' }}
                onClick={() => setPage('perfil')}
              />
            ) : (
              <img
                src={iconUser}
                alt="Iniciar sesión"
                title="Iniciar sesión / Registrarse"
                style={{ width: '32px', height: '32px', objectFit: 'contain', cursor: 'pointer' }}
                onClick={() => setShowAuth(true)}
              />
            )}
 
            {/* ICONO CARRITO */}
            <div
              style={{ 
                position: 'relative', 
                cursor: 'pointer',
                width: '32px', 
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => setShowCart(true)}
              title="Ver carrito"
            >
              <img src={iconCart}
              alt="Carrito"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
              {usuario && cartCount > 0 && (
                <div style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  backgroundColor: 'white', color: '#C6676D',
                  borderRadius: '50%', width: '16px', height: '16px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '10px', fontWeight: 'bold',
                }}>
                  {cartCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
 
      {/* MODAL AUTH */}
      {showAuth && <AuthModal onClose={handleAuthClose} />}
 
      {/* ✅ CORRECCIÓN: CartDrawer ahora recibe setPage para que "IR A PAGAR" funcione */}
      {showCart && (
        <CartDrawer
          onClose={() => setShowCart(false)}
          setPage={setPage}
        />
      )}
    </>
  );
};
 
export default Header;