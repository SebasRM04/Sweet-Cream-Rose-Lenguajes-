package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OrdenRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/pedidos")
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPedidosController {

    @Autowired
    private OrdenRepository ordenRepository;

    @GetMapping
    public ResponseEntity<List<Orden>> listarTodos() {
        List<Orden> ordenes = ordenRepository.findAll();
        ordenes.sort((a, b) -> {
            if (a.getFecha() == null) return 1;
            if (b.getFecha() == null) return -1;
            return b.getFecha().compareTo(a.getFecha());
        });
        return ResponseEntity.ok(ordenes);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Orden>> listarPorEstado(@PathVariable String estado) {
        // Convertir String a enum y usar findByEstado
        try {
            Orden.EstadoOrden estadoEnum = Orden.EstadoOrden.valueOf(estado);
            return ResponseEntity.ok(ordenRepository.findByEstado(estadoEnum));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Integer id) {
        Optional<Orden> opt = ordenRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(opt.get());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {

        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("mensaje", "El campo 'estado' es requerido"));
        }

        // Validar convirtiendo a enum directamente
        Orden.EstadoOrden estadoEnum;
        try {
            estadoEnum = Orden.EstadoOrden.valueOf(nuevoEstado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "mensaje", "Estado inválido. Valores permitidos: Pendiente, Confirmada, Completada, Cancelado"
            ));
        }

        Optional<Orden> opt = ordenRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Orden orden = opt.get();
        orden.setEstado(estadoEnum);
        ordenRepository.save(orden);

        return ResponseEntity.ok(Map.of(
            "mensaje",     "Estado actualizado correctamente",
            "ordId",       id,
            "estadoNuevo", nuevoEstado
        ));
    }
}