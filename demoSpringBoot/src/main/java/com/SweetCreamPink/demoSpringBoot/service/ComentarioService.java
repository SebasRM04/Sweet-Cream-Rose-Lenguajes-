package com.SweetCreamPink.demoSpringBoot.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.SweetCreamPink.demoSpringBoot.Modelo.Comentario;
import com.SweetCreamPink.demoSpringBoot.Modelo.Producto;
import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.Repositorio.ComentarioRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.ProductoRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;

@Service
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public ComentarioService(ComentarioRepository comentarioRepository,
                              UsuarioRepository usuarioRepository,
                              ProductoRepository productoRepository) {
        this.comentarioRepository = comentarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public Comentario crear(Integer usuarioId, Integer productoId,
                            String contenido, String nombre, Integer calificacion) {
        if (contenido == null || contenido.isBlank()) {
            throw new IllegalArgumentException("El comentario no puede estar vacío");
        }

        Comentario nuevo = new Comentario();

        if (usuarioId != null) {
            Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
            if (usuario != null) {
                nuevo.setUsuario(usuario);
                if (nombre == null || nombre.isBlank()) {
                    String apellido = usuario.getApellido() != null ? usuario.getApellido() : "";
                    nombre = (usuario.getNombre() + " " + apellido).trim();
                }
            }
        }

        if (productoId != null) {
            Producto producto = productoRepository.findById(productoId).orElse(null);
            nuevo.setProducto(producto);
        }

        nuevo.setContenido(contenido.trim());
        nuevo.setNombre((nombre == null || nombre.isBlank()) ? "Anónimo" : nombre.trim());

        if (calificacion != null) {
            nuevo.setCalificacion(Math.max(1, Math.min(5, calificacion)));
        }

        nuevo.setAprobado(false);

        return comentarioRepository.save(nuevo);
    }

    public List<Comentario> listarAprobados() {
        return comentarioRepository.findByAprobadoTrue();
    }

    public List<Comentario> listarAprobadosPorProducto(Integer productoId) {
        return comentarioRepository.findByProductoIdAndAprobadoTrue(productoId);
    }

    public List<Comentario> listarPendientes() {
        return comentarioRepository.findByAprobadoFalse();
    }

    public Comentario aprobar(Long comentarioId) {
        Comentario c = comentarioRepository.findById(comentarioId)
            .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        c.setAprobado(true);
        return comentarioRepository.save(c);
    }

    public void eliminar(Long comentarioId) {
        comentarioRepository.deleteById(comentarioId);
    }
}