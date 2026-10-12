package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.DTO.DireccionDTO;
import com.SweetCreamPink.demoSpringBoot.Modelo.Direccion;
import com.SweetCreamPink.demoSpringBoot.service.DireccionService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/direcciones")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class DireccionController {

    private final DireccionService service;

    public DireccionController(DireccionService service) {
        this.service = service;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<DireccionDTO>> listar(@PathVariable Integer usuarioId) {
        List<DireccionDTO> dtos = service.listar(usuarioId).stream()
                .map(DireccionDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> agregar(@PathVariable Integer usuarioId,
                                     @RequestBody Map<String, Object> body) {
        try {
            Direccion nueva = service.agregar(
                    usuarioId,
                    (String)  body.get("direccion"),
                    (String)  body.get("distrito"),
                    (String)  body.get("ciudad"),
                    (String)  body.get("codigoPostal"),
                    (String)  body.get("referencia"),
                    Boolean.TRUE.equals(body.get("esPrincipal"))
            );
            return ResponseEntity.ok(DireccionDTO.fromEntity(nueva));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @PathVariable Integer usuarioId,
                                        @RequestBody Map<String, Object> body) {
        try {
            Direccion actualizada = service.actualizar(
                    id, usuarioId,
                    (String) body.get("direccion"),
                    (String) body.get("distrito"),
                    (String) body.get("ciudad"),
                    (String) body.get("codigoPostal"),
                    (String) body.get("referencia"),
                    Boolean.TRUE.equals(body.get("esPrincipal"))
            );
            return ResponseEntity.ok(DireccionDTO.fromEntity(actualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                      @PathVariable Integer usuarioId) {
        try {
            service.eliminar(id, usuarioId);
            return ResponseEntity.ok(Map.of("mensaje", "Dirección eliminada correctamente."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}