import React, { useState, useEffect, useCallback } from "react";
import iconShop from '../../assets/icon-shop.png';

// Lee los IDs guardados en sessionStorage por Productos.js / Ofertas.js
const leerFavoritoIds = () => {
  try {
    const raw = sessionStorage.getItem('favoritos_ids');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const formatearFechaCorta = (f) => {
  if (!f) return '';
  try {
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const d = new Date(f);
    return `${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
  } catch { return ''; }
};

const PerfilInfoTab = ({ setActiveTab, usuario, setUsuario }) => {
  // ── PEDIDOS REALES (antes era un arreglo hardcodeado) ────────────────────
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  // ── FAVORITOS REALES (IDs en sessionStorage → detalle vía backend) ────────
  const [favoritos, setFavoritos] = useState([]);
  const [cargandoFavoritos, setCargandoFavoritos] = useState(true);

  const [editando,  setEditando]  = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre:   usuario?.nombre   || '',
    apellido: usuario?.apellido || '',
    telefono: usuario?.telefono || '',
    fechaNacimiento: usuario?.fechaNacimiento || '',
    genero:          usuario?.genero          || ''
  });

  // Cargar pedidos reales del usuario logueado
  useEffect(() => {
    const token      = sessionStorage.getItem('token');
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!token) { setCargandoPedidos(false); return; }

    let usuarioId = null;
    try { usuarioId = JSON.parse(usuarioStr)?.id; } catch (_) {}

    const cargarPedidos = (id) => {
      fetch(`${API_BASE}/api/ordenes/usuario/${id}/historial`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const lista = Array.isArray(data) ? data : [];
          // más reciente primero
          lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          setPedidos(lista);
        })
        .catch(() => setPedidos([]))
        .finally(() => setCargandoPedidos(false));
    };

    if (usuarioId) {
      cargarPedidos(usuarioId);
    } else {
      // fallback: obtener el id desde el perfil si no está en sessionStorage
      fetch(`${API_BASE}/api/usuarios/perfil`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data?.id) cargarPedidos(data.id); else setCargandoPedidos(false); })
        .catch(() => setCargandoPedidos(false));
    }
  }, []);

  // Cargar favoritos reales: mismos IDs (favoritos_ids) que usan Productos.js y Ofertas.js, pidiendo el detalle de cada producto al backend — igual que Perfil5.js
  const cargarFavoritos = useCallback(async () => {
    setCargandoFavoritos(true);
    const ids = leerFavoritoIds();

    if (ids.length === 0) {
      setFavoritos([]);
      setCargandoFavoritos(false);
      return;
    }

    const token = sessionStorage.getItem('token');
    const resultados = [];

    await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`${API_BASE}/api/productos/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) resultados.push(await res.json());
        } catch {
          // si falla un producto puntual, se ignora y se sigue con el resto
        }
      })
    );

    setFavoritos(resultados);
    setCargandoFavoritos(false);
  }, []);

  useEffect(() => { cargarFavoritos(); }, [cargarFavoritos]);

  // Escuchar el mismo evento que disparan Productos.js / Ofertas.js al marcar ♥
  useEffect(() => {
    const onUpdate = () => cargarFavoritos();
    window.addEventListener('favoritosUpdated', onUpdate);
    return () => window.removeEventListener('favoritosUpdated', onUpdate);
  }, [cargarFavoritos]);

  // Quitar favorito desde la vista previa (misma mecánica que Perfil5.js)
  const quitarFavorito = (producto) => {
    setFavoritos(prev => prev.filter(p => p.id !== producto.id));

    const ids = leerFavoritoIds().filter(id => id !== producto.id);
    sessionStorage.setItem('favoritos_ids', JSON.stringify(ids));

    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/api/favoritos/${producto.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  // Añadir al carrito desde la vista previa (misma llamada que usa Perfil5.js)
  const agregarAlCarrito = async (producto) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/carrito/agregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productoId: producto.id, cantidad: 1 }),
      });
      if (!res.ok) throw new Error();
      alert(`"${producto.nombre}" añadido al carrito.`);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      alert('No se pudo añadir al carrito. Inténtalo de nuevo.');
    }
  };

  const handleContacto = () => {
    // Puedes cambiar la URL por tu enlace de WhatsApp o email
    window.open("https://wa.me/51999999999", "_blank");
  };

  const formatearFechaRegistro = (f) => {
    if (!f) return '—';
    try {
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const d = new Date(f);
      return `${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
    } catch { return '—'; }
  };

  const formatearFechaNac = (f) => {
    if (!f) return '—';
    try {
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const [a,m,d] = f.split('-');
      return `${parseInt(d)} de ${meses[parseInt(m)-1]}, ${a}`;
    } catch { return '—'; }
  };

  const guardarCambios = async () => {
    if (form.nombre && form.nombre[0] !== form.nombre[0].toUpperCase()) {
      alert('El nombre debe comenzar con mayúscula'); return;
    }
    if (form.apellido && form.apellido[0] !== form.apellido[0].toUpperCase()) {
      alert('El apellido debe comenzar con mayúscula'); return;
    }
    setGuardando(true);
    const token = sessionStorage.getItem('token');
    try {
      const res  = await fetch('http://localhost:8081/api/usuarios/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (setUsuario) setUsuario(prev => ({ ...prev, ...data }));
      setEditando(false);
    } catch {
      alert('Error al guardar. Intenta de nuevo.');
    }
    setGuardando(false);
  };

  // ── Datos derivados de "MI ACTIVIDAD" (antes hardcodeados en 0) ──────────
  const totalPedidos  = pedidos.length;
  const ultimoPedido  = pedidos.length > 0 ? formatearFechaRegistro(pedidos[0].fecha) : '—';
  const totalGastado  = pedidos
    .filter(p => (p.estado || '').toUpperCase() !== 'CANCELADO')
    .reduce((acc, p) => acc + (p.total || 0), 0);

  return (
    <>
      {/* INFORMACIÓN PERSONAL */}
      <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', padding: '40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-regular fa-user" style={{ color: '#C6676D', fontSize: '24px' }}></i>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41', margin: '0' }}>INFORMACIÓN PERSONAL</h3>
          </div>
          {!editando && (
            <button onClick={() => {
                setForm({ nombre: usuario?.nombre || '', apellido: usuario?.apellido || '', telefono: usuario?.telefono || '', fechaNacimiento: usuario?.fechaNacimiento || '', genero: usuario?.genero || '' });
                setEditando(true);
              }}
              style={{ backgroundColor: 'transparent', color: '#C6676D', border: '2px solid #EAAFB8', padding: '8px 20px', borderRadius: '20px', fontFamily: 'Poppins-Medium', fontSize: '13px', cursor: 'pointer' }}>
              <i className="fa-solid fa-pen-to-square"></i> Editar
            </button>
          )}
        </div>

        {/* MODO EDICIÓN */}
        {editando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
            {[
              { label: 'Nombre',  key: 'nombre',  placeholder: 'Ej: Juan' },
              { label: 'Apellido', key: 'apellido', placeholder: 'Ej: Pérez' },
              { label: 'Teléfono', key: 'telefono', placeholder: 'Ej: +51 999999999' },
              { label: 'Fecha de nacimiento', key: 'fechaNacimiento', placeholder: 'YYYY-MM-DD' },
              { label: 'Género',   key: 'genero',   placeholder: 'Masculino / Femenino / Otro' }
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins-Medium', fontSize: '14px' }}>
                <div style={{ width: '250px', color: '#5A3E41' }}>{label}</div>
                <input
                  value={form[key]}
                  placeholder={placeholder}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ flex: 1, border: '2px solid #EAAFB8', borderRadius: '8px', padding: '10px 14px', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41', outline: 'none' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <button onClick={guardarCambios} disabled={guardando}
                style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', fontFamily: 'Poppins-Bold', fontSize: '13px', cursor: 'pointer' }}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button onClick={() => setEditando(false)}
                style={{ backgroundColor: 'transparent', color: '#C6676D', border: '2px solid #EAAFB8', padding: '10px 25px', borderRadius: '8px', fontFamily: 'Poppins-Medium', fontSize: '13px', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '50px' }}>
            {[
              { label: "Nombre completo",    value: `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.trim() || '—', icon: "fa-regular fa-user" },
              { label: "Correo electrónico", value: usuario?.correo    || '—', icon: "fa-regular fa-envelope" },
              { label: "Teléfono",           value: usuario?.telefono  || '—', icon: "fa-solid fa-phone" },
              { label: "Fecha de nacimiento", value: formatearFechaNac(usuario?.fechaNacimiento), icon: "fa-regular fa-calendar" },
              { label: "Genero",             value: usuario?.genero || '—', icon: "fa-solid fa-venus-mars" },
              { label: "Fecha de registro",  value: formatearFechaRegistro(usuario?.fechaRegistro), icon: "fa-regular fa-id-card" }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins-Medium', fontSize: '14px' }}>
                <div style={{ width: '250px', color: '#5A3E41', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className={row.icon} style={{ color: '#C6676D', width: '20px', textAlign: 'center', fontSize: '16px' }}></i>
                  {row.label}
                </div>
                <div style={{ color: '#5A3E41', fontFamily: 'Poppins-Regular' }}>{row.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* MI ACTIVIDAD */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <i className="fa-regular fa-calendar" style={{ color: '#C6676D', fontSize: '24px' }}></i>
          <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41', margin: '0' }}>MI ACTIVIDAD</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {[
            { label: "Total de pedidos realizados", value: `${totalPedidos} pedidos`,                icon: "fa-solid fa-bag-shopping" },
            { label: "Último pedido",               value: ultimoPedido,                              icon: "fa-regular fa-clock" },
            { label: "Total gastado",               value: `S/. ${totalGastado.toFixed(2)}`,          icon: "fa-solid fa-money-bill" }
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins-Medium', fontSize: '14px' }}>
              <div style={{ width: '250px', color: '#5A3E41', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', border: '2px solid #C6676D', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i className={row.icon} style={{ color: '#C6676D', fontSize: '12px' }}></i>
                </div>
                {row.label}
              </div>
              <div style={{ color: '#5A3E41', fontFamily: 'Poppins-Regular' }}>{row.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PEDIDOS RECIENTES */}
      <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', padding: '30px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-bag-shopping" style={{ color: '#C6676D', fontSize: '24px' }}></i>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41', margin: '0' }}>MIS PEDIDOS RECIENTES</h3>
          </div>
          <span onClick={() => setActiveTab("pedidos")} style={{ color: '#C6676D', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer' }}>Ver todos →</span>
        </div>

        {cargandoPedidos ? (
          <p style={{ fontFamily: 'Poppins-Regular', color: '#999', textAlign: 'center', padding: '20px 0' }}>Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#999' }}>
            <i className="fa-regular fa-bag-shopping" style={{ fontSize: '28px', color: '#EAAFB8', marginBottom: '10px', display: 'block' }}></i>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', margin: 0 }}>Aún no tienes pedidos. ¡Anímate a probar algo delicioso!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {pedidos.slice(0, 3).map((pedido) => {
              const primerProducto = pedido.detalles && pedido.detalles.length > 0 ? pedido.detalles[0].producto : null;
              const nombreResumen = primerProducto
                ? (pedido.detalles.length > 1 ? `${primerProducto.nombre} y ${pedido.detalles.length - 1} más` : primerProducto.nombre)
                : 'Pedido sin detalle';
              const imagenUrl = primerProducto?.imagenUrl ? `${API_BASE}${primerProducto.imagenUrl}` : null;

              return (
                <div key={pedido.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #EAAFB8', borderRadius: '15px', padding: '15px 25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {imagenUrl ? (
                      <img src={imagenUrl} alt={nombreResumen} style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '20px' }} />
                    ) : (
                      <div style={{ width: '120px', height: '90px', borderRadius: '20px', backgroundColor: '#FDF2F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-cake-candles" style={{ color: '#EAAFB8', fontSize: '28px' }}></i>
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: '0 0 5px 0' }}>Pedido #{String(pedido.id).padStart(6, '0')}</h4>
                      <p style={{ fontFamily: 'Poppins-Regular', fontSize: '15px', color: '#5A3E41', margin: '0 0 2px 0' }}>{nombreResumen}</p>
                      <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: '0' }}>{formatearFechaCorta(pedido.fecha)}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#FADADD', color: '#C6676D', padding: '6px 16px', borderRadius: '20px', fontFamily: 'Poppins-Medium', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-regular fa-circle-check"></i> {pedido.estado}
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: '#5A3E41', fontSize: '16px', cursor: 'pointer' }} onClick={() => setActiveTab("pedidos")}></i>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PRODUCTOS FAVORITOS */}
      <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', padding: '30px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-regular fa-heart" style={{ color: '#C6676D', fontSize: '24px' }}></i>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41', margin: '0' }}>MIS PRODUCTOS FAVORITOS</h3>
          </div>
          <span onClick={() => setActiveTab("favoritos")} style={{ color: '#C6676D', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer' }}>Ver todos →</span>
        </div>

        {cargandoFavoritos ? (
          <p style={{ fontFamily: 'Poppins-Regular', color: '#999', textAlign: 'center', padding: '20px 0' }}>Cargando favoritos...</p>
        ) : favoritos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#999' }}>
            <i className="fa-regular fa-heart" style={{ fontSize: '28px', color: '#EAAFB8', marginBottom: '10px', display: 'block' }}></i>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', margin: 0 }}>Aún no agregaste productos a favoritos.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
            {favoritos.slice(0, 4).map((p) => {
              const imagenUrl = p.imagenUrl ? (p.imagenUrl.startsWith('http') ? p.imagenUrl : `${API_BASE}${p.imagenUrl}`) : null;
              return (
                <div key={p.id} style={{ border: '2px solid #EAAFB8', borderRadius: '20px', overflow: 'hidden', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '120px' }}>
                    {imagenUrl ? (
                      <img src={imagenUrl} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#FDF2F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-cake-candles" style={{ color: '#EAAFB8', fontSize: '24px' }}></i>
                      </div>
                    )}
                    <div onClick={() => quitarFavorito(p)} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.9)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                      <i className="fa-solid fa-heart" style={{ color: '#C6676D', fontSize: '14px', marginTop: '1px' }}></i>
                    </div>
                  </div>
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '12px', color: '#5A3E41', margin: '0 0 5px 0' }}>{p.nombre}</h3>
                    <p style={{ fontFamily: 'Poppins-Medium', fontSize: '10px', color: '#644444', margin: '0 0 10px 0', lineHeight: '1.4', flexGrow: 1 }}>{p.descripcion}</p>
                    <div style={{ fontFamily: 'Poltawski-Nowy', fontSize: '16px', color: '#644444', marginBottom: '10px' }}>S/. {Number(p.precio).toFixed(2)}</div>
                    <button onClick={() => agregarAlCarrito(p)} style={{ backgroundColor: '#C6676D', color: '#FFFFFF', border: 'none', padding: '8px', borderRadius: '8px', fontFamily: 'Poppins-Medium', fontSize: '11px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', width: '100%' }}>
                      <i className="fa-solid fa-cart-shopping"></i> AÑADIR AL CARRITO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BANNER CONTACTO */}
      <div style={{ backgroundColor: '#FACFD8', borderRadius: '20px', padding: '25px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '80px', height: '80px', flexShrink: 0, backgroundColor: 'white', border: '3px solid #EAAFB8', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <img src={iconShop} alt="Icono Tienda" style={{ width: '60%', height: 'auto', objectFit: 'contain' }} />
          </div>
          <div>
            <h3 style={{ color: '#7D2530', margin: '0 0 5px 0', fontSize: '18px', fontFamily: 'Poppins-SemiBold' }}>¿No encuentras lo que buscas?</h3>
            <p style={{ margin: '0', color: '#B14B47', fontSize: '15px', fontFamily: 'Signika-Regular', maxWidth: '350px', lineHeight: '1.2' }}>Contáctanos y con gusto te ayudamos a crear el postre perfecto</p>
          </div>
        </div>
        <button onClick={handleContacto} style={{ backgroundColor: '#C3666D', color: 'white', fontSize: '14px', fontFamily: 'Poppins-Bold', border: 'none', padding: '10px 25px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          CONTACTAR <span style={{ fontSize: '16px' }}>›</span>
        </button>
      </div>
    </>
  );
};

export default PerfilInfoTab;