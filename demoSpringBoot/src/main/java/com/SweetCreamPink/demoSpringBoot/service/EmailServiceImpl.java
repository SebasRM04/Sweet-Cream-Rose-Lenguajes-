package com.SweetCreamPink.demoSpringBoot.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remitente;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void enviarCorreoRecuperacion(String destinatario, String enlaceRecuperacion) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(remitente);
            mensaje.setTo(destinatario);
            mensaje.setSubject("Sweet Cream Rose - Recupera tu contraseña");
            mensaje.setText(
                "Hola,\n\n" +
                "Recibimos una solicitud para restablecer tu contraseña en Sweet Cream Rose.\n\n" +
                "Haz clic en el siguiente enlace para crear una nueva contraseña " +
                "(válido por 15 minutos):\n\n" +
                enlaceRecuperacion + "\n\n" +
                "Si tú no solicitaste este cambio, puedes ignorar este correo; " +
                "tu contraseña actual seguirá siendo válida.\n\n" +
                "— Equipo Sweet Cream Rose"
            );

            mailSender.send(mensaje);
            log.info("Correo de recuperación enviado a: {}", destinatario);
        } catch (Exception e) {
            // No relanzamos la excepción: solicitarRecuperacion() nunca debe revelar
            // si el envío falló (evita enumeración de usuarios y no rompe el flujo 200 OK).
            log.error("Error al enviar correo de recuperación a {}", destinatario, e);
        }
    }
}