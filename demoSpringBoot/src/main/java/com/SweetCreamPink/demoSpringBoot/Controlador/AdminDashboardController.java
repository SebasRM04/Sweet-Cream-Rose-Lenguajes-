package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.DTO.AdminDTOs;
import com.SweetCreamPink.demoSpringBoot.Modelo.DetalleOrden;
import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Modelo.Producto;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OrdenRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.ProductoRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired private OrdenRepository    ordenRepository;
    @Autowired private UsuarioRepository  usuarioRepository;
    @Autowired private ProductoRepository productoRepository;

    @GetMapping
    public ResponseEntity<AdminDTOs.DashboardResumen> getDashboard() {
        AdminDTOs.DashboardResumen resumen = new AdminDTOs.DashboardResumen();

        YearMonth mesActual  = YearMonth.now();
        LocalDateTime inicio = mesActual.atDay(1).atStartOfDay();
        LocalDateTime fin    = mesActual.atEndOfMonth().atTime(23, 59, 59);
        List<Orden> ordenesMes = ordenRepository.findByFechaBetween(inicio, fin);

        resumen.setTotalOrdenesMes(ordenesMes.size());
        resumen.setTotalPedidos(ordenRepository.count());
        resumen.setOrdenesPendientes(
            ordenesMes.stream().filter(o -> Orden.EstadoOrden.Pendiente == o.getEstado()).count());
        resumen.setOrdenesConfirmadas(
            ordenesMes.stream().filter(o -> Orden.EstadoOrden.Confirmada == o.getEstado()).count());
        resumen.setOrdenesCompletadas(
            ordenesMes.stream().filter(o -> Orden.EstadoOrden.Completada == o.getEstado()).count());
        resumen.setOrdenesCanceladas(
            ordenesMes.stream().filter(o -> Orden.EstadoOrden.Cancelado == o.getEstado()).count());

        BigDecimal ingresos = ordenesMes.stream()
            .filter(o -> Orden.EstadoOrden.Cancelado != o.getEstado())
            .map(o -> BigDecimal.valueOf(o.getTotal() != null ? o.getTotal() : 0.0))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        resumen.setIngresosMes(ingresos);

        java.time.LocalDate hoy = java.time.LocalDate.now();
        List<Orden> ordenesHoy = ordenesMes.stream()
            .filter(o -> o.getFecha() != null && o.getFecha().toLocalDate().equals(hoy)
                      && Orden.EstadoOrden.Cancelado != o.getEstado())
            .toList();
        resumen.setOrdenesHoy(ordenesHoy.size());
        resumen.setIngresosHoy(ordenesHoy.stream()
            .map(o -> BigDecimal.valueOf(o.getTotal() != null ? o.getTotal() : 0.0))
            .reduce(BigDecimal.ZERO, BigDecimal::add));

        resumen.setTotalClientes(usuarioRepository.count());
        resumen.setTotalProductos(productoRepository.count());

        LocalDateTime ahora = LocalDateTime.now();
        int diasDesdeLunes = ahora.getDayOfWeek().getValue() - 1;
        LocalDateTime inicioSemana = ahora.toLocalDate().minusDays(diasDesdeLunes).atStartOfDay();
        LocalDateTime finSemana = inicioSemana.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        List<Orden> ordenesSemana = ordenRepository.findByFechaBetween(inicioSemana, finSemana);

        double[] ventasSemanaArr = new double[7];
        for (Orden o : ordenesSemana) {
            if (o.getFecha() == null || o.getEstado() == Orden.EstadoOrden.Cancelado) continue;
            int idx = o.getFecha().getDayOfWeek().getValue() - 1;
            ventasSemanaArr[idx] += (o.getTotal() != null ? o.getTotal() : 0.0);
        }
        List<Double> ventasSemana = new ArrayList<>();
        for (double v : ventasSemanaArr) ventasSemana.add(v);
        resumen.setVentasSemana(ventasSemana);

        List<Orden> recientes = ordenRepository.findTop5ByOrderByFechaDesc();
        List<AdminDTOs.PedidoResumen> pedidosRecientes = new ArrayList<>();
        for (Orden o : recientes) {
            String cliente = "Cliente";
            if (o.getUsuario() != null) {
                String nombre = o.getUsuario().getNombre() != null ? o.getUsuario().getNombre() : "";
                String apellido = o.getUsuario().getApellido() != null ? o.getUsuario().getApellido() : "";
                cliente = (nombre + " " + apellido).trim();
                if (cliente.isBlank()) cliente = o.getUsuario().getCorreo();
            }
            String[] colores = badgeColores(o.getEstado());
            pedidosRecientes.add(new AdminDTOs.PedidoResumen(
                String.format("#%06d", o.getId()),
                cliente,
                tiempoRelativo(o.getFecha()),
                o.getEstado() != null ? o.getEstado().name() : "Pendiente",
                colores[0],
                colores[1]
            ));
        }
        resumen.setPedidosRecientes(pedidosRecientes);

        Map<Producto, Integer> cantidadPorProducto = new LinkedHashMap<>();
        Map<Producto, Double> totalPorProducto = new LinkedHashMap<>();
        for (Orden o : ordenesMes) {
            if (o.getEstado() == Orden.EstadoOrden.Cancelado) continue;
            for (DetalleOrden d : o.getDetalles()) {
                if (d.getProducto() == null) continue;
                cantidadPorProducto.merge(d.getProducto(), d.getCantidad() != null ? d.getCantidad() : 0, Integer::sum);
                totalPorProducto.merge(d.getProducto(), d.getSubTotal() != null ? d.getSubTotal() : 0.0, Double::sum);
            }
        }
        List<Map.Entry<Producto, Integer>> ordenados = new ArrayList<>(cantidadPorProducto.entrySet());
        ordenados.sort((a, b) -> b.getValue() - a.getValue());

        List<AdminDTOs.ProductoVendidoResumen> productosVendidos = new ArrayList<>();
        int rank = 1;
        for (Map.Entry<Producto, Integer> e : ordenados) {
            if (rank > 5) break;
            Producto p = e.getKey();
            productosVendidos.add(new AdminDTOs.ProductoVendidoResumen(
                rank,
                p.getImagenUrl(),
                p.getNombre(),
                e.getValue() + " unidades",
                "S/ " + String.format("%.2f", totalPorProducto.getOrDefault(p, 0.0))
            ));
            rank++;
        }
        resumen.setProductosVendidos(productosVendidos);

        return ResponseEntity.ok(resumen);
    }

    private String tiempoRelativo(LocalDateTime fecha) {
        if (fecha == null) return "--";
        Duration d = Duration.between(fecha, LocalDateTime.now());
        long minutos = Math.max(0, d.toMinutes());
        if (minutos < 1) return "Justo ahora";
        if (minutos < 60) return "Hace " + minutos + " min";
        long horas = d.toHours();
        if (horas < 24) return "Hace " + horas + " h";
        long dias = d.toDays();
        return "Hace " + dias + (dias == 1 ? " día" : " días");
    }

    private String[] badgeColores(Orden.EstadoOrden estado) {
        if (estado == null) return new String[]{"#F5F5F5", "#999999"};
        switch (estado) {
            case Pendiente: return new String[]{"#FDF2F3", "#F194B4"};
            case Confirmada: return new String[]{"#FFF9E6", "#F2C94C"};
            case Completada: return new String[]{"#E9F7EF", "#27AE60"};
            case Cancelado: return new String[]{"#F4ECF7", "#9B59B6"};
            default: return new String[]{"#F5F5F5", "#999999"};
        }
    }
}
