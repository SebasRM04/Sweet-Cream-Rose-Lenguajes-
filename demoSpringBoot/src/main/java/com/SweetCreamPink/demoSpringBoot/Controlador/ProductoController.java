package com.SweetCreamPink.demoSpringBoot.Controlador;

import com.SweetCreamPink.demoSpringBoot.Modelo.Producto;
import com.SweetCreamPink.demoSpringBoot.Repositorio.ProductoRepository;
import com.SweetCreamPink.demoSpringBoot.service.OfertaService;
import com.google.common.collect.Lists;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ProductoController {

    private static final Logger log = LoggerFactory.getLogger(ProductoController.class);

    private final ProductoRepository productoRepo;
    private final OfertaService      ofertaService;

    @Value("${uploads.directory}")
    private String directorioUploads;

    public ProductoController(ProductoRepository productoRepo, OfertaService ofertaService) {
        this.productoRepo  = productoRepo;
        this.ofertaService = ofertaService;
    }

    // ── PÚBLICOS ─────────────────────────────────────────────────────────────

    /**
     * Convierte un Producto en un Map que además trae el precio con
     * descuento (si tiene una oferta vigente). Se mantienen todos los
     * campos que ya usaba el frontend (id, nombre, descripcion, precio,
     * imagenUrl, activo, categoria) y se agregan:
     *   - precioConDescuento: precio final si hay oferta, o null si no hay
     *   - tieneOferta: true/false
     */
    private Map<String, Object> enriquecerConDescuento(Producto p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("nombre", p.getNombre());
        map.put("descripcion", p.getDescripcion());
        map.put("precio", p.getPrecio());
        map.put("imagenUrl", p.getImagenUrl());
        map.put("activo", p.isActivo());
        if (p.getCategoria() != null) {
            Map<String, Object> cat = new HashMap<>();
            cat.put("id", p.getCategoria().getId());
            cat.put("descripcion", p.getCategoria().getDescripcion());
            map.put("categoria", cat);
        } else {
            map.put("categoria", null);
        }

        Double precioConDescuento = ofertaService.calcularPrecioConDescuento(p.getPrecio(), p.getId());
        map.put("precioConDescuento", precioConDescuento);
        map.put("tieneOferta", precioConDescuento != null);

        return map;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listar() {
        List<Map<String, Object>> resultado = productoRepo.findByActivoTrue().stream()
                .map(this::enriquecerConDescuento)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Integer id) {
        return productoRepo.findById(id)
                .filter(Producto::isActivo)
                .map(p -> ResponseEntity.ok(enriquecerConDescuento(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Map<String, Object>>> buscar(@RequestParam String q) {
        List<Map<String, Object>> resultado = productoRepo
                .findByNombreContainingIgnoreCaseAndActivoTrue(q.trim()).stream()
                .map(this::enriquecerConDescuento)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/categoria/{catId}")
    public ResponseEntity<List<Map<String, Object>>> porCategoria(@PathVariable Integer catId) {
        List<Map<String, Object>> resultado = productoRepo.findByCategoriaIdAndActivoTrue(catId).stream()
                .map(this::enriquecerConDescuento)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resultado);
    }

    // ── ADMIN ─────────────────────────────────────────────────────────────────
    @PostMapping("/guardar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> guardar(
            @RequestParam("nombre")      String nombre,
            @RequestParam("precio")      Double precio,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "archivo", required = false) MultipartFile archivo)
            throws IOException {

        Producto p = new Producto();
        p.setNombre(nombre);
        p.setPrecio(precio);
        p.setDescripcion(descripcion);

        if (archivo != null && !archivo.isEmpty()) {
            Path dirPath = Paths.get(directorioUploads);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
            String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
            Files.copy(archivo.getInputStream(), dirPath.resolve(nombreArchivo));
            p.setImagenUrl("/uploads/" + nombreArchivo);
        } else {
            p.setImagenUrl("/uploads/default.png");
        }

        Producto guardado = productoRepo.save(p);
        log.info("Producto '{}' guardado por admin", nombre);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Integer id,
                                        @RequestBody Producto datos) {
        return productoRepo.findById(id).map(p -> {
            if (datos.getNombre()      != null) p.setNombre(datos.getNombre());
            if (datos.getPrecio()      != null) p.setPrecio(datos.getPrecio());
            if (datos.getDescripcion() != null) p.setDescripcion(datos.getDescripcion());
            productoRepo.save(p);
            log.info("Producto #{} actualizado", id);
            return ResponseEntity.ok(p);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (!productoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoRepo.deleteById(id);
        log.warn("Producto #{} eliminado por admin", id);
        return ResponseEntity.ok(Map.of("mensaje", "Producto eliminado correctamente."));
    }
}