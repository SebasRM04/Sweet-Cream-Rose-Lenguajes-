package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.DTO.PerfilUsuarioDTO;
import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;
import com.SweetCreamPink.demoSpringBoot.service.UsuarioService;

import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class PerfilController {

    private final UsuarioService    service;
    private final UsuarioRepository usuarioRepository;

    public PerfilController(UsuarioService service, UsuarioRepository usuarioRepository) {
        this.service             = service;
        this.usuarioRepository   = usuarioRepository;
    }

    // ── GET /api/perfil/me ────────────────────────────────────────────────────
    /**
     * Devuelve el perfil del usuario autenticado usando el JWT del header.
     * El frontend puede llamar esto en cualquier momento para obtener el id y nombre.
     */
    @GetMapping("/me")
    public ResponseEntity<?> miPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null)
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));

        Optional<Usuario> opt = usuarioRepository.findByCorreo(userDetails.getUsername());
        if (opt.isEmpty())
            return ResponseEntity.notFound().build();

        // FIX: antes se devolvía la entidad Usuario directamente
        // (u.setContrasena(null); return ResponseEntity.ok(u);).
        // Usuario tiene @OneToMany lazy (direcciones, metodosPago, ordenes)
        // que Jackson no puede serializar fuera de la sesión de Hibernate
        // -> HttpMessageNotWritableException -> 500.
        // Ahora se devuelve un DTO plano con solo los campos del perfil.
        Usuario u = opt.get();
        return ResponseEntity.ok(PerfilUsuarioDTO.fromEntity(u));
    }

    // ── GET /api/perfil/correo/{correo} ───────────────────────────────────────
    /**
     * permite al frontend obtener el ID del usuario a partir del correo
     * que viene en el payload del JWT, justo después del login.
     * Solo devuelve id, nombre, apellido, correo y rol (sin contraseña).
     */
    @GetMapping("/correo/{correo}")
    public ResponseEntity<?> perfilPorCorreo(@PathVariable String correo,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        // Seguridad: solo se puede consultar el propio perfil
        if (userDetails == null || !userDetails.getUsername().equalsIgnoreCase(correo))
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado"));

        Optional<Usuario> opt = usuarioRepository.findByCorreo(correo);
        if (opt.isEmpty())
            return ResponseEntity.notFound().build();

        Usuario u = opt.get();
        // Devolver solo campos necesarios
        return ResponseEntity.ok(Map.of(
            "id",       u.getId(),
            "nombre",   u.getNombre() != null ? u.getNombre() : "",
            "apellido", u.getApellido() != null ? u.getApellido() : "",
            "correo",   u.getCorreo(),
            "telefono", u.getTelefono() != null ? u.getTelefono() : "",
            "rol",      u.getRol() != null ? u.getRol().getDescripcion().toUpperCase() : "CLIENTE"
        ));
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<?> obtener(@PathVariable Integer usuarioId,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario u = service.obtenerPerfil(usuarioId);
            // FIX: devolver DTO en vez de la entidad completa (evita
            // HttpMessageNotWritableException por colecciones lazy)
            return ResponseEntity.ok(PerfilUsuarioDTO.fromEntity(u));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{usuarioId}")
    public ResponseEntity<?> actualizar(@PathVariable Integer usuarioId,
                                        @RequestBody Map<String, String> body,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario actualizado = service.actualizarPerfil(
                    usuarioId,
                    body.get("nombre"),
                    body.get("apellido"),
                    body.get("telefono")
            );
            // FIX: devolver DTO en vez de la entidad completa (evita
            // HttpMessageNotWritableException por colecciones lazy)
            return ResponseEntity.ok(PerfilUsuarioDTO.fromEntity(actualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}