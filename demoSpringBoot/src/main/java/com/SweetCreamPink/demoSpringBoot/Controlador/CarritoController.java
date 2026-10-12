package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Modelo.CarritoItem;
import com.SweetCreamPink.demoSpringBoot.Modelo.Producto;
import com.SweetCreamPink.demoSpringBoot.Repositorio.ProductoRepository;
import com.SweetCreamPink.demoSpringBoot.service.OfertaService;

import java.security.Principal;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "${cors.allowed-origins}") 
public class CarritoController {

    @Autowired
    private ProductoRepository productoRepository; 
    
    @Autowired
    private OfertaService ofertaService;
    
    // Un carrito por usuario (clave = correo autenticado; "anonimo" si no hay sesión)
    private final Map<String, List<CarritoItem>> carritos = new ConcurrentHashMap<>();

    private List<CarritoItem> carritoDe(Principal principal) {
        String clave = (principal != null && principal.getName() != null) ? principal.getName() : "anonimo";
        return carritos.computeIfAbsent(clave, k -> new java.util.concurrent.CopyOnWriteArrayList<>());
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> obtenerCarrito(Principal principal) {
        List<CarritoItem> listaCarrito = carritoDe(principal);
        List<Map<String, Object>> carritoConDescuentos = new ArrayList<>();
        for (CarritoItem item : listaCarrito) {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("id", item.getId());
            itemMap.put("producto", item.getProducto());
            itemMap.put("cantidad", item.getCantidad());
            itemMap.put("subtotal", item.getSubtotal());
            
            // Aplicar descuento si existe oferta vigente
            Double precioConDescuento = ofertaService.calcularPrecioConDescuento(
                item.getProducto().getPrecio(), 
                item.getProducto().getId()
            );
            itemMap.put("precioConDescuento", precioConDescuento);
            itemMap.put("tieneOferta", precioConDescuento != null);
            
            carritoConDescuentos.add(itemMap);
        }
        return ResponseEntity.ok(carritoConDescuentos);
    }

    @PostMapping("/actualizar-cantidad")
    public ResponseEntity<List<CarritoItem>> actualizarCantidad(
            @RequestParam Integer productoId,  
            @RequestParam Integer nuevaCantidad,
            Principal principal) {
        List<CarritoItem> listaCarrito = carritoDe(principal);
        if (nuevaCantidad == null || nuevaCantidad < 1) {
            return ResponseEntity.badRequest().build();
        }

        for (CarritoItem item : listaCarrito) {
            if (item.getProducto().getId().equals(productoId)) {
                item.setCantidad(nuevaCantidad);
                break;
            }
        }
        return ResponseEntity.ok(listaCarrito);
    }

    @DeleteMapping("/eliminar/{productoId}")
    public ResponseEntity<List<CarritoItem>> eliminarItem(@PathVariable Integer productoId, Principal principal) {
        List<CarritoItem> listaCarrito = carritoDe(principal);
        listaCarrito.removeIf(item -> item.getProducto().getId().equals(productoId));
        return ResponseEntity.ok(listaCarrito);
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarItem(@RequestBody Map<String, Object> body, Principal principal) {
        List<CarritoItem> listaCarrito = carritoDe(principal);
        try {
            Integer productoId = body.get("productoId") != null ? ((Number) body.get("productoId")).intValue() : null;
            Integer cantidad   = body.get("cantidad") != null ? ((Number) body.get("cantidad")).intValue() : 1;
            if (cantidad < 1) cantidad = 1;

            if (productoId == null) {
                return ResponseEntity.badRequest().body("productoId es requerido");
            }

            Optional<Producto> productoOpt = productoRepository.findById(productoId);
            if (productoOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Producto no encontrado");
            }

            Producto producto = productoOpt.get();

            // Si ya existe en el carrito, incrementar cantidad
            for (CarritoItem item : listaCarrito) {
                if (item.getProducto().getId().equals(productoId)) {
                    item.setCantidad(item.getCantidad() + cantidad);
                    return ResponseEntity.ok(listaCarrito);
                }
            }

            // Si no existe, agregar nuevo item
            listaCarrito.add(new CarritoItem(producto, cantidad));
            
            // Devolver también información de descuento
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Producto agregado al carrito");
            respuesta.put("carrito", listaCarrito);
            
            Double precioConDescuento = ofertaService.calcularPrecioConDescuento(
                producto.getPrecio(), producto.getId()
            );
            respuesta.put("precioConDescuento", precioConDescuento);
            respuesta.put("tieneOferta", precioConDescuento != null);
            
            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/pagar")
    public ResponseEntity<String> procesarPago(@RequestBody String datosPago, Principal principal) {
        carritoDe(principal).clear();
        return ResponseEntity.ok("¡Pedido recibido con éxito en Sweet Cream Rose Backend!");
    }
}
