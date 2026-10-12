package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Modelo.Orden.MetodoPagoOrden;
import com.SweetCreamPink.demoSpringBoot.service.OrdenService;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class OrdenController {

    private static final Logger log = LoggerFactory.getLogger(OrdenController.class);

    private final OrdenService service;

    public OrdenController(OrdenService service) {
        this.service = service;
    }

    // ── CREAR ORDEN ──────────────────────────────────────────────────────────
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> crearOrden(@PathVariable Integer usuarioId,
                                        @RequestBody Map<String, Object> body) {
        try {
            String metodoPagoRaw = body.get("metodoPago") != null ? body.get("metodoPago").toString() : null;
            String tipoEntregaRaw = body.get("tipoEntrega") != null ? body.get("tipoEntrega").toString() : null;

            // Metodo de pago: debe ser uno válido — si no, devolvemos 400
            MetodoPagoOrden metodoPago;
            try {
                metodoPago = metodoPagoRaw != null ? MetodoPagoOrden.valueOf(metodoPagoRaw) : null;
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body(Map.of("error", "Método de pago inválido. Use: Efectivo, Transferencia, Tarjeta o Yape"));
            }

            // Tipo de entrega: aceptamos valores inválidos y aplicamos default 'Recojo'
            Orden.TipoEntrega tipoEntrega = Orden.TipoEntrega.Recojo;
            if (tipoEntregaRaw != null) {
                try {
                    tipoEntrega = Orden.TipoEntrega.valueOf(tipoEntregaRaw);
                } catch (IllegalArgumentException ignored) {
                    tipoEntrega = Orden.TipoEntrega.Recojo;
                }
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> detalles =
                    (List<Map<String, Object>>) body.get("detalles");

            // Costo de envío elegido en el checkout (opcional, default 0.0)
            Double costoEnvio = 0.0;
            if (body.get("costoEnvio") != null) {
                try { costoEnvio = Double.valueOf(body.get("costoEnvio").toString()); }
                catch (NumberFormatException ignored) { costoEnvio = 0.0; }
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> comprobante = body.get("comprobante") instanceof Map
                    ? (Map<String, Object>) body.get("comprobante") : null;

            Orden orden = service.crearOrden(
                    usuarioId,
                    (String) body.get("direccionEntrega"),
                    metodoPago,
                    tipoEntrega,
                    detalles,
                    costoEnvio,
                    comprobante
            );
            return ResponseEntity.ok(orden);

        } catch (RuntimeException e) {
            log.error("Error creando orden para usuarioId={}: {}", usuarioId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Ocurrió un error al crear la orden. Revisa los logs del servidor."));
        }
    }

    // ── HISTORIAL ────────────────────────────────────────────────────────────
    @GetMapping("/usuario/{usuarioId}/historial")
    public ResponseEntity<List<Orden>> historial(@PathVariable Integer usuarioId) {
        return ResponseEntity.ok(service.historial(usuarioId));
    }

    // ── DETALLE DE UNA ORDEN ─────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(service.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ── EXPORTAR HISTORIAL A EXCEL ───────────────────────────────────────────
    /**
     * Genera y descarga un archivo .xlsx con todo el historial de pedidos
     * del cliente. Usa Apache POI en la capa de servicio.
     */
    @GetMapping("/usuario/{usuarioId}/exportar")
    public ResponseEntity<byte[]> exportarExcel(@PathVariable Integer usuarioId) {
        try {
            ByteArrayOutputStream out = service.exportarHistorialExcel(usuarioId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment",
                    "historial-pedidos-" + usuarioId + ".xlsx");

            log.info("Exportando historial Excel para usuarioId: {}", usuarioId);
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(out.toByteArray());

        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
