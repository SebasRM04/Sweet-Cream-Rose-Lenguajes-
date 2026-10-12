import React, { useState, useEffect, useMemo } from "react";
import { API_BASE, apiGet, apiPost, apiPut, apiDelete, apiUpload } from '../../api';
import logoPrincipal from '../../assets/logo.png'; 

// IMÁGENES DE PRODUCTOS (Fallbacks visuales)
import imgTcTripleChocolate from '../../assets/products/tc-triple-chocolate.png';
import imgCArandano from '../../assets/products/c-arandano.png';
import imgAClasico from '../../assets/products/a-clasico.png';
import imgTFresa from '../../assets/products/t-fresa.png';
import imgMeQueso from '../../assets/products/me-queso.png';
import imgTvClasicos from '../../assets/products/tv-clasicos.png'; 

const AdminProductosTab = () => {

  // 1. LÓGICA DE ESTADOS
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState(null);          
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 6;

  // 2. LLAMADAS A LA API (Plato servido)
  const cargar = () => {
    setCargando(true);
    // Simulamos la llamada o usamos la real
    apiGet('/api/admin/productos')
      .then(data => { setProductos(Array.isArray(data) ? data : []); setError(""); })
      .catch(() => setError("No se pudieron cargar los productos. Verifica tu conexión."))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const categorias = useMemo(() => {
    const map = new Map();
    productos.forEach(p => { if (p.categoria) map.set(p.categoria.id, p.categoria.descripcion); });
    return Array.from(map, ([id, descripcion]) => ({ id, descripcion }));
  }, [productos]);

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await apiDelete(`/api/admin/productos/${id}`);
      setMenuAbierto(null);
      cargar();
    } catch (e) { alert(e.message); }
  };

  const guardar = async (form) => {
    try {
      let imagenUrl = form.imagenUrl || null;
      if (form.archivo) {
        const subida = await apiUpload('/api/admin/productos/subir-imagen', form.archivo);
        imagenUrl = subida.imagenUrl;
      }
      const body = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio === "" ? null : Number(form.precio),
        imagenUrl,
        categoria: form.categoriaId ? { id: Number(form.categoriaId) } : null,
        activo: form.activo ?? true
      };
      if (productoAEditar) await apiPut(`/api/admin/productos/${productoAEditar.id}`, body);
      else await apiPost('/api/admin/productos', body);
      setModalAbierto(false); setProductoAEditar(null);
      cargar();
    } catch (e) { alert(e.message); }
  };

  // 3. FILTROS Y PAGINACIÓN
  const filtrados = useMemo(() => {
    let arr = productos;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      arr = arr.filter(p => (p.nombre || '').toLowerCase().includes(q) ||
                            (p.categoria?.descripcion || '').toLowerCase().includes(q));
    }
    if (filtro === 'soloActivos') arr = arr.filter(p => p.activo !== false);
    return arr;
  }, [productos, busqueda, filtro]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const pagina = Math.min(paginaActual, totalPaginas);
  const visibles = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);
  
  useEffect(() => { setPaginaActual(1); }, [busqueda, filtro]);

  // 4. DATA DINÁMICA PARA MÉTRICAS (KPIs)
  const totalProds = productos.length || 0;
  const prodsActivos = productos.filter(p => p.activo !== false).length || 0;
  const prodsInactivos = totalProds - prodsActivos;
  const totalCategorias = categorias.length || 0;

  const metricas = [
    { valor: totalProds, etiqueta: "Total de productos", icon: "fa-solid fa-cake-candles", color: "#F194B4", bg: "#FDF2F3", border: "#FADADD" },
    { valor: prodsActivos, etiqueta: "A la venta", icon: "fa-solid fa-box-open", color: "#F2C94C", bg: "#FFF9E6", border: "#FDE49E" },
    { valor: prodsInactivos, etiqueta: "Ocultos", icon: "fa-solid fa-eye-slash", color: "#27AE60", bg: "#E9F7EF", border: "#A9DFBF" },
    { valor: totalCategorias, etiqueta: "Categorías", icon: "fa-solid fa-tags", color: "#9B59B6", bg: "#F4ECF7", border: "#D7BDE2" },
  ];

  // 5. COMPONENTES AUXILIARES
  const toggleMenu = (id) => setMenuAbierto(menuAbierto === id ? null : id);
  const btnStyle = { background: 'none', border: 'none', padding: '10px 15px', textAlign: 'left', cursor: 'pointer', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#5A3E41', width: '100%', transition: 'background 0.2s' };

  return (
    <div style={{ padding: '40px 50px', boxSizing: 'border-box', backgroundColor: '#FAFAFA', minHeight: '100%', width: '100%' }}>

      {/* TÍTULO Y BOTÓN AGREGAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins-Bold', fontSize: '22px', color: '#5A3E41', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
            PRODUCTOS
          </h1>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#777', margin: 0 }}>
            Gestiona tu catálogo de productos.
          </p>
        </div>
        <button onClick={() => { setProductoAEditar(null); setModalAbierto(true); }} style={{ backgroundColor: '#FCF0F2', color: '#C3666D', border: '1.5px solid #C3666D', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Poppins-SemiBold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
          <i className="fa-solid fa-bag-shopping"></i> AGREGAR PRODUCTO
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {metricas.map((metrica, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: `2px solid ${metrica.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '55px', height: '55px', backgroundColor: metrica.bg, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: metrica.color, fontSize: '24px', flexShrink: 0 }}>
              <i className={metrica.icon}></i>
            </div>
            <div>
              <h2 style={{ fontFamily: 'Poppins-Bold', fontSize: '28px', color: '#5A3E41', margin: '0 0 2px 0', lineHeight: '1' }}>{metrica.valor}</h2>
              <p style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#777', margin: 0, lineHeight: '1.2' }}>{metrica.etiqueta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #D9D9D9', borderRadius: '8px', padding: '0 15px', backgroundColor: 'white' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#999', fontSize: '16px' }}></i>
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar el pedido por ID, categoría o producto ..." 
            style={{ border: 'none', outline: 'none', width: '100%', padding: '12px 10px', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41' }}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <button onClick={() => setFiltroAbierto(!filtroAbierto)} style={{ backgroundColor: filtro ? '#C3666D' : 'white', color: filtro ? 'white' : '#C3666D', border: '1.5px solid #C3666D', borderRadius: '8px', padding: '0 25px', fontFamily: 'Poppins-Medium', fontSize: '14px', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-filter"></i> Filtros
          </button>
          
          {filtroAbierto && (
            <div style={{ position: 'absolute', right: '0', top: '55px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(0,0,0,0.15)', padding: '10px 0', width: '220px', zIndex: 100, border: '1px solid #FADADD' }}>
              <button style={{...btnStyle, fontWeight: filtro === null ? 'bold' : 'normal'}} onClick={() => { setFiltro(null); setFiltroAbierto(false); }}>🔄 Todos</button>
              <button style={{...btnStyle, fontWeight: filtro === 'soloActivos' ? 'bold' : 'normal'}} onClick={() => { setFiltro('soloActivos'); setFiltroAbierto(false); }}>✅ Solo activos</button>
            </div>
          )}
        </div>
      </div>

      {/* ESTADOS DE CARGA */}
      {cargando && <p style={{ color: '#999', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>Cargando datos de la base de datos...</p>}
      {error && <p style={{ color: '#C6676D', fontFamily: 'Poppins-Medium', textAlign: 'center' }}>{error}</p>}
      {!cargando && !error && visibles.length === 0 && <p style={{ color: '#999', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>A la espera de datos / No hay coincidencias.</p>}

      {/* LISTA DE PRODUCTOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        {visibles.map((prod) => {
          
          const esActivo = prod.activo !== false;
          let imgSource = prod.imagenUrl ? (prod.imagenUrl.startsWith('http') ? prod.imagenUrl : `${API_BASE}${prod.imagenUrl}`) : imgTcTripleChocolate; // Fallback a tu maqueta

          return (
            <div key={prod.id || Math.random()} style={{ border: '1px solid #EAEAEA', borderRadius: '15px', padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
              
              {/* Lado Izquierdo (Imagen + Info) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                <img 
                  src={imgSource} 
                  alt={prod.nombre} 
                  style={{ width: '130px', height: '90px', objectFit: 'cover', borderRadius: '10px' }} 
                  onError={e => { e.target.onerror = null; e.target.src = imgTcTripleChocolate; }} 
                />
                <div>
                  <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: '0 0 5px 0' }}>{prod.nombre || "Producto sin nombre"}</h3>
                  <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: '0 0 8px 0', maxWidth: '280px' }}>{prod.descripcion || "Sin descripción"}</p>
                  <p style={{ fontFamily: 'Poppins-Bold', fontSize: '14px', color: '#C3666D', margin: 0 }}>{prod.categoria?.descripcion || "Categoría general"}</p>
                </div>
              </div>

              {/* Centro (Precio) */}
              <div style={{ flexShrink: 0, width: '150px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'Poppins-Medium', fontSize: '18px', color: '#5A3E41' }}>
                  S/ {Number(prod.precio || 0).toFixed(2)}
                </span>
              </div>

              {/* Lado Derecho (Stock + Botones) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', width: '220px', justifyContent: 'flex-end', position: 'relative' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: esActivo ? '#27AE60' : '#777', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px' }}>●</span> {esActivo ? 'Disponible para venta' : 'No disponible'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setProductoAEditar(prod); setModalAbierto(true); }} style={{ border: '1.5px solid #F194B4', backgroundColor: 'transparent', color: '#F194B4', width: '35px', height: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button onClick={() => toggleMenu(prod.id)} style={{ border: '1.5px solid #F194B4', backgroundColor: 'transparent', color: '#F194B4', width: '35px', height: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </div>

                {/* MENÚ DESPLEGABLE DINÁMICO */}
                {menuAbierto === prod.id && (
                  <div style={{ position: 'absolute', right: '0', top: '50px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0px 4px 15px rgba(0,0,0,0.15)', padding: '5px 0', width: '130px', zIndex: 100, border: '1px solid #FADADD' }}>
                    <button style={btnStyle} onClick={() => alert('Ver detalle de ' + prod.nombre)}>👁 Detalle</button>
                    <button style={{...btnStyle, color: '#C6676D'}} onClick={() => eliminar(prod.id)}>🗑 Eliminar</button>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>
            Mostrando de {(pagina - 1) * porPagina + 1}-{Math.min(pagina * porPagina, filtrados.length)} de {filtrados.length} productos
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
               <button 
                  key={n} 
                  onClick={() => setPaginaActual(n)} 
                  style={{ 
                    border: pagina === n ? 'none' : '1px solid #D9D9D9', 
                    background: pagina === n ? '#C3666D' : 'white', 
                    color: pagina === n ? 'white' : '#5A3E41', 
                    width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Bold', fontSize: '14px' 
                  }}>
                  {n}
               </button>
            ))}
            
            <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} style={{ border: '1px solid #D9D9D9', background: 'white', color: '#C3666D', width: '35px', height: '35px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins-Medium', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* BANNER CONSEJO */}
      <div style={{ backgroundColor: '#FFF6F7', border: '1.5px solid #FADADD', borderRadius: '15px', padding: '20px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: 'white', border: '2px solid #F194B4', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#F194B4', fontSize: '28px' }}>
            <i className="fa-solid fa-shield"></i>
          </div>
          <div>
            <h3 style={{ fontFamily: 'Poppins-Bold', fontSize: '16px', color: '#5A3E41', margin: '0 0 5px 0' }}>Consejo</h3>
            <p style={{ fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#777', margin: 0 }}>Mantén tu catálogo actualizado para mejorar la experiencia de tus clientes.</p>
          </div>
        </div>
        <img src={imgTcTripleChocolate} alt="Decoración pastel" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} onError={e => e.target.style.display='none'} />
      </div>

      {/* FOOTER */}
      <p style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
        <span style={{ color: '#C3666D' }}>♥</span> Gracias por endulzar cada día con tu trabajo
      </p>

      {/* MODAL (Combinando la lógica con tu UI) */}
      {modalAbierto && (
        <ModalProducto
          producto={productoAEditar}
          categorias={categorias}
          onCancelar={() => { setModalAbierto(false); setProductoAEditar(null); }}
          onGuardar={guardar}
        />
      )}

    </div>
  );
};

// Componente Modal Adaptado
function ModalProducto({ producto, categorias, onCancelar, onGuardar }) {
  const [form, setForm] = useState({
    nombre: producto?.nombre || "",
    precio: producto?.precio ?? "",
    descripcion: producto?.descripcion || "",
    imagenUrl: producto?.imagenUrl || "",
    categoriaId: producto?.categoria?.id || "",
    activo: producto?.activo ?? true,
  });
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(producto?.imagenUrl ? `${API_BASE}${producto.imagenUrl}` : null);
  
  const MAX_MB = 10;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo permitido es ${MAX_MB} MB.`);
      e.target.value = "";
      return;
    }
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
  };
  const input = { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #D9D9D9', boxSizing: 'border-box', fontFamily: 'Poppins-Regular', fontSize: '14px', color: '#5A3E41', outline: 'none' };

  const submit = () => {
    if (!form.nombre.trim()) { alert('El nombre es obligatorio.'); return; }
    onGuardar({ ...form, archivo });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
      <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '20px', width: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid #FADADD' }}>
        <h2 style={{ fontFamily: 'Poppins-Bold', color: '#5A3E41', marginTop: 0, fontSize: '20px' }}>
          {producto ? "Editar Producto" : "Agregar Producto"}
        </h2>
        
        <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre del producto" style={input} />
        
        <input type="number" step="0.01" value={form.precio} onChange={e => set('precio', e.target.value)} placeholder="Precio (S/)" style={input} />

        <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Descripción corta" rows={2} style={{ ...input, resize: 'none' }} />

        <label style={{ fontFamily: 'Poppins-Medium', fontSize: '13px', color: '#5A3E41', display: 'block', marginTop: '6px' }}>Imagen del producto</label>
        <input type="file" accept="image/*" onChange={onFileChange} style={input} />
        {preview && (
          <img src={preview} alt="Vista previa" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', margin: '4px 0 8px' }} />
        )}
        
        <select value={form.categoriaId} onChange={e => set('categoriaId', e.target.value)} style={input}>
          <option value="">— Sin categoría —</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Poppins-Medium', color: '#5A3E41', marginTop: '10px', fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.activo} onChange={e => set('activo', e.target.checked)} style={{ accentColor: '#C3666D', width: '18px', height: '18px' }} /> 
            Producto Activo (Visible en tienda)
        </label>

        <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
          <button onClick={onCancelar} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #D9D9D9', background: 'white', color: '#777', cursor: 'pointer', fontFamily: 'Poppins-SemiBold', fontSize: '14px', transition: 'all 0.2s' }}>Cancelar</button>
          <button onClick={submit} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#C3666D', color: 'white', cursor: 'pointer', fontFamily: 'Poppins-SemiBold', fontSize: '14px', boxShadow: '0 4px 10px rgba(195, 102, 109, 0.3)', transition: 'all 0.2s' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default AdminProductosTab;