import React, { useState, useEffect } from "react";

/* IMPORTANTE: El backend usa dos puertos distintos:
   - 8081  → /api/usuarios/perfil  (para obtener el id del usuario)
   - 8080  → /api/direcciones/**   (para CRUD de direcciones) */
const API_USUARIOS   = process.env.REACT_APP_API_URL  || "http://localhost:8081";
const API_DIRECCIONES = process.env.REACT_APP_API_URL || "http://localhost:8081";

/* Opciones de etiqueta con icono */
const ETIQUETAS = [
  { valor: "Casa",               icono: "fa-solid fa-house" },
  { valor: "Trabajo",            icono: "fa-solid fa-building" },
  { valor: "Casa de mis padres", icono: "fa-solid fa-house-chimney-user" },
  { valor: "Otro",               icono: "fa-solid fa-location-dot" },
];

function iconoPorEtiqueta(etiqueta) {
  const found = ETIQUETAS.find(e => e.valor === etiqueta);
  return found ? found.icono : "fa-solid fa-location-dot";
}

const FORM_VACIO = {
  etiqueta:    "Casa",
  direccion:   "",
  distrito:    "",
  referencia:  "",
  telefono:    "",
  esPrincipal: false,
};

/* COMPONENTE PRINCIPAL */
const PerfilDireccionesTab = () => {
  const [direcciones,  setDirecciones]  = useState([]);
  const [usuarioId,    setUsuarioId]    = useState(null);
  const [cargando,     setCargando]     = useState(true);
  const [hoveredCard,  setHoveredCard]  = useState(null);

  /* modal: null | "agregar" | "editar" */
  const [modal,        setModal]        = useState(null);
  const [form,         setForm]         = useState(FORM_VACIO);
  const [editandoId,   setEditandoId]   = useState(null);
  const [guardando,    setGuardando]    = useState(false);
  const [error,        setError]        = useState("");

  /* confirmación eliminar */
  const [confirmId,    setConfirmId]    = useState(null);

  const getToken = () => sessionStorage.getItem("token");

  /* Paso 1: obtener usuarioId (primero sessionStorage, sino llama al perfil) */
  useEffect(() => {
    const token = getToken();
    if (!token) { setCargando(false); return; }

    // Intentar desde sessionStorage primero
    try {
      const str = sessionStorage.getItem("usuario");
      const id  = JSON.parse(str)?.id;
      if (id) { setUsuarioId(id); return; }
    } catch (_) {}

    // Si no está en sessionStorage, obtenerlo del backend
    fetch(`${API_USUARIOS}/api/usuarios/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.id) {
          setUsuarioId(data.id);
          // Guardarlo para próximas veces
          sessionStorage.setItem("usuario", JSON.stringify(data));
        } else {
          setCargando(false);
          setError("No se pudo identificar al usuario.");
        }
      })
      .catch(() => {
        setCargando(false);
        setError("No se pudo conectar al servidor.");
      });
  }, []);

  /* Paso 2: cargar direcciones cuando ya tenemos el usuarioId */
  useEffect(() => {
    if (!usuarioId) return;
    cargarDirecciones(usuarioId);
  }, [usuarioId]);

  const cargarDirecciones = async (uid) => {
    setCargando(true);
    setError("");
    const token = getToken();
    try {
      const res = await fetch(`${API_DIRECCIONES}/api/direcciones/usuario/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudieron cargar las direcciones.");
      const data = await res.json();
      setDirecciones(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  /* Abrir modal AGREGAR */
  const abrirAgregar = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setError("");
    setModal("agregar");
  };

  /* Abrir modal EDITAR */
  const abrirEditar = (item) => {
    setForm({
      etiqueta:    item.ciudad       || "Casa",
      direccion:   item.direccion    || "",
      distrito:    item.distrito     || "",
      referencia:  item.referencia   || "",
      telefono:    item.codigoPostal || "",
      esPrincipal: item.esPrincipal  || false,
    });
    setEditandoId(item.id);
    setError("");
    setModal("editar");
  };

  const cerrarModal = () => { setModal(null); setError(""); };

  /* Guardar (agregar o editar) */
  const guardar = async () => {
    if (!usuarioId) {
      setError("No se pudo identificar tu usuario. Recarga la página o vuelve a iniciar sesión.");
      return;
    }
    if (!form.direccion.trim()) { setError("La dirección es obligatoria."); return; }
    if (!form.distrito.trim())  { setError("El distrito es obligatorio."); return; }

    setGuardando(true);
    setError("");
    const token = getToken();

    const body = {
      direccion:    form.direccion.trim(),
      distrito:     form.distrito.trim(),
      ciudad:       form.etiqueta,           // etiqueta → campo ciudad
      codigoPostal: form.telefono.trim(),    // teléfono → campo codigoPostal
      referencia:   form.referencia.trim(),
      esPrincipal:  form.esPrincipal,
    };

    try {
      let url, method;
      if (modal === "agregar") {
        url    = `${API_DIRECCIONES}/api/direcciones/usuario/${usuarioId}`;
        method = "POST";
      } else {
        url    = `${API_DIRECCIONES}/api/direcciones/${editandoId}/usuario/${usuarioId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Ocurrió un error al guardar.");
      }

      await cargarDirecciones(usuarioId);
      cerrarModal();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  /* Eliminar */
  const eliminar = async (id) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_DIRECCIONES}/api/direcciones/${id}/usuario/${usuarioId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo eliminar la dirección.");
      setConfirmId(null);
      await cargarDirecciones(usuarioId);
    } catch (e) {
      setError(e.message);
    }
  };

  /* RENDER */
  return (
    <>
      {/* CONTENEDOR PRINCIPAL */}
      <div style={{ backgroundColor: "white", border: "2px solid #EAAFB8", borderRadius: "20px", padding: "40px" }}>

        {/* Cabecera */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", borderBottom: "2px solid #FDF2F3", paddingBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <i className="fa-solid fa-location-dot" style={{ color: "#C6676D", fontSize: "24px" }}></i>
            <div>
              <h3 style={{ fontFamily: "Poppins-Bold", fontSize: "20px", color: "#5A3E41", margin: "0" }}>MIS DIRECCIONES</h3>
              <p style={{ fontFamily: "Poppins-Regular", fontSize: "13px", color: "#777", margin: "0" }}>Gestiona las direcciones donde quieres recibir tus pedidos.</p>
            </div>
          </div>

          <button
            onClick={abrirAgregar}
            style={{ backgroundColor: "#C6676D", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontFamily: "Poppins-Bold", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <i className="fa-solid fa-plus"></i> Agregar dirección
          </button>
        </div>

        {/* Error global */}
        {error && !modal && (
          <div style={{ backgroundColor: "#FDE8E8", border: "1px solid #E6AAAA", borderRadius: "10px", padding: "12px 18px", marginBottom: "20px", color: "#C6676D", fontFamily: "Poppins-Regular", fontSize: "13px" }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "8px" }}></i>{error}
          </div>
        )}

        {/* Cargando */}
        {cargando && (
          <div style={{ textAlign: "center", padding: "50px 0", color: "#C6676D", fontFamily: "Poppins-Regular", fontSize: "14px" }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "28px", marginBottom: "12px", display: "block" }}></i>
            Cargando tus direcciones...
          </div>
        )}

        {/* Estado vacío */}
        {!cargando && direcciones.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#FADADD", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <i className="fa-solid fa-location-dot" style={{ fontSize: "32px", color: "#C6676D" }}></i>
            </div>
            <h4 style={{ fontFamily: "Poppins-Bold", fontSize: "17px", color: "#5A3E41", margin: "0 0 8px 0" }}>Aún no tienes direcciones guardadas</h4>
            <p style={{ fontFamily: "Poppins-Regular", fontSize: "13px", color: "#999", margin: "0 0 24px 0" }}>Agrega una dirección para recibir tus pedidos más fácilmente.</p>
            <button
              onClick={abrirAgregar}
              style={{ backgroundColor: "#C6676D", color: "white", border: "none", padding: "12px 28px", borderRadius: "12px", fontFamily: "Poppins-Bold", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <i className="fa-solid fa-plus"></i> Agregar mi primera dirección
            </button>
          </div>
        )}

        {/* Lista de direcciones */}
        {!cargando && direcciones.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {direcciones.map((item) => {
              const etiqueta = item.ciudad       || "Otro";
              const telefono = item.codigoPostal || "";
              const icono    = iconoPorEtiqueta(etiqueta);
              const hovered  = hoveredCard === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ display: "flex", gap: "20px", border: `2px solid ${hovered ? "#C6676D" : "#FDF2F3"}`, borderRadius: "15px", padding: "25px", alignItems: "flex-start", position: "relative", transition: "all 0.2s ease" }}
                >
                  {/* Icono redondo */}
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#FADADD", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6676D", fontSize: "20px", flexShrink: 0 }}>
                    <i className={icono}></i>
                  </div>

                  {/* Textos */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                      <h4 style={{ fontFamily: "Poppins-Bold", fontSize: "16px", color: "#5A3E41", margin: 0 }}>{etiqueta}</h4>
                      {item.esPrincipal && (
                        <span style={{ backgroundColor: "#FADADD", color: "#C6676D", fontSize: "11px", fontFamily: "Poppins-Bold", padding: "4px 12px", borderRadius: "15px" }}>
                          Dirección principal
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "Poppins-Regular", fontSize: "14px", color: "#5A3E41" }}>
                      <span><strong>Dirección:</strong> {item.direccion}</span>
                      <span style={{ color: "#C6676D", fontFamily: "Poppins-Medium" }}>{item.distrito}</span>
                      {item.referencia && (
                        <span style={{ color: "#777", fontSize: "13px" }}><strong>Referencia:</strong> {item.referencia}</span>
                      )}
                      {telefono && (
                        <span style={{ color: "#777", fontSize: "13px" }}><strong>Teléfono:</strong> {telefono}</span>
                      )}
                    </div>
                  </div>

                  {/* Botones Editar / Eliminar */}
                  <div style={{ position: "absolute", top: "25px", right: "25px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                    <button onClick={() => abrirEditar(item)} style={{ background: "none", border: "none", fontFamily: "Poppins-Medium", fontSize: "13px", color: "#5A3E41", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                      <i className="fa-regular fa-pen-to-square"></i> Editar
                    </button>
                    {!item.esPrincipal && (
                      <button onClick={() => setConfirmId(item.id)} style={{ background: "none", border: "none", fontFamily: "Poppins-Medium", fontSize: "13px", color: "#777", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <i className="fa-regular fa-trash-can"></i> Eliminar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Banner inferior */}
        {!cargando && direcciones.length > 0 && (
          <div style={{ marginTop: "30px", backgroundColor: "#FDF2F3", border: "2px dashed #EAAFB8", borderRadius: "15px", padding: "20px 25px", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ color: "#C6676D", fontSize: "28px" }}>
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div>
              <h5 style={{ fontFamily: "Poppins-Bold", fontSize: "15px", color: "#5A3E41", margin: "0 0 5px 0" }}>Tu pedido llegará más rápido</h5>
              <p style={{ fontFamily: "Poppins-Regular", fontSize: "13px", color: "#777", margin: 0 }}>Asegúrate de que tu dirección esté actualizada para una mejor experiencia de entrega.</p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL — Agregar / Editar */}
      {(modal === "agregar" || modal === "editar") && (
        <div
          onClick={cerrarModal}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
          >
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#FADADD", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-location-dot" style={{ color: "#C6676D", fontSize: "16px" }}></i>
                </div>
                <h3 style={{ fontFamily: "Poppins-Bold", fontSize: "18px", color: "#5A3E41", margin: 0 }}>
                  {modal === "agregar" ? "Agregar dirección" : "Editar dirección"}
                </h3>
              </div>
              <button onClick={cerrarModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "20px" }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Selector de etiqueta */}
            <div style={{ marginBottom: "22px" }}>
              <label style={estiloLabel}>Tipo de dirección</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {ETIQUETAS.map(({ valor, icono }) => {
                  const activo = form.etiqueta === valor;
                  return (
                    <button
                      key={valor}
                      onClick={() => setForm(f => ({ ...f, etiqueta: valor }))}
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", border: `2px solid ${activo ? "#C6676D" : "#EAAFB8"}`, backgroundColor: activo ? "#FADADD" : "white", color: activo ? "#C6676D" : "#777", fontFamily: "Poppins-Medium", fontSize: "13px", transition: "all 0.15s ease" }}
                    >
                      <i className={icono}></i> {valor}
                    </button>
                  );
                })}
              </div>
            </div>

            <CampoTexto label="Dirección *"           placeholder="Ej: Av. Los Rosales 123"              value={form.direccion}  onChange={v => setForm(f => ({ ...f, direccion:  v }))} icono="fa-solid fa-road" />
            <CampoTexto label="Distrito *"             placeholder="Ej: San Borja, Lima - Lima"           value={form.distrito}   onChange={v => setForm(f => ({ ...f, distrito:   v }))} icono="fa-solid fa-map-pin" />
            <CampoTexto label="Referencia"             placeholder="Ej: Casa blanca con rejas negras"     value={form.referencia} onChange={v => setForm(f => ({ ...f, referencia: v }))} icono="fa-solid fa-circle-info" />
            <CampoTexto label="Teléfono de contacto"  placeholder="Ej: +51 987654321"                    value={form.telefono}   onChange={v => setForm(f => ({ ...f, telefono:   v }))} icono="fa-solid fa-phone" />

            {/* Checkbox principal */}
            <div
              onClick={() => setForm(f => ({ ...f, esPrincipal: !f.esPrincipal }))}
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", cursor: "pointer" }}
            >
              <div style={{ width: "20px", height: "20px", borderRadius: "5px", border: `2px solid ${form.esPrincipal ? "#C6676D" : "#EAAFB8"}`, backgroundColor: form.esPrincipal ? "#C6676D" : "white", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease", flexShrink: 0 }}>
                {form.esPrincipal && <i className="fa-solid fa-check" style={{ color: "white", fontSize: "11px" }}></i>}
              </div>
              <span style={{ fontFamily: "Poppins-Regular", fontSize: "13px", color: "#5A3E41" }}>Establecer como dirección principal</span>
            </div>

            {/* Error en modal */}
            {error && (
              <div style={{ backgroundColor: "#FDE8E8", border: "1px solid #E6AAAA", borderRadius: "10px", padding: "10px 15px", marginBottom: "20px", color: "#C6676D", fontFamily: "Poppins-Regular", fontSize: "13px" }}>
                <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "8px" }}></i>{error}
              </div>
            )}

            {/* Botones */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={cerrarModal} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid #EAAFB8", backgroundColor: "white", color: "#C6676D", fontFamily: "Poppins-Bold", fontSize: "14px", cursor: "pointer" }}>
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", backgroundColor: guardando ? "#E8A0A5" : "#C6676D", color: "white", fontFamily: "Poppins-Bold", fontSize: "14px", cursor: guardando ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                {guardando
                  ? <><i className="fa-solid fa-spinner fa-spin"></i> Guardando...</>
                  : <><i className="fa-solid fa-floppy-disk"></i> {modal === "agregar" ? "Agregar" : "Guardar cambios"}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Confirmar eliminación */}
      {confirmId !== null && (
        <div
          onClick={() => setConfirmId(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "400px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#FADADD", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <i className="fa-solid fa-trash-can" style={{ fontSize: "26px", color: "#C6676D" }}></i>
            </div>
            <h4 style={{ fontFamily: "Poppins-Bold", fontSize: "17px", color: "#5A3E41", margin: "0 0 10px 0" }}>¿Eliminar dirección?</h4>
            <p style={{ fontFamily: "Poppins-Regular", fontSize: "13px", color: "#777", margin: "0 0 28px 0" }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setConfirmId(null)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid #EAAFB8", backgroundColor: "white", color: "#C6676D", fontFamily: "Poppins-Bold", fontSize: "14px", cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={() => eliminar(confirmId)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", backgroundColor: "#C6676D", color: "white", fontFamily: "Poppins-Bold", fontSize: "14px", cursor: "pointer" }}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* Subcomponente campo de texto */
const CampoTexto = ({ label, placeholder, value, onChange, icono }) => (
  <div style={{ marginBottom: "18px" }}>
    <label style={estiloLabel}>{label}</label>
    <div style={{ position: "relative" }}>
      <i className={icono} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#C6676D", fontSize: "14px" }}></i>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px 11px 38px", border: "2px solid #EAAFB8", borderRadius: "10px", fontFamily: "Poppins-Regular", fontSize: "13px", color: "#5A3E41", outline: "none" }}
        onFocus={e => (e.target.style.borderColor = "#C6676D")}
        onBlur={e  => (e.target.style.borderColor = "#EAAFB8")}
      />
    </div>
  </div>
);

const estiloLabel = {
  display: "block",
  fontFamily: "Poppins-Medium",
  fontSize: "13px",
  color: "#5A3E41",
  marginBottom: "6px",
};

export default PerfilDireccionesTab;