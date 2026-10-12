package com.SweetCreamPink.demoSpringBoot.service;

import com.SweetCreamPink.demoSpringBoot.Modelo.DetalleOrden;
import com.SweetCreamPink.demoSpringBoot.Modelo.Oferta;
import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OfertaRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OrdenRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReporteExportService {

    private static final DateTimeFormatter FMT_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final BigDecimal MARGEN = new BigDecimal("0.60");

    private final OrdenRepository ordenRepository;
    private final OfertaRepository ofertaRepository;

    public ReporteExportService(OrdenRepository ordenRepository, OfertaRepository ofertaRepository) {
        this.ordenRepository = ordenRepository;
        this.ofertaRepository = ofertaRepository;
    }

    public LocalDateTime[] rango(String periodo) {
        LocalDateTime ahora = LocalDateTime.now();
        String p = periodo == null ? "mensual" : periodo.toLowerCase();
        switch (p) {
            case "semanal": {
                int diasDesdeLunes = ahora.getDayOfWeek().getValue() - 1;
                LocalDateTime inicio = ahora.minusDays(diasDesdeLunes).withHour(0).withMinute(0).withSecond(0).withNano(0);
                return new LocalDateTime[]{inicio, inicio.plusDays(6).withHour(23).withMinute(59).withSecond(59)};
            }
            case "anual": {
                int anio = ahora.getYear();
                return new LocalDateTime[]{
                        LocalDateTime.of(anio, 1, 1, 0, 0, 0),
                        LocalDateTime.of(anio, 12, 31, 23, 59, 59)
                };
            }
            default: {
                YearMonth mes = YearMonth.now();
                return new LocalDateTime[]{mes.atDay(1).atStartOfDay(), mes.atEndOfMonth().atTime(23, 59, 59)};
            }
        }
    }

    public String etiquetaPeriodo(String periodo) {
        String p = periodo == null ? "mensual" : periodo.toLowerCase();
        if ("semanal".equals(p)) return "Ultima semana";
        if ("anual".equals(p)) return "Ultimo anio";
        return "Ultimo mes";
    }

    public List<Orden> ordenesEnRango(LocalDateTime inicio, LocalDateTime fin) {
        List<Orden> ordenes = ordenRepository.findByFechaBetween(inicio, fin);
        ordenes.sort(Comparator.comparing(Orden::getFecha, Comparator.nullsLast(Comparator.reverseOrder())));
        return ordenes;
    }

    public void escribirExcel(String tipo, String periodo, OutputStream out) throws Exception {
        LocalDateTime[] r = rango(periodo);
        List<Orden> ordenes = ordenesEnRango(r[0], r[1]);
        String titulo = tituloDe(tipo);

        try (Workbook wb = new XSSFWorkbook()) {
            CellStyle header = wb.createCellStyle();
            org.apache.poi.ss.usermodel.Font font = wb.createFont();
            font.setBold(true);
            font.setColor(IndexedColors.WHITE.getIndex());
            header.setFont(font);
            header.setFillForegroundColor(IndexedColors.MAROON.getIndex());
            header.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Sheet sheet = wb.createSheet(titulo);
            int rowIdx = 0;
            Row meta = sheet.createRow(rowIdx++);
            meta.createCell(0).setCellValue("Sweet Cream Rose — " + titulo);
            sheet.createRow(rowIdx++).createCell(0).setCellValue("Periodo: " + etiquetaPeriodo(periodo)
                    + "  (" + r[0].toLocalDate() + " a " + r[1].toLocalDate() + ")");
            rowIdx++;

            switch (tipo == null ? "ventas" : tipo.toLowerCase()) {
                case "ganancias" -> escribirGananciasExcel(sheet, header, rowIdx, ordenes);
                case "productos" -> escribirProductosExcel(sheet, header, rowIdx, ordenes);
                case "ofertas" -> escribirOfertasExcel(sheet, header, rowIdx);
                default -> escribirVentasExcel(sheet, header, rowIdx, ordenes);
            }
            for (int i = 0; i < 10; i++) sheet.autoSizeColumn(i);
            wb.write(out);
        }
    }

    public void escribirPdf(String tipo, String periodo, OutputStream out) throws Exception {
        LocalDateTime[] r = rango(periodo);
        List<Orden> ordenes = ordenesEnRango(r[0], r[1]);
        String titulo = tituloDe(tipo);

        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
        PdfWriter.getInstance(doc, out);
        doc.open();

        Font h1 = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(195, 102, 109));
        Font h2 = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(90, 62, 65));
        Font th = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
        Font td = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(50, 40, 40));

        doc.add(new Paragraph("Sweet Cream Rose", h1));
        doc.add(new Paragraph(titulo, h2));
        doc.add(new Paragraph("Periodo: " + etiquetaPeriodo(periodo)
                + "  (" + r[0].toLocalDate() + " a " + r[1].toLocalDate() + ")", h2));
        doc.add(new Paragraph(" "));

        String t = tipo == null ? "ventas" : tipo.toLowerCase();
        switch (t) {
            case "ganancias" -> tablaGananciasPdf(doc, th, td, ordenes);
            case "productos" -> tablaProductosPdf(doc, th, td, ordenes);
            case "ofertas" -> tablaOfertasPdf(doc, th, td);
            default -> tablaVentasPdf(doc, th, td, ordenes);
        }
        doc.close();
    }

    private String tituloDe(String tipo) {
        if (tipo == null) return "Reporte de ventas";
        return switch (tipo.toLowerCase()) {
            case "ganancias" -> "Reporte de ganancias";
            case "productos" -> "Reporte de productos";
            case "pedidos" -> "Reporte de pedidos";
            case "ofertas" -> "Reporte de ofertas";
            default -> "Reporte de ventas";
        };
    }

    private void escribirVentasExcel(Sheet sheet, CellStyle header, int rowIdx, List<Orden> ordenes) {
        Row h = sheet.createRow(rowIdx++);
        String[] cols = {"ID", "Codigo", "Fecha", "Cliente", "Estado", "Metodo pago",
                         "Subtotal (S/)", "IGV 18% (S/)", "Envio (S/)", "Total (S/)"};
        for (int i = 0; i < cols.length; i++) {
            Cell c = h.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(header);
        }
        double suma = 0;
        for (Orden o : ordenes) {
            Row r = sheet.createRow(rowIdx++);
            r.createCell(0).setCellValue(o.getId() != null ? o.getId() : 0);
            r.createCell(1).setCellValue(o.getCodigoSeguimiento() != null ? o.getCodigoSeguimiento() : "");
            r.createCell(2).setCellValue(o.getFecha() != null ? o.getFecha().format(FMT_FECHA) : "");
            r.createCell(3).setCellValue(nombreCliente(o));
            r.createCell(4).setCellValue(o.getEstado() != null ? o.getEstado().name() : "");
            r.createCell(5).setCellValue(o.getMetodoPago() != null ? o.getMetodoPago().name() : "");
            double total = o.getTotal() != null ? o.getTotal() : 0;
            r.createCell(6).setCellValue(subtotalDe(o));
            r.createCell(7).setCellValue(o.getIgv() != null ? o.getIgv() : 0);
            r.createCell(8).setCellValue(o.getCostoEnvio() != null ? o.getCostoEnvio() : 0);
            r.createCell(9).setCellValue(total);
            if (o.getEstado() != Orden.EstadoOrden.Cancelado) suma += total;
        }
        Row tot = sheet.createRow(rowIdx);
        tot.createCell(8).setCellValue("TOTAL VALIDO");
        tot.createCell(9).setCellValue(suma);
    }

    private void escribirGananciasExcel(Sheet sheet, CellStyle header, int rowIdx, List<Orden> ordenes) {
        List<Orden> validas = validas(ordenes);
        double ingresos = validas.stream().mapToDouble(o -> o.getTotal() != null ? o.getTotal() : 0).sum();
        double ganancia = ingresos * MARGEN.doubleValue();
        double costos = ingresos - ganancia;

        Row h = sheet.createRow(rowIdx++);
        for (int i = 0; i < 2; i++) {
            Cell c = h.createCell(i);
            c.setCellStyle(header);
        }
        h.getCell(0).setCellValue("Metrica");
        h.getCell(1).setCellValue("Valor");
        sheet.createRow(rowIdx++).createCell(0).setCellValue("Ingresos");
        sheet.getRow(rowIdx - 1).createCell(1).setCellValue(ingresos);
        sheet.createRow(rowIdx++).createCell(0).setCellValue("Costos estimados (40%)");
        sheet.getRow(rowIdx - 1).createCell(1).setCellValue(costos);
        sheet.createRow(rowIdx++).createCell(0).setCellValue("Ganancia neta estimada (60%)");
        sheet.getRow(rowIdx - 1).createCell(1).setCellValue(ganancia);
        sheet.createRow(rowIdx++).createCell(0).setCellValue("Ordenes validas");
        sheet.getRow(rowIdx - 1).createCell(1).setCellValue(validas.size());
        rowIdx++;

        Row h2 = sheet.createRow(rowIdx++);
        String[] cols = {"Categoria", "Ingresos (S/)", "Costos (S/)", "Ganancia (S/)"};
        for (int i = 0; i < cols.length; i++) {
            Cell c = h2.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(header);
        }
        for (Map.Entry<String, Double> e : totalesPorCategoria(validas).entrySet()) {
            Row r = sheet.createRow(rowIdx++);
            r.createCell(0).setCellValue(e.getKey());
            r.createCell(1).setCellValue(e.getValue());
            r.createCell(2).setCellValue(e.getValue() * 0.40);
            r.createCell(3).setCellValue(e.getValue() * 0.60);
        }
    }

    private void escribirProductosExcel(Sheet sheet, CellStyle header, int rowIdx, List<Orden> ordenes) {
        Row h = sheet.createRow(rowIdx++);
        String[] cols = {"Producto", "Unidades", "Total (S/)"};
        for (int i = 0; i < cols.length; i++) {
            Cell c = h.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(header);
        }
        for (Map<String, Object> p : topProductos(ordenes)) {
            Row r = sheet.createRow(rowIdx++);
            r.createCell(0).setCellValue(String.valueOf(p.get("nombre")));
            r.createCell(1).setCellValue(((Number) p.get("unidades")).longValue());
            r.createCell(2).setCellValue(((Number) p.get("total")).doubleValue());
        }
    }

    private void escribirOfertasExcel(Sheet sheet, CellStyle header, int rowIdx) {
        Row h = sheet.createRow(rowIdx++);
        String[] cols = {"Titulo", "Descuento %", "Inicio", "Fin", "Activa", "Producto"};
        for (int i = 0; i < cols.length; i++) {
            Cell c = h.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(header);
        }
        for (Oferta o : ofertaRepository.findAll()) {
            Row r = sheet.createRow(rowIdx++);
            r.createCell(0).setCellValue(o.getOferTitulo() != null ? o.getOferTitulo() : "");
            r.createCell(1).setCellValue(o.getOferDescuento() != null ? o.getOferDescuento().doubleValue() : 0);
            r.createCell(2).setCellValue(o.getOferFechaInicio() != null ? o.getOferFechaInicio().toString() : "");
            r.createCell(3).setCellValue(o.getOferFechaFin() != null ? o.getOferFechaFin().toString() : "");
            r.createCell(4).setCellValue(Boolean.TRUE.equals(o.getOferActiva()) ? "Si" : "No");
            r.createCell(5).setCellValue(o.getProducto() != null ? o.getProducto().getNombre() : "Toda la tienda");
        }
    }

    private void tablaVentasPdf(Document doc, Font th, Font td, List<Orden> ordenes) throws Exception {
        PdfPTable table = new PdfPTable(new float[]{0.8f, 1.8f, 2.2f, 2.8f, 1.8f, 1.8f, 1.5f, 1.4f, 1.3f, 1.5f});
        table.setWidthPercentage(100);
        headers(table, th, "ID", "Codigo", "Fecha", "Cliente", "Estado", "Pago",
                "Subtotal", "IGV", "Envio", "Total (S/)");
        double suma = 0;
        for (Orden o : ordenes) {
            cells(table, td,
                    String.valueOf(o.getId() != null ? o.getId() : ""),
                    o.getCodigoSeguimiento() != null ? o.getCodigoSeguimiento() : "",
                    o.getFecha() != null ? o.getFecha().format(FMT_FECHA) : "",
                    nombreCliente(o),
                    o.getEstado() != null ? o.getEstado().name() : "",
                    o.getMetodoPago() != null ? o.getMetodoPago().name() : "",
                    money(subtotalDe(o)),
                    money(o.getIgv()),
                    money(o.getCostoEnvio()),
                    money(o.getTotal()));
            if (o.getEstado() != Orden.EstadoOrden.Cancelado) suma += o.getTotal() != null ? o.getTotal() : 0;
        }
        doc.add(table);
        doc.add(new Paragraph("Total valido: S/ " + money(suma), td));
    }

    private void tablaGananciasPdf(Document doc, Font th, Font td, List<Orden> ordenes) throws Exception {
        List<Orden> validas = validas(ordenes);
        double ingresos = validas.stream().mapToDouble(o -> o.getTotal() != null ? o.getTotal() : 0).sum();
        PdfPTable resumen = new PdfPTable(2);
        resumen.setWidthPercentage(50);
        headers(resumen, th, "Metrica", "Valor");
        cells(resumen, td, "Ingresos", "S/ " + money(ingresos));
        cells(resumen, td, "Costos estimados", "S/ " + money(ingresos * 0.40));
        cells(resumen, td, "Ganancia neta estimada", "S/ " + money(ingresos * 0.60));
        cells(resumen, td, "Ordenes validas", String.valueOf(validas.size()));
        doc.add(resumen);
        doc.add(new Paragraph(" "));
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        headers(table, th, "Categoria", "Ingresos", "Costos", "Ganancia");
        for (Map.Entry<String, Double> e : totalesPorCategoria(validas).entrySet()) {
            cells(table, td, e.getKey(), "S/ " + money(e.getValue()),
                    "S/ " + money(e.getValue() * 0.40), "S/ " + money(e.getValue() * 0.60));
        }
        doc.add(table);
    }

    private void tablaProductosPdf(Document doc, Font th, Font td, List<Orden> ordenes) throws Exception {
        PdfPTable table = new PdfPTable(new float[]{4f, 1.5f, 2f});
        table.setWidthPercentage(100);
        headers(table, th, "Producto", "Unidades", "Total (S/)");
        for (Map<String, Object> p : topProductos(ordenes)) {
            cells(table, td, String.valueOf(p.get("nombre")),
                    String.valueOf(p.get("unidades")), "S/ " + money(((Number) p.get("total")).doubleValue()));
        }
        doc.add(table);
    }

    private void tablaOfertasPdf(Document doc, Font th, Font td) throws Exception {
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        headers(table, th, "Titulo", "Desc. %", "Inicio", "Fin", "Activa", "Producto");
        for (Oferta o : ofertaRepository.findAll()) {
            cells(table, td,
                    o.getOferTitulo() != null ? o.getOferTitulo() : "",
                    o.getOferDescuento() != null ? o.getOferDescuento().toPlainString() : "0",
                    o.getOferFechaInicio() != null ? o.getOferFechaInicio().toString() : "",
                    o.getOferFechaFin() != null ? o.getOferFechaFin().toString() : "",
                    Boolean.TRUE.equals(o.getOferActiva()) ? "Si" : "No",
                    o.getProducto() != null ? o.getProducto().getNombre() : "Toda la tienda");
        }
        doc.add(table);
    }

    private void headers(PdfPTable table, Font th, String... titles) {
        Color bg = new Color(195, 102, 109);
        for (String t : titles) {
            PdfPCell cell = new PdfPCell(new Phrase(t, th));
            cell.setBackgroundColor(bg);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(6);
            table.addCell(cell);
        }
    }

    private void cells(PdfPTable table, Font td, String... values) {
        for (String v : values) {
            PdfPCell cell = new PdfPCell(new Phrase(v == null ? "" : v, td));
            cell.setPadding(5);
            table.addCell(cell);
        }
    }

    private List<Orden> validas(List<Orden> ordenes) {
        return ordenes.stream()
                .filter(o -> o.getEstado() != Orden.EstadoOrden.Cancelado)
                .collect(Collectors.toList());
    }

    private Map<String, Double> totalesPorCategoria(List<Orden> validas) {
        Map<String, Double> map = new LinkedHashMap<>();
        for (Orden o : validas) {
            if (o.getDetalles() == null) continue;
            for (DetalleOrden d : o.getDetalles()) {
                if (d.getProducto() == null) continue;
                String cat = d.getProducto().getCategoria() != null
                        ? d.getProducto().getCategoria().getDescripcion()
                        : "Otros";
                map.merge(cat, d.getSubTotal() != null ? d.getSubTotal() : 0.0, Double::sum);
            }
        }
        return map;
    }

    private List<Map<String, Object>> topProductos(List<Orden> ordenes) {
        Map<String, long[]> acc = new HashMap<>();
        for (Orden o : validas(ordenes)) {
            if (o.getDetalles() == null) continue;
            for (DetalleOrden d : o.getDetalles()) {
                String nombre = d.getProducto() != null ? d.getProducto().getNombre() : "Desconocido";
                acc.computeIfAbsent(nombre, k -> new long[]{0, 0});
                acc.get(nombre)[0] += d.getCantidad() != null ? d.getCantidad() : 0;
                acc.get(nombre)[1] += d.getSubTotal() != null ? Math.round(d.getSubTotal() * 100) : 0;
            }
        }
        List<Map<String, Object>> list = new ArrayList<>();
        acc.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue()[0], a.getValue()[0]))
                .forEach(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nombre", e.getKey());
                    m.put("unidades", e.getValue()[0]);
                    m.put("total", e.getValue()[1] / 100.0);
                    list.add(m);
                });
        return list;
    }

    // Subtotal guardado en la orden. Las ordenes anteriores al desglose (IGV/envio)
    // no lo tienen: en ese caso "total" era solo la suma de productos.
    private double subtotalDe(Orden o) {
        if (o.getSubtotal() != null && o.getSubtotal() > 0) return o.getSubtotal();
        return o.getTotal() != null ? o.getTotal() : 0;
    }

    private String nombreCliente(Orden o) {
        if (o.getUsuario() == null) return "Cliente";
        String n = ((o.getUsuario().getNombre() != null ? o.getUsuario().getNombre() : "")
                + " " + (o.getUsuario().getApellido() != null ? o.getUsuario().getApellido() : "")).trim();
        if (n.isBlank()) return o.getUsuario().getCorreo() != null ? o.getUsuario().getCorreo() : "Cliente";
        return n;
    }

    private String money(Double v) {
        return BigDecimal.valueOf(v != null ? v : 0).setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    private String money(double v) {
        return BigDecimal.valueOf(v).setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}
