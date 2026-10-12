package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Modelo.Comentario;
import com.SweetCreamPink.demoSpringBoot.service.ComentarioService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ComentarioController {

    private final ComentarioService service;

    public ComentarioController(ComentarioService service) {
        this.service = service;
    }

    // ── PÚBLICOS ─────────────────────────────────────────────────────────────
    @GetMapping("/aprobados")
    public ResponseEntity<List<Comentario>> aprobados() {
        return ResponseEntity.ok(service.listarAprobados());
    }

    @GetMapping("/aprobados/producto/{productoId}")
    public ResponseEntity<List<Comentario>> aprobadosPorProducto(
            @PathVariable Integer productoId) {
        return ResponseEntity.ok(service.listarAprobadosPorProducto(productoId));
    }

    // ── CLIENTE AUTENTICADO ───────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> body) {
        try {
            Integer usuarioId    = body.get("usuarioId")    != null
                    ? (Integer) body.get("usuarioId") : null;
            Integer productoId   = body.get("productoId")   != null
                    ? (Integer) body.get("productoId") : null;
            Integer calificacion = body.get("calificacion") != null
                    ? (Integer) body.get("calificacion") : null;

            Comentario nuevo = service.crear(
                    usuarioId,
                    productoId,
                    (String) body.get("contenido"),
                    (String) body.get("nombre"),
                    calificacion
            );
            return ResponseEntity.ok(Map.of(
                    "id",      nuevo.getId(),
                    "mensaje", "Comentario enviado. Será visible tras la aprobación del administrador."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── ADMIN ─────────────────────────────────────────────────────────────────
    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Comentario>> pendientes() {
        return ResponseEntity.ok(service.listarPendientes());
    }

    @PutMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> aprobar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.aprobar(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            service.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Comentario eliminado."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}