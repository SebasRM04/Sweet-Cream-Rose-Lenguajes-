package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.SweetCreamPink.demoSpringBoot.Modelo.Producto;
import com.SweetCreamPink.demoSpringBoot.Repositorio.ProductoRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/productos")
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductosController {

    @Autowired
    private ProductoRepository productoRepository;

    @Value("${uploads.directory}")
    private String directorioUploads;

    @GetMapping
    public ResponseEntity<List<Producto>> listarTodos() {
        return ResponseEntity.ok(productoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Integer id) {
        Optional<Producto> opt = productoRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(opt.get());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Producto producto) {
        // getNombre() en lugar de getProNombre()
        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("mensaje", "El nombre del producto es requerido"));
        }
        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.ok(Map.of(
            "mensaje",  "Producto creado exitosamente",
            "producto", guardado
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Integer id,
                                    @RequestBody Producto datosNuevos) {
        Optional<Producto> opt = productoRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Producto producto = opt.get();

        // getNombre() / setNombre() en lugar de getProNombre() / setProNombre()
        if (datosNuevos.getNombre() != null) {
            producto.setNombre(datosNuevos.getNombre());
        }
        if (datosNuevos.getCategoria() != null) {
            producto.setCategoria(datosNuevos.getCategoria());
        }
        if (datosNuevos.getDescripcion() != null) {
            producto.setDescripcion(datosNuevos.getDescripcion());
        }
        if (datosNuevos.getPrecio() != null) {
            producto.setPrecio(datosNuevos.getPrecio());
        }
        if (datosNuevos.getImagenUrl() != null) {
            producto.setImagenUrl(datosNuevos.getImagenUrl());
        }
        producto.setActivo(datosNuevos.isActivo());

        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.ok(Map.of(
            "mensaje",  "Producto actualizado correctamente",
            "producto", guardado
        ));
    }

    @PostMapping("/subir-imagen")
    public ResponseEntity<?> subirImagen(@RequestParam("archivo") MultipartFile archivo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "No se recibió ninguna imagen"));
        }

        Path dirPath = Paths.get(directorioUploads);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        String nombreOriginal = archivo.getOriginalFilename();
        String nombreArchivo = System.currentTimeMillis() + "_" + (nombreOriginal == null ? "imagen" : nombreOriginal.replaceAll("\\s+", "_"));
        Files.copy(archivo.getInputStream(), dirPath.resolve(nombreArchivo));

        return ResponseEntity.ok(Map.of("imagenUrl", "/uploads/" + nombreArchivo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (!productoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Producto eliminado correctamente"));
    }
}