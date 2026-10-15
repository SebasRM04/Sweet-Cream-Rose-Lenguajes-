package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Modelo.DetalleOrden;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OrdenRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/ventas")
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class AdminVentasController {

    @Autowired
    private OrdenRepository ordenRepository;

    @GetMapping("/mes")
    public ResponseEntity<?> ventasMes() {
        YearMonth mes        = YearMonth.now();
        LocalDateTime inicio = mes.atDay(1).atStartOfDay();
        LocalDateTime fin    = mes.atEndOfMonth().atTime(23, 59, 59);
        return ResponseEntity.ok(construirResumen(inicio, fin, "mes"));
    }

    @GetMapping("/semana")
    public ResponseEntity<?> ventasSemana() {
        LocalDateTime ahora  = LocalDateTime.now();
        int diasDesdeLunes   = ahora.getDayOfWeek().getValue() - 1;
        LocalDateTime inicio = ahora.minusDays(diasDesdeLunes).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime fin    = inicio.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        return ResponseEntity.ok(construirResumen(inicio, fin, "semana"));
    }

    @GetMapping("/anio")
    public ResponseEntity<?> ventasAnio() {
        int anio             = LocalDateTime.now().getYear();
        LocalDateTime inicio = LocalDateTime.of(anio, 1, 1, 0, 0, 0);
        LocalDateTime fin    = LocalDateTime.of(anio, 12, 31, 23, 59, 59);
        return ResponseEntity.ok(construirResumen(inicio, fin, "año"));
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Orden>> todasLasVentas() {
        List<Orden> ordenes = ordenRepository.findAll();
        ordenes.sort((a, b) -> {
            if (a.getFecha() == null) return 1;
            if (b.getFecha() == null) return -1;
            return b.getFecha().compareTo(a.getFecha());
        });
        return ResponseEntity.ok(ordenes);
    }

    @GetMapping("/rango")
    public ResponseEntity<?> ventasRango(
            @RequestParam String desde,
            @RequestParam String hasta) {
        try {
            DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;
            LocalDateTime inicio  = java.time.LocalDate.parse(desde, fmt).atStartOfDay();
            LocalDateTime fin     = java.time.LocalDate.parse(hasta, fmt).atTime(23, 59, 59);
            return ResponseEntity.ok(construirResumen(inicio, fin, "rango " + desde + " → " + hasta));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("mensaje", "Formato de fecha inválido. Use: YYYY-MM-DD"));
        }
    }

    private Map<String, Object> construirResumen(LocalDateTime inicio, LocalDateTime fin, String tipo) {
        // findByFechaBetween
        List<Orden> ordenes = ordenRepository.findByFechaBetween(inicio, fin);

        List<Orden> validas = ordenes.stream()
            .filter(o -> Orden.EstadoOrden.Cancelado != o.getEstado())
            .collect(Collectors.toList());

        BigDecimal total = validas.stream()
            .map(o -> BigDecimal.valueOf(o.getTotal() != null ? o.getTotal() : 0.0))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ── ventasPorDia: valores y labels (fechas) ──────────────────────────
        DateTimeFormatter diaFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter labelFmt = DateTimeFormatter.ofPattern("d MMM");
        Map<String, Double> porDiaMap = new TreeMap<>();
        for (Orden o : validas) {
            if (o.getFecha() != null) {
                String dia = o.getFecha().format(diaFmt);
                porDiaMap.merge(dia, o.getTotal() != null ? o.getTotal() : 0.0, Double::sum);
            }
        }
        List<String> ventasPorDiaLabels = new ArrayList<>(porDiaMap.keySet()).stream()
            .map(d -> {
                try {
                    return java.time.LocalDate.parse(d).format(labelFmt);
                } catch (Exception e) {
                    return d;
                }
            })
            .collect(Collectors.toList());
        List<Double> ventasPorDia = new ArrayList<>(porDiaMap.values());
        if (ventasPorDia.isEmpty()) {
            ventasPorDia = Arrays.asList(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
            ventasPorDiaLabels = Arrays.asList("Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7", "Día 8");
        }

        // ── productosVendidos (total de unidades, no de órdenes) ─────────────
        int totalProductosVendidos = 0;
        for (Orden o : validas) {
            if (o.getDetalles() == null) continue;
            for (DetalleOrden d : o.getDetalles()) {
                totalProductosVendidos += (d.getCantidad() != null ? d.getCantidad() : 0);
            }
        }

        // ── ventasPorCategoria (para gráfico circular) ───────────────────────
        Map<String, Double> totalPorCategoria = new LinkedHashMap<>();
        for (Orden o : validas) {
            if (o.getDetalles() == null) continue;
            for (DetalleOrden d : o.getDetalles()) {
                if (d.getProducto() == null) continue;
                String nombreCat = (d.getProducto().getCategoria() != null
                        && d.getProducto().getCategoria().getDescripcion() != null)
                        ? d.getProducto().getCategoria().getDescripcion()
                        : "Otros";
                double subtotal = d.getSubTotal() != null ? d.getSubTotal() : 0.0;
                totalPorCategoria.merge(nombreCat, subtotal, Double::sum);
            }
        }

        String[] paletaColores = {"#F194B4", "#9B59B6", "#F2C94C", "#27AE60", "#6A8BBD", "#C6676D"};
        double totalCategorias = totalPorCategoria.values().stream().mapToDouble(Double::doubleValue).sum();

        List<Map<String, Object>> ventasPorCategoria = new ArrayList<>();
        int idxColor = 0;
        for (Map.Entry<String, Double> e : totalPorCategoria.entrySet()) {
            double pct = totalCategorias > 0 ? Math.round((e.getValue() / totalCategorias) * 100.0) : 0;
            Map<String, Object> cat = new LinkedHashMap<>();
            cat.put("nombre", e.getKey());
            cat.put("pct", pct);
            cat.put("color", paletaColores[idxColor % paletaColores.length]);
            cat.put("monto", Math.round(e.getValue() * 100.0) / 100.0);
            ventasPorCategoria.add(cat);
            idxColor++;
        }

        // Si no hay categorías, devolver datos por defecto
        if (ventasPorCategoria.isEmpty()) {
            ventasPorCategoria.addAll(defaultCategorias());
        }

        // ── desglosePorCategoria (para AdminMenu8.js - Ganancias) ────────────
        // Reutiliza ventasPorCategoria con campos adicionales (monto, pct)
        List<Map<String, Object>> desglosePorCategoria = new ArrayList<>();
        double margenEstimado = 0.60; // 60% de margen de ganancia estimado
        for (Map<String, Object> cat : ventasPorCategoria) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("nombre", cat.get("nombre"));
            item.put("pct", cat.get("pct"));
            item.put("color", cat.get("color"));
            item.put("monto", cat.get("monto"));
            desglosePorCategoria.add(item);
        }
        if (desglosePorCategoria.isEmpty()) {
            desglosePorCategoria.addAll(defaultDesglose());
        }

        // ── categorias (tabla detallada de AdminMenu8.js) ────────────────────
        List<Map<String, Object>> categorias = new ArrayList<>();
        for (Map.Entry<String, Double> e : totalPorCategoria.entrySet()) {
            Map<String, Object> catRow = new LinkedHashMap<>();
            String nombre = e.getKey();
            double ingresosCat = e.getValue();
            double costosCat = ingresosCat * (1 - margenEstimado);
            double gananciaCat = ingresosCat * margenEstimado;
            double margenCatPct = ingresosCat > 0 ? Math.round(margenEstimado * 100) : 0;

            catRow.put("nombre", nombre);
            catRow.put("ingresos", Math.round(ingresosCat * 100.0) / 100.0);
            catRow.put("costos", Math.round(costosCat * 100.0) / 100.0);
            catRow.put("ganancia", Math.round(gananciaCat * 100.0) / 100.0);
            catRow.put("margen", margenCatPct);
            categorias.add(catRow);
        }

        // ── listaVentas (para tabla de AdminMenu4.js) ────────────────────────
        List<Map<String, Object>> listaVentas = ordenes.stream().map(o -> {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("id", o.getId());
            String cliente = "Cliente";
            if (o.getUsuario() != null) {
                String nombre   = o.getUsuario().getNombre()   != null ? o.getUsuario().getNombre()   : "";
                String apellido = o.getUsuario().getApellido() != null ? o.getUsuario().getApellido() : "";
                cliente = (nombre + " " + apellido).trim();
                if (cliente.isBlank()) cliente = o.getUsuario().getCorreo();
            }
            fila.put("cliente", cliente);
            fila.put("total", o.getTotal() != null ? o.getTotal() : 0.0);
            fila.put("estado", o.getEstado() != null ? o.getEstado().name() : "Pendiente");
            fila.put("fecha", o.getFecha());
            fila.put("codigo", o.getCodigoSeguimiento());
            fila.put("metodoPago", o.getMetodoPago() != null ? o.getMetodoPago().name() : null);
            fila.put("tipoEntrega", o.getTipoEntrega() != null ? o.getTipoEntrega().name() : null);
            fila.put("comprobante", o.getComprobanteTipo());
            return fila;
        }).collect(Collectors.toList());

        Map<String, Object> resultado = new LinkedHashMap<>();
        resultado.put("tipo",              tipo);
        resultado.put("desde",             inicio.toLocalDate().toString());
        resultado.put("hasta",             fin.toLocalDate().toString());
        resultado.put("totalOrdenes",      ordenes.size());
        resultado.put("ordenesValidas",    validas.size());
        resultado.put("ordenesCanceladas", ordenes.size() - validas.size());
        resultado.put("totalIngresos",     total);
        resultado.put("ventasPorDia",      ventasPorDia);
        resultado.put("ventasPorDiaLabels", ventasPorDiaLabels);
        resultado.put("ventasPorCategoria", ventasPorCategoria);
        resultado.put("listaVentas",       listaVentas);
        resultado.put("desglosePorCategoria", desglosePorCategoria);
        resultado.put("categorias",        categorias);
        resultado.put("productosVendidos", totalProductosVendidos);

        return resultado;
    }

    private List<Map<String, Object>> defaultCategorias() {
        List<Map<String, Object>> def = new ArrayList<>();
        def.add(Map.of("nombre", "Tortas clásicas", "pct", 0, "color", "#F194B4", "monto", 0.0));
        def.add(Map.of("nombre", "Cupcakes", "pct", 0, "color", "#9B59B6", "monto", 0.0));
        def.add(Map.of("nombre", "Alfajores", "pct", 0, "color", "#F2C94C", "monto", 0.0));
        def.add(Map.of("nombre", "Trufas", "pct", 0, "color", "#27AE60", "monto", 0.0));
        def.add(Map.of("nombre", "Otros", "pct", 0, "color", "#C6676D", "monto", 0.0));
        return def;
    }

    private List<Map<String, Object>> defaultDesglose() {
        List<Map<String, Object>> def = new ArrayList<>();
        def.add(Map.of("nombre", "Productos de pastelería", "monto", 0.0, "pct", 0, "color", "#F194B4"));
        def.add(Map.of("nombre", "Bebidas y extras", "monto", 0.0, "pct", 0, "color", "#F2C94C"));
        def.add(Map.of("nombre", "Personalizados", "monto", 0.0, "pct", 0, "color", "#D7BDE2"));
        return def;
    }
}
