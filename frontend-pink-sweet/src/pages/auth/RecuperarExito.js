import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import cupcakeImg from '../../assets/cupcake_grafico.png';
import checkVerdeImg from '../../assets/Ofertas_check verde.png';
import candadoGrisImg from '../../assets/candadoGris.png';

function RecuperarExito() {
    const navigate = useNavigate();

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
        
                <button className="back-link" onClick={() => navigate('/cambiar-password-3')}>
                    ← Volver
                </button>
        
                {/* Ícono check verde */}
                <img src={checkVerdeImg} alt="Éxito" className="recover-icon-img"
                    style={{ width: '80px', height: '80px' }} />

                <h2 className="form-title">¡Contraseña actualizada!</h2>
        
                <p className="hint-text" style={{ color: '#888', fontSize: '0.92rem' }}>
                    Tu contraseña fue actualizada correctamente.<br />
                    Ahora puedes iniciar sesión nuevamente con tu
                    nueva contraseña.
                </p>
        
                {/* Caja de seguridad */}
                <div className="seguridad-box">
                    <img src={candadoGrisImg} alt="seguridad"
                        style={{ width: '36px', height: '36px', flexShrink: 0 }} />
                    <div>
                        <p className="seguridad-titulo">Por tu seguridad</p>
                        <p className="seguridad-texto">
                            Si no solicitaste este cambio, por favor comunícate con el administrador del sistema.
                        </p>
                    </div>
                </div>
        
                <button className="btn-main" onClick={() => navigate('/login')}>
                    Ir al inicio de sesión
                </button>
        
                </div>
            </div>
        
            </div>
        </div>
    );
}

export default RecuperarExito;