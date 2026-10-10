package com.SweetCreamPink.demoSpringBoot.service;

import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;

public interface UsuarioService {
    Usuario obtenerPerfil(Integer usuarioId);
    Usuario actualizarPerfil(Integer usuarioId, String nombre, String apellido, String telefono);
}