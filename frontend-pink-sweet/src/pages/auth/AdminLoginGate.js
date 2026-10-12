import React, { useState, useEffect } from "react";
import { apiPost } from "../../api";

// ─────────────────────────────────────────────────────────────
// AdminLoginGate
// Se coloca ENVOLVIENDO a <AdminMenu /> en la ruta "/adminmenu".
// No modifica AdminMenu.js ni su diseño: solo exige loguearse
// como admin (correo + contraseña + PIN) antes de mostrarlo.
// Usa los endpoints que YA existen en el backend:
//   POST /api/admin/auth/verificar-admin  { correo, contrasena }
//   POST /api/admin/auth/pin              { correo, pin }
// ─────────────────────────────────────────────────────────────

export default function AdminLoginGate({ children }) {
  const [autorizado, setAutorizado] = useState(false);
  const [verificando, setVerificando] = useState(true);

  const [paso, setPaso] = useState(1); // 1 = correo/contraseña, 2 = pin
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Si ya hay un token de admin guardado, no pedir login de nuevo
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const rol = sessionStorage.getItem("rol");
    if (token && rol === "ADMIN") {
      setAutorizado(true);
    }
    setVerificando(false);
  }, []);

  const enviarCredenciales = async () => {
    setError("");
    if (!correo.trim() || !contrasena.trim()) {
      setError("Ingresa correo y contraseña.");
      return;
    }
    setCargando(true);
    try {
      await apiPost("/api/admin/auth/verificar-admin", { correo, contrasena });
      setPaso(2);
    } catch (e) {
      setError(e.message || "Credenciales incorrectas.");
    } finally {
      setCargando(false);
    }
  };

  const enviarPin = async () => {
    setError("");
    if (!pin.trim()) {
      setError("Ingresa el PIN de administrador.");
      return;
    }
    setCargando(true);
    try {
      const data = await apiPost("/api/admin/auth/pin", { correo, pin });
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("rol", data.rol || "ADMIN");
      setAutorizado(true);
    } catch (e) {
      setError(e.message || "PIN incorrecto.");
    } finally {
      setCargando(false);
    }
  };

  if (verificando) return null;
  if (autorizado) return children;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #C3666D, #8f4550)",
        fontFamily: "Poppins-Regular, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          width: "380px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ color: "#5A3E41", marginTop: 0, textAlign: "center" }}>
          Acceso Administrativo
        </h2>
        <p style={{ color: "#777", fontSize: "13px", textAlign: "center", marginBottom: "25px" }}>
          {paso === 1
            ? "Ingresa tus credenciales de administrador."
            : "Ingresa el código PIN de administrador."}
        </p>

        {error && (
          <div
            style={{
              background: "#FCE8EA",
              color: "#C3666D",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}

        {paso === 1 && (
          <>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarCredenciales()}
              style={inputStyle}
            />
            <button
              onClick={enviarCredenciales}
              disabled={cargando}
              style={btnStyle}
            >
              {cargando ? "Verificando..." : "Continuar"}
            </button>
          </>
        )}

        {paso === 2 && (
          <>
            <input
              type="password"
              placeholder="Código PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarPin()}
              style={inputStyle}
            />
            <button onClick={enviarPin} disabled={cargando} style={btnStyle}>
              {cargando ? "Ingresando..." : "Ingresar al panel"}
            </button>
          </>
        )}

        <div
          onClick={() => (window.location.href = "http://localhost:3000/")}
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "13px",
            color: "#999",
            cursor: "pointer",
          }}
        >
          ← Volver al sitio
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  borderRadius: "8px",
  border: "1px solid #D9D9D9",
  boxSizing: "border-box",
  fontSize: "14px",
  color: "#5A3E41",
  outline: "none",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#C3666D",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};