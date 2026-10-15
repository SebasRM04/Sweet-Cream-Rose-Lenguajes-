import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Lee los IDs guardados en sessionStorage por Productos.js
const leerIdsDesdeStorage = () => {
  try {
    const raw = sessionStorage.getItem('favoritos_ids');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const PerfilFavoritosTab = () => {
  const [favoritos, setFavoritos]     = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Carga los productos completos a partir de los IDs en sessionStorage
  const cargarFavoritos = useCallback(async () => {
    setCargando(true);
    const ids = leerIdsDesdeStorage();

    if (ids.length === 0) {
      setFavoritos([]);
      setCargando(false);
      return;
    }

    const token = sessionStorage.getItem('token');
    const resultados = [];

    // Por cada ID guardado, pedir el producto al backend
    await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`${API_BASE}/api/productos/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const prod = await res.json();
            resultados.push(prod);
          }
        } catch {
          // Si falla un producto, lo ignoramos y seguimos
        }
      })
    );

    setFavoritos(resultados);
    setCargando(false);
  }, []);

  // Cargar al montar
  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  // Escuchar evento 'favoritosUpdated' disparado por Productos.js al marcar ♥
  useEffect(() => {
    const onUpdate = () => cargarFavoritos();
    window.addEventListener('favoritosUpdated', onUpdate);
    return () => window.removeEventListener('favoritosUpdated', onUpdate);
  }, [cargarFavoritos]);

  // Quitar un favorito
  const quitarFavorito = (productoId) => {
    // 1. Quitar del estado visual
    setFavoritos(prev => prev.filter(p => p.id !== productoId));

    // 2. Actualizar sessionStorage
    const ids = leerIdsDesdeStorage().filter(id => id !== productoId);
    sessionStorage.setItem('favoritos_ids', JSON.stringify(ids));

    // 3. Notificar al backend (sin esperar respuesta)
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/api/favoritos/${productoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  // Eliminar TODOS los favoritos
  const eliminarTodos = () => {
    if (favoritos.length === 0) return;

    // 1. Limpiar estado visual
    setFavoritos([]);

    // 2. Limpiar sessionStorage
    sessionStorage.removeItem('favoritos_ids');

    // 3. Notificar al backend
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/api/favoritos`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  // Añadir al carrito desde favoritos
  const añadirAlCarrito = async (producto) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/carrito/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId: producto.id, cantidad: 1 }),
      });
      if (!res.ok) throw new Error();
      alert(`"${producto.nombre}" añadido al carrito.`);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      alert('No se pudo añadir al carrito. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <div style={{ backgroundColor: 'white', border: '2px solid #EAAFB8', borderRadius: '20px', padding: '40px' }}>

        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '2px solid #FDF2F3', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-regular fa-heart" style={{ color: '#C6676D', fontSize: '26px' }}></i>
            <div>
              <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '20px', color: '#5A3E41', margin: '0' }}>MIS FAVORITOS</h3>
              <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: '0' }}>
                Tus productos favoritos, listos para disfrutar cuando quieras
              </p>
            </div>
          </div>
          {favoritos.length > 0 && (
            <button
              onClick={eliminarTodos}
              style={{ backgroundColor: 'transparent', color: '#C6676D', border: 'none', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Eliminar todos <i className="fa-regular fa-trash-can"></i>
            </button>
          )}
        </div>

        {/* Cargando */}
        {cargando && (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'Poppins-Medium', padding: '40px 0' }}>
            Cargando tus favoritos...
          </p>
        )}

        {/* Sin favoritos */}
        {!cargando && favoritos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤍</div>
            <p style={{ fontFamily: 'Poppins-Medium', fontSize: '16px', color: '#5A3E41', margin: '0 0 6px' }}>
              Aún no tienes favoritos
            </p>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#888', margin: 0 }}>
              Presiona el corazón ♡ en cualquier producto para guardarlo aquí.
            </p>
          </div>
        )}

        {/* Grilla de favoritos */}
        {!cargando && favoritos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
            {favoritos.map((prod) => {
              const imagenSrc = prod.imagenUrl ? `${API_BASE}${prod.imagenUrl}` : null;
              const isHovered = hoveredCard === prod.id;

              return (
                <div
                  key={prod.id}
                  onMouseEnter={() => setHoveredCard(prod.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    border: `1px solid ${isHovered ? '#C6676D' : '#EAAFB8'}`,
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff'
                  }}
                >
                  {/* Imagen */}
                  <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                    {imagenSrc ? (
                      <img
                        src={imagenSrc}
                        alt={prod.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.background = '#FADADD'; e.target.style.display = 'block'; }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#FADADD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                        🎂
                      </div>
                    )}
                    <div
                      onClick={() => quitarFavorito(prod.id)}
                      title="Quitar de favoritos"
                      style={{ position: 'absolute', top: '10px', right: '10px', color: '#C6676D', fontSize: '18px', cursor: 'pointer', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' }}
                    >
                      <i className="fa-solid fa-heart"></i>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontFamily: 'Poppins-Bold', fontSize: '12px', color: '#5A3E41', margin: '0 0 4px 0', lineHeight: '1.2' }}>{prod.nombre}</h4>
                      <p style={{ fontFamily: 'Poppins-Regular', fontSize: '12px', color: '#777', margin: '0 0 12px 0' }}>
                        S/. {Number(prod.precio).toFixed(2)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={() => añadirAlCarrito(prod)}
                        style={{ backgroundColor: '#C6676D', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', fontFamily: 'Poppins-Medium', fontSize: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                      >
                        <i className="fa-solid fa-cart-shopping"></i> AÑADIR AL CARRITO
                      </button>
                      <button
                        onClick={() => quitarFavorito(prod.id)}
                        style={{ background: 'none', border: 'none', color: '#C6676D', fontFamily: 'Poppins-Regular', fontSize: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                      >
                        <i className="fa-regular fa-trash-can"></i> Quitar de favoritos
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Banner */}
        <div style={{ marginTop: '30px', backgroundColor: '#FDF2F3', borderRadius: '15px', padding: '20px 30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: '#C6676D', fontSize: '40px', flexShrink: 0 }}>
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <div>
            <h5 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: '0 0 5px 0' }}>Guarda tus favoritos y encuéntralos siempre que los necesites</h5>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41', margin: 0 }}>Los mejores dulces siempre a un click</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default PerfilFavoritosTab;