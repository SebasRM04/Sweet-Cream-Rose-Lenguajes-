package com.SweetCreamPink.demoSpringBoot.Seguridad;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Utilidad JWT — genera, parsea y valida tokens.
 *
 * Principio SRP: esta clase SOLO gestiona lógica JWT.
 * Usa Logback para registrar intentos inválidos.
 */

// La clave secreta y tiempos de expiración vienen de application.properties.

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secret;          //? clave para firmar los tokens

    @Value("${jwt.expiration}")
    private long expirationMs;      //? duración del token de login

    @Value("${jwt.reset-expiration}")
    private long resetExpirationMs; //? duración del token de reset contraseña 

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    //* genera token de autenticación (se devuelve al frontend en el login)
    public String generarToken(String correo, String rol) {
        return Jwts.builder()
                .setSubject(correo)       //* el "usuario" del token es el correo
                .claim("rol", rol)        //* se guarda el rol para saber si es ADMIN o CLIENTE
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //*gGenera token de recuperación de contraseña
    public String generarTokenReset(String correo) {
        return Jwts.builder()
                .setSubject(correo)
                .claim("tipo", "RESET")   //* marca especial para distinguirlo del token de login
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + resetExpirationMs))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //* extrae el correo del subject del toke
    public String extraerCorreo(String token) {
        return parsear(token).getBody().getSubject();
    }

    //* devuelve true si el token es válido y no expiró
    public boolean esValido(String token) {
        try {
            parsear(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("Token JWT expirado: {}", e.getMessage());
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token JWT inválido: {}", e.getMessage());
        }
        return false;
    }

    private Jws<Claims> parsear(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token);
    }

    
}