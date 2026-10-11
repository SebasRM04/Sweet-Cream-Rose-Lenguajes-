package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Modelo.Oferta;
import com.SweetCreamPink.demoSpringBoot.Modelo.Producto;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OfertaRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.ProductoRepository;
import com.SweetCreamPink.demoSpringBoot.service.OfertaService;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AdminOfertasController {

    @Autowired private OfertaRepository   ofertaRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private OfertaService      ofertaService;

    @GetMapping("/api/admin/ofertas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> listarTodas() {
        List<Oferta> ofertas = ofertaRepository.findAll();
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Oferta o : ofertas) {
            resultado.add(enriquecerOferta(o));
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/api/admin/ofertas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtener(@PathVariable Integer id) {
        Optional<Oferta> opt = ofertaRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(enriquecerOferta(opt.get()));
    }

    @PostMapping("/api/admin/ofertas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@RequestBody Oferta oferta) {
        if (oferta.getOferTitulo() == null || oferta.getOferTitulo().isBlank())
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El título es requerido"));
        if (oferta.getOferDescuento() == null)
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El descuento es requerido"));
        if (oferta.getOferFechaInicio() == null || oferta.getOferFechaFin() == null)
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Las fechas son requeridas"));
        if (oferta.getOferFechaFin().isBefore(oferta.getOferFechaInicio()))
            return ResponseEntity.badRequest()
                .body(Map.of("mensaje", "La fecha de fin no puede ser anterior a la de inicio"));

        if (oferta.getProducto() != null && oferta.getProducto().getId() != null) {
            Optional<Producto> prodOpt = productoRepository.findById(oferta.getProducto().getId());
            prodOpt.ifPresent(oferta::setProducto);
        }

        Oferta guardada = ofertaRepository.save(oferta);
        return ResponseEntity.ok(Map.of("mensaje", "Oferta creada correctamente", "oferta", enriquecerOferta(guardada)));
    }

    @PutMapping("/api/admin/ofertas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editar(@PathVariable Integer id, @RequestBody Oferta datos) {
        Optional<Oferta> opt = ofertaRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Oferta o = opt.get();
        if (datos.getOferTitulo()      != null) o.setOferTitulo(datos.getOferTitulo());
        if (datos.getOferDescripcion() != null) o.setOferDescripcion(datos.getOferDescripcion());
        if (datos.getOferDescuento()   != null) o.setOferDescuento(datos.getOferDescuento());
        if (datos.getOferFechaInicio() != null) o.setOferFechaInicio(datos.getOferFechaInicio());
        if (datos.getOferFechaFin()    != null) o.setOferFechaFin(datos.getOferFechaFin());
        if (datos.getOferActiva()      != null) o.setOferActiva(datos.getOferActiva());

        if (datos.getProducto() != null && datos.getProducto().getId() != null) {
            productoRepository.findById(datos.getProducto().getId()).ifPresent(o::setProducto);
        }

        return ResponseEntity.ok(Map.of("mensaje", "Oferta actualizada", "oferta", enriquecerOferta(ofertaRepository.save(o))));
    }

    @PutMapping("/api/admin/ofertas/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleActiva(@PathVariable Integer id) {
        Optional<Oferta> opt = ofertaRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Oferta o = opt.get();
        o.setOferActiva(!o.getOferActiva());
        ofertaRepository.save(o);
        return ResponseEntity.ok(Map.of(
            "mensaje", o.getOferActiva() ? "Oferta activada" : "Oferta desactivada",
            "activa",  o.getOferActiva()
        ));
    }

    @DeleteMapping("/api/admin/ofertas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (!ofertaRepository.existsById(id)) return ResponseEntity.notFound().build();
        ofertaRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Oferta eliminada correctamente"));
    }

    @GetMapping("/api/ofertas/vigentes")
    public ResponseEntity<List<Map<String, Object>>> ofertasVigentesPublico() {
        List<Oferta> vigentes = ofertaRepository.findVigentes(LocalDate.now());
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Oferta o : vigentes) {
            resultado.add(enriquecerOferta(o));
        }
        return ResponseEntity.ok(resultado);
    }

    /**
     * Enriquece la oferta con datos adicionales: imagen del producto, días restantes, precio con descuento
     */
    private Map<String, Object> enriquecerOferta(Oferta o) {
        Map<String, Object> map = new HashMap<>();
        map.put("oferId", o.getOferId());
        map.put("oferTitulo", o.getOferTitulo());
        map.put("oferDescripcion", o.getOferDescripcion());
        map.put("oferDescuento", o.getOferDescuento());
        map.put("oferFechaInicio", o.getOferFechaInicio() != null ? o.getOferFechaInicio().toString() : null);
        map.put("oferFechaFin", o.getOferFechaFin() != null ? o.getOferFechaFin().toString() : null);
        map.put("oferActiva", o.getOferActiva());

        // Días restantes
        if (o.getOferFechaFin() != null) {
            long diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), o.getOferFechaFin());
            map.put("diasRestantes", Math.max(0, diasRestantes));
        } else {
            map.put("diasRestantes", null);
        }

        // Producto con imagen
        if (o.getProducto() != null) {
            Map<String, Object> prodMap = new HashMap<>();
            prodMap.put("id", o.getProducto().getId());
            prodMap.put("nombre", o.getProducto().getNombre());
            prodMap.put("precio", o.getProducto().getPrecio());
            prodMap.put("imagenUrl", o.getProducto().getImagenUrl());
            prodMap.put("descripcion", o.getProducto().getDescripcion());
            map.put("producto", prodMap);

            // Precio con descuento
            Double precioConDcto = ofertaService.calcularPrecioConDescuento(
                o.getProducto().getPrecio(), o.getProducto().getId()
            );
            map.put("precioOriginal", o.getProducto().getPrecio());
            map.put("precioConDescuento", precioConDcto);
        } else {
            map.put("producto", null);
            map.put("precioOriginal", null);
            map.put("precioConDescuento", null);
        }

        return map;
    }
}
