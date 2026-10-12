package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Modelo.MetodoPago;
import com.SweetCreamPink.demoSpringBoot.Modelo.MetodoPago.TipoPago;
import com.SweetCreamPink.demoSpringBoot.service.MetodoPagoService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metodos-pago")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class MetodoPagoController {

    private final MetodoPagoService service;

    public MetodoPagoController(MetodoPagoService service) {
        this.service = service;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<MetodoPago>> listar(@PathVariable Integer usuarioId) {
        return ResponseEntity.ok(service.listar(usuarioId));
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> agregar(@PathVariable Integer usuarioId,
                                     @RequestBody Map<String, Object> body) {
        try {
            TipoPago tipo = TipoPago.valueOf((String) body.get("tipo"));
            MetodoPago nuevo = service.agregar(
                    usuarioId, tipo,
                    (String) body.get("alias"),
                    (String) body.get("ultimosDigitos"),
                    (String) body.get("titular"),
                    (String) body.get("banco"),
                    Boolean.TRUE.equals(body.get("esPrincipal"))
            );
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Tipo inválido. Use: VISA, BANCO o YAPE"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                      @PathVariable Integer usuarioId) {
        try {
            service.eliminar(id, usuarioId);
            return ResponseEntity.ok(Map.of("mensaje", "Método de pago eliminado."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}