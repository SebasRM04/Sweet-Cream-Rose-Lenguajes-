import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';
import RecuperarSolicitar from './pages/auth/RecuperarSolicitar';
import RecuperarRevisarCorreo from './pages/auth/RecuperarRevisarCorreo';
import RecuperarNuevaContrasena from './pages/auth/RecuperarNuevaContrasena';
import RecuperarExito from './pages/auth/RecuperarExito';
import PerfilPanel from './pages/perfil/PerfilPanel';
import AdminPanel from './pages/admin/AdminPanel';
import AdminLoginGate from './pages/auth/AdminLoginGate'; // <-- NUEVO
// Productos
import Productos from './pages/tienda/Productos';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/"          element={<App />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/registro"  element={<Registro />} />
      <Route path="/perfil"    element={<PerfilPanel />} />
      <Route path="/cambiar-password-1" element={<RecuperarSolicitar />} />
      <Route path="/cambiar-password-2" element={<RecuperarRevisarCorreo />} />
      {/* RecuperarNuevaContrasena acepta ?token=XXX en la URL (enlace del correo) */}
      <Route path="/cambiar-password-3" element={<RecuperarNuevaContrasena />} />
      <Route path="/cambiar-password-4" element={<RecuperarExito />} />
      <Route path="/productos" element={<Productos />} />
      {/* AdminPanel va envuelto en el login de admin */}
      <Route path="/adminmenu" element={<AdminLoginGate><AdminPanel /></AdminLoginGate>} />
    </Routes>
  </BrowserRouter>
);