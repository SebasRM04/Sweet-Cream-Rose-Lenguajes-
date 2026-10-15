package com.SweetCreamPink.demoSpringBoot.Repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.SweetCreamPink.demoSpringBoot.Modelo.Oferta;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Integer> {

    List<Oferta> findByOferActivaTrue();

    //* Query manual: ofertas activas cuyas fechas incluyen la fecha de hoy
    //* Usado en AdminOfertasController.ofertasVigentesPublico() → endpoint PÚBLICO /api/ofertas/vigentes
    @Query("SELECT o FROM Oferta o WHERE o.oferActiva = true " +
           "AND o.oferFechaInicio <= :hoy AND o.oferFechaFin >= :hoy")
    List<Oferta> findVigentes(@Param("hoy") LocalDate hoy);

    //* el campo @Id en Producto.java se llama "id" (aunque la columna BD sea "proId")
    //* Por eso la query usa "o.producto.id", no "o.producto.proId"
    @Query("SELECT o FROM Oferta o WHERE o.producto.id = :proId")
    List<Oferta> findByProductoId(@Param("proId") Integer proId);

    //* NUEVO: busca si un producto puntual tiene una oferta vigente ahora mismo.
    //* Usado en CarritoController para aplicar el descuento automáticamente al agregar al carrito.
    @Query("SELECT o FROM Oferta o WHERE o.producto.id = :proId AND o.oferActiva = true " +
           "AND o.oferFechaInicio <= :hoy AND o.oferFechaFin >= :hoy")
    Optional<Oferta> findVigentePorProducto(@Param("proId") Integer proId, @Param("hoy") LocalDate hoy);

    @Query("SELECT o FROM Oferta o WHERE o.oferActiva = true AND o.oferFechaFin < :hoy")
    List<Oferta> findExpiradas(@Param("hoy") LocalDate hoy);

    @Query("SELECT o FROM Oferta o WHERE o.oferActiva = false " +
           "AND o.oferFechaInicio <= :hoy AND o.oferFechaFin >= :hoy")
    List<Oferta> findParaActivar(@Param("hoy") LocalDate hoy);
}