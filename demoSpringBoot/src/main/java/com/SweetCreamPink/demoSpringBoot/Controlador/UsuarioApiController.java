package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.DTO.PerfilUsuarioDTO;
import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;
import com.SweetCreamPink.demoSpringBoot.Seguridad.JwtUtil;
import com.SweetCreamPink.demoSpringBoot.service.AuthService;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class UsuarioApiController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public UsuarioApiController(UsuarioRepository usuarioRepo,
                                PasswordEncoder passwordEncoder,
                                AuthService authService,
                                JwtUtil jwtUtil) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.authService     = authService;
        this.jwtUtil         = jwtUtil;
    }

    // ── REGISTRO ──────────────────────────────────────────────────────────────
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Map<String, String> body) {
        try {
            Usuario guardado = authService.registrar(
                    body.get("nombre"),
                    body.get("apellido"),
                    body.get("correo"),
                    body.get("contrasena"),
                    body.get("telefono")
            );
            // fechaRegistro ya se asignó automáticamente con @PrePersist
            // FIX: devolver DTO en vez de la entidad completa (evita
            // HttpMessageNotWritableException por colecciones lazy
            // direcciones/metodosPago/ordenes sin sesión activa)
            return ResponseEntity.ok(PerfilUsuarioDTO.fromEntity(guardado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Usuario loginData) {
        Optional<Usuario> userOpt = usuarioRepo.findByCorreo(loginData.getCorreo());

        if (userOpt.isPresent() &&
                passwordEncoder.matches(loginData.getContrasena(), userOpt.get().getContrasena())) {
            Usuario u = userOpt.get();
            String token = jwtUtil.generarToken(
                u.getCorreo(),
                u.getRol() != null ? u.getRol().getDescripcion().toUpperCase() : "CLIENTE"
            );
            // FIX: devolver DTO en vez de la entidad completa (evita
            // HttpMessageNotWritableException por colecciones lazy
            // direcciones/metodosPago/ordenes sin sesión activa)
            return ResponseEntity.ok(Map.of(
                "token", token,
                "usuario", PerfilUsuarioDTO.fromEntity(u)
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }
    }

    // ── VER PERFIL ────────────────────────────────────────────────────────────
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(@RequestHeader("Authorization") String authHeader) {
        try {
            String token  = authHeader.replace("Bearer ", "");
            String correo = jwtUtil.extraerCorreo(token);

            Usuario u = usuarioRepo.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // FIX: antes se devolvía `u` directamente (ResponseEntity.ok(u)).
            // Usuario.java tiene @OneToMany lazy (direcciones, metodosPago,
            // ordenes). Al serializar fuera de la sesión de Hibernate,
            // Jackson lanzaba:
            //   HttpMessageNotWritableException: Could not write JSON:
            //   failed to lazily initialize a collection of role:
            //   ...Usuario.direcciones: could not initialize proxy - no Session
            // -> esto causaba el 500 y por eso el perfil llegaba vacío.
            // Ahora devolvemos un DTO plano con solo los campos del perfil.
            return ResponseEntity.ok(PerfilUsuarioDTO.fromEntity(u));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido"));
        }
    }

    // ── EDITAR PERFIL ─────────────────────────────────────────────────────────
    // Campos que el usuario PUEDE editar: telefono, fechaNacimiento, genero
    // Campos que NO se pueden editar aquí:  nombre, apellido, correo, fechaRegistro
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(@RequestHeader("Authorization") String authHeader,
                                               @RequestBody Map<String, String> body) {
        try {
            String token  = authHeader.replace("Bearer ", "");
            String correo = jwtUtil.extraerCorreo(token);

            Usuario u = usuarioRepo.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // ── Campos editables ──────────────────────────────────────────────
            if (body.containsKey("telefono"))
                u.setTelefono(body.get("telefono"));

            if (body.containsKey("fechaNacimiento") && body.get("fechaNacimiento") != null
                    && !body.get("fechaNacimiento").isBlank()) {
                u.setFechaNacimiento(LocalDate.parse(body.get("fechaNacimiento")));
            }

            if (body.containsKey("genero") && body.get("genero") != null
                    && !body.get("genero").isBlank()) {
                u.setGenero(body.get("genero"));
            }

            // ── nombre y apellido: NO se modifican aquí (vienen del registro) ─
            // ── correo: NO se modifica aquí ───────────────────────────────────
            // ── fechaRegistro: NO se modifica nunca (@updatable = false) ──────

            Usuario actualizado = usuarioRepo.save(u);

            // FIX: devolver DTO en vez de la entidad completa (evita
            // HttpMessageNotWritableException por colecciones lazy)
            return ResponseEntity.ok(PerfilUsuarioDTO.fromEntity(actualizado));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}