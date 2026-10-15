package com.SweetCreamPink.demoSpringBoot.Repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

//* Spring Data JPA genera las queries SQL automáticamente por el nombre del método.
//* TDD-friendly: fácil de mockear con @MockBean en tests.
//* SOLID — DIP: los servicios dependen de esta interfaz, no de una implementación concreta.

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
    Optional<Usuario> findByResetToken(String token);

    @Query("SELECT u FROM Usuario u WHERE u.resetToken IS NOT NULL AND u.resetTokenExpiry < :ahora")
    List<Usuario> findConTokenExpirado(@Param("ahora") LocalDateTime ahora);
}