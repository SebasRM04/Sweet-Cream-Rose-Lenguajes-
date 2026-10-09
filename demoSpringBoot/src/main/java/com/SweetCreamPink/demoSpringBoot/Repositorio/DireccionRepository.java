package com.SweetCreamPink.demoSpringBoot.Repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SweetCreamPink.demoSpringBoot.Modelo.Direccion;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio Direccion — busca solo las direcciones del usuario autenticado.
 * Principio SOLID ISP: interfaz pequeña y específica.
 */
@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    /** Todas las direcciones de un usuario */
    List<Direccion> findByUsuarioId(Integer usuarioId);

    /** Dirección principal del usuario */
    Optional<Direccion> findByUsuarioIdAndEsPrincipalTrue(Integer usuarioId);
}