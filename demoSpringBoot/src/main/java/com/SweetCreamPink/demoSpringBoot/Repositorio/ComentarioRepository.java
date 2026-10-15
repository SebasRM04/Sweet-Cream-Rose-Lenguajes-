package com.SweetCreamPink.demoSpringBoot.Repositorio;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.SweetCreamPink.demoSpringBoot.Modelo.Comentario;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByAprobadoTrue(); //* Comentarios visibles al público
    List<Comentario> findByAprobadoFalse(); //* Pendientes de moderación (para el admin)
    List<Comentario> findByProductoIdAndAprobadoTrue(Integer productoId); //* Reseñas de un producto
}