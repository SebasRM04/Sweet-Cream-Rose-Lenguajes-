package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.DTO.AdminDTOs;
import com.SweetCreamPink.demoSpringBoot.Modelo.DetalleOrden;
import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Repositorio.DetalleOrdenRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OrdenRepository;
import com.SweetCreamPink.demoSpringBoot.service.ReporteExportService;

import jakarta.servlet.http.HttpServletResponse;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reportes")
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportesController {

    @Autowired private OrdenRepository        ordenRepository;
    @Autowired private DetalleOrdenRepository detalleOrdenRepository;
    @Autowired private ReporteExportService   reporteExportService;

    @GetMapping("/mensual")
    public ResponseEntity<AdminDTOs.ReporteCompleto> reporteMensual(
            @RequestParam(defaultValue = "0") int mesOffset) {
        YearMonth mes        = YearMonth.now().minusMonths(mesOffset);
        LocalDateTime inicio = mes.atDay(1).atStartOfDay();
        LocalDateTime fin    = mes.atEndOfMonth().atTime(23, 59, 59);
        return ResponseEntity.ok(construirReporte(inicio, fin, "dia"));
    }

    @GetMapping("/semanal")
    public ResponseEntity<AdminDTOs.ReporteCompleto> reporteSemanal() {
        LocalDateTime ahora  = LocalDateTime.now();
        int diasDesdeLunes   = ahora.getDayOfWeek().getValue() - 1;
        LocalDateTime inicio = ahora.minusDays(diasDesdeLunes).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime fin    = inicio.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        return ResponseEntity.ok(construirReporte(inicio, fin, "dia"));
    }

    @GetMapping("/anual")
    public ResponseEntity<AdminDTOs.ReporteCompleto> reporteAnual(
            @RequestParam(defaultValue = "0") int anioOffset) {
        int anio             = LocalDateTime.now().getYear() - anioOffset;
        LocalDateTime inicio = LocalDateTime.of(anio, 1, 1, 0, 0, 0);
        LocalDateTime fin    = LocalDateTime.of(anio, 12, 31, 23, 59, 59);
        return ResponseEntity.ok(construirReporte(inicio, fin, "mes"));
    }

    @GetMapping("/top-productos")
    public ResponseEntity<List<AdminDTOs.ProductoTop>> topProductos(
            @RequestParam(defaultValue = "10") int limite) {
        List<DetalleOrden> detalles = detalleOrdenRepository.findAll();

        Map<String, long[]> acumulado = new HashMap<>();
        for (DetalleOrden d : detalles) {
            String nombre = (d.getProducto() != null) ? d.getProducto().getNombre() : "Desconocido";
            acumulado.computeIfAbsent(nombre, k -> new long[]{0, 0});
            acumulado.get(nombre)[0] += d.getCantidad() != null ? d.getCantidad() : 0;
            acumulado.get(nombre)[1] += d.getSubTotal() != null ? d.getSubTotal().longValue() : 0;
        }

        List<AdminDTOs.ProductoTop> top = acumulado.entrySet().stream()
            .map(e -> new AdminDTOs.ProductoTop(
                e.getKey(),
                e.getValue()[0],
                BigDecimal.valueOf(e.getValue()[1])
            ))
            .sorted(Comparator.comparingLong(AdminDTOs.ProductoTop::getCantidadVendida).reversed())
            .limit(limite)
            .collect(Collectors.toList());

        return ResponseEntity.ok(top);
    }

    @GetMapping("/completo")
    public ResponseEntity<AdminDTOs.ReporteCompleto> reporteCompleto() {
        YearMonth mes        = YearMonth.now();
        LocalDateTime inicio = mes.atDay(1).atStartOfDay();
        LocalDateTime fin    = mes.atEndOfMonth().atTime(23, 59, 59);
        AdminDTOs.ReporteCompleto reporte = construirReporte(inicio, fin, "dia");

        List<DetalleOrden> detalles = detalleOrdenRepository.findAll();
        Map<String, long[]> acumulado = new HashMap<>();
        for (DetalleOrden d : detalles) {
            String nombre = (d.getProducto() != null) ? d.getProducto().getNombre() : "Otro";
            acumulado.computeIfAbsent(nombre, k -> new long[]{0, 0});
            acumulado.get(nombre)[0] += d.getCantidad() != null ? d.getCantidad() : 0;
            acumulado.get(nombre)[1] += d.getSubTotal() != null ? d.getSubTotal().longValue() : 0;
        }

        List<AdminDTOs.ProductoTop> top5 = acumulado.entrySet().stream()
            .map(e -> new AdminDTOs.ProductoTop(
                e.getKey(),
                e.getValue()[0],
                BigDecimal.valueOf(e.getValue()[1])
            ))
            .sorted(Comparator.comparingLong(AdminDTOs.ProductoTop::getCantidadVendida).reversed())
            .limit(5)
            .collect(Collectors.toList());
        reporte.setTopProductos(top5);

        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/exportar.xlsx")
    public void exportarExcel(
            @RequestParam(defaultValue = "ventas") String tipo,
            @RequestParam(defaultValue = "mensual") String periodo,
            HttpServletResponse response) throws Exception {
        String nombre = "Reporte_" + tipo + "_" + periodo + ".xlsx";
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + nombre + "\"");
        reporteExportService.escribirExcel(tipo, periodo, response.getOutputStream());
    }

    @GetMapping("/exportar.pdf")
    public void exportarPdf(
            @RequestParam(defaultValue = "ventas") String tipo,
            @RequestParam(defaultValue = "mensual") String periodo,
            HttpServletResponse response) throws Exception {
        String nombre = "Reporte_" + tipo + "_" + periodo + ".pdf";
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + nombre + "\"");
        reporteExportService.escribirPdf(tipo, periodo, response.getOutputStream());
    }

    private AdminDTOs.ReporteCompleto construirReporte(LocalDateTime inicio,
                                                        LocalDateTime fin,
                                                        String agruparPor) {
        List<Orden> ordenes = ordenRepository.findByFechaBetween(inicio, fin);
        List<Orden> validas = ordenes.stream()
            .filter(o -> Orden.EstadoOrden.Cancelado != o.getEstado())
            .collect(Collectors.toList());

        BigDecimal totalGeneral = validas.stream()
            .map(o -> BigDecimal.valueOf(o.getTotal() != null ? o.getTotal() : 0.0))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        DateTimeFormatter fmt = "mes".equals(agruparPor)
            ? DateTimeFormatter.ofPattern("yyyy-MM")
            : DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<String, double[]> porPeriodo = new LinkedHashMap<>();
        for (Orden o : validas) {
            if (o.getFecha() != null) {
                String periodo = o.getFecha().format(fmt);
                porPeriodo.computeIfAbsent(periodo, k -> new double[]{0, 0});
                porPeriodo.get(periodo)[0]++;
                porPeriodo.get(periodo)[1] += o.getTotal() != null ? o.getTotal() : 0.0;
            }
        }

        List<AdminDTOs.VentaResumen> ventasPorPeriodo = porPeriodo.entrySet().stream()
            .map(e -> new AdminDTOs.VentaResumen(
                e.getKey(),
                (long) e.getValue()[0],
                BigDecimal.valueOf(e.getValue()[1])
            ))
            .collect(Collectors.toList());

        LocalDateTime ultima = validas.stream()
            .map(Orden::getFecha)
            .filter(Objects::nonNull)
            .max(LocalDateTime::compareTo)
            .orElse(null);

        BigDecimal ticket = validas.isEmpty()
            ? BigDecimal.ZERO
            : totalGeneral.divide(BigDecimal.valueOf(validas.size()), 2, RoundingMode.HALF_UP);

        AdminDTOs.ReporteCompleto reporte = new AdminDTOs.ReporteCompleto();
        reporte.setVentasPorPeriodo(ventasPorPeriodo);
        reporte.setTotalGeneral(totalGeneral);
        reporte.setTotalOrdenes(ordenes.size());
        reporte.setOrdenesValidas(validas.size());
        reporte.setTicketPromedio(ticket);
        reporte.setTiposDisponibles(5);
        reporte.setUltimaOrdenFecha(ultima != null ? ultima.toLocalDate().toString() : "--");
        reporte.setUltimaOrdenHora(ultima != null
            ? ultima.toLocalTime().withNano(0).toString()
            : "--");
        return reporte;
    }
}
