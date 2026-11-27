// ─────────────────────────────────────────────────────────────
//  API central de Sweet Cream Rose
//  Unifica la URL base, el token JWT y utilidades compartidas.
// ─────────────────────────────────────────────────────────────

// El backend Spring Boot corre en el puerto 8081 (application.properties)
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

// ── Token / sesión ───────────────────────────────────────────
export const getToken = () => sessionStorage.getItem('token');

export const authHeaders = (json = true) => {
  const h = {};
  if (json) h['Content-Type'] = 'application/json';
  const t = getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
};

// Devuelve el id del usuario logueado leyéndolo del JWT (claim id/uid/sub)
export const getUsuarioId = () => {
  const guardado = sessionStorage.getItem('usuarioId');
  if (guardado) return guardado;
  const t = getToken();
  if (!t) return null;
  try {
    const payload = JSON.parse(atob(t.split('.')[1]));
    const id = payload.id || payload.uid || payload.usuarioId || null;
    if (id) sessionStorage.setItem('usuarioId', id);
    return id;
  } catch {
    return null;
  }
};

export const getRol = () => {
  const r = sessionStorage.getItem('rol');
  if (r) return r;
  const t = getToken();
  if (!t) return null;
  try {
    const payload = JSON.parse(atob(t.split('.')[1]));
    return payload.rol || null;
  } catch {
    return null;
  }
};

// ── Helpers de fetch ─────────────────────────────────────────
export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders(false) });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export async function apiSend(path, method, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(true),
    body: body != null ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* respuesta sin cuerpo */ }
  if (!res.ok) {
    const msg = (data && (data.error || data.mensaje)) || `${method} ${path} -> ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function apiUpload(path, file) {
  const formData = new FormData();
  formData.append('archivo', file);
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(false),
    body: formData,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && (data.error || data.mensaje)) || `POST ${path} -> ${res.status}`);
  }
  return data;
}

export const apiPost   = (p, b) => apiSend(p, 'POST', b);
export const apiPut    = (p, b) => apiSend(p, 'PUT', b);
export const apiDelete = (p)    => apiSend(p, 'DELETE');

export async function apiDownload(path, filename) {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders(false) });
  if (!res.ok) {
    let msg = `GET ${path} -> ${res.status}`;
    try {
      const data = await res.json();
      msg = (data && (data.error || data.mensaje)) || msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ── Favoritos (no hay tabla en el backend → se guardan localmente) ──
const FAV_KEY = 'favoritos';
export const getFavoritos = () => {
  try { return JSON.parse(sessionStorage.getItem(FAV_KEY)) || []; }
  catch { return []; }
};
export const isFavorito = (id) => getFavoritos().some(f => String(f.id) === String(id));
export const toggleFavorito = (producto) => {
  const favs = getFavoritos();
  const idx = favs.findIndex(f => String(f.id) === String(producto.id));
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(producto);
  sessionStorage.setItem(FAV_KEY, JSON.stringify(favs));
  window.dispatchEvent(new Event('favoritosUpdated'));
  return idx < 0; // true si quedó como favorito
};

// ── Carrito helpers ──────────────────────────────────────────
export const notificarCarrito = () => window.dispatchEvent(new Event('cartUpdated'));
