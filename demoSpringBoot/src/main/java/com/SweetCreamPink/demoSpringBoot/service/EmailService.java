package com.SweetCreamPink.demoSpringBoot.service;

public interface EmailService {

    /**
     * Envía el correo de recuperación de contraseña con el enlace que contiene el token.
     * @param destinatario correo del usuario
     * @param enlaceRecuperacion URL completa con el token (ej: http://localhost:3000/cambiar-password-3?token=XXX)
     */
    void enviarCorreoRecuperacion(String destinatario, String enlaceRecuperacion);
}