package com.SweetCreamPink.demoSpringBoot.service;

import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;

public interface AuthService {

    /**
     * Crea una nueva cuenta de cliente.
     * @return el Usuario guardado (sin contraseña en texto plano)
     * @throws IllegalArgumentException si el correo ya existe o los datos son inválidos
     */
    Usuario registrar(String nombre, String apellido,
                      String correo, String contrasena, String telefono);

    /**
     * Verifica credenciales y genera un JWT.
     * @return el token JWT listo para enviar al frontend
     * @throws RuntimeException si las credenciales son incorrectas
     */
    String login(String correo, String contrasena);

    /**
     * Genera un token de recuperación y (cuando esté configurado) lo envía por correo.
     */
    void solicitarRecuperacion(String correo);

    /**
     * Valida el token de reset y actualiza la contraseña.
     * @throws RuntimeException si el token es inválido o expiró
     */
    void restablecerContrasena(String token, String nuevaContrasena);
}