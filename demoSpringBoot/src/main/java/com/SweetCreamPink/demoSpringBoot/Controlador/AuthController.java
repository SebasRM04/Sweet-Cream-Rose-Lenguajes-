package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── REGISTRO ─────────────────────────────────────────────────────────────
    @PostMapping({"/registro", "/registrar"})
    public ResponseEntity<?> registrar(@RequestBody Map<String, String> body) {
        try {
            Usuario nuevo = authService.registrar(
                    body.get("nombre"),
                    body.get("apellido"),
                    body.get("correo"),
                    body.get("contrasena"),
                    body.get("telefono")
            );
            // No devolver la contraseña en la respuesta
            nuevo.setContrasena(null);
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String token = authService.login(body.get("correo"), body.get("contrasena"));
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            log.warn("Login fallido: {}", e.getMessage());
            // Mensaje genérico para no revelar si el correo existe
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }
    }

    // ── OLVIDÉ MI CONTRASEÑA ──────────────────────────────────────────────────
    /**
     * Siempre responde 200 OK aunque el correo no exista,
     * para evitar enumeración de usuarios (seguridad).
     */
    @PostMapping("/olvide-contrasena")
    public ResponseEntity<?> olvideContrasena(@RequestBody Map<String, String> body) {
        authService.solicitarRecuperacion(body.get("correo"));
        return ResponseEntity.ok(Map.of(
                "mensaje",
                "Si ese correo está registrado, recibirás un enlace de recuperación en breve."
        ));
    }

    // ── RESTABLECER CONTRASEÑA ─────────────────────────────────────────────────
    @PostMapping("/restablecer-contrasena")
    public ResponseEntity<?> restablecerContrasena(@RequestBody Map<String, String> body) {
        try {
            authService.restablecerContrasena(
                    body.get("token"),
                    body.get("nuevaContrasena")
            );
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada exitosamente."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
