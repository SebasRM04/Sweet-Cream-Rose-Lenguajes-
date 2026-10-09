package com.SweetCreamPink.demoSpringBoot.Modelo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

//? una oferta tiene título, descripción, porcentaje de descuento y fechas de vigencia.
//? si producto=null → la oferta aplica a TODA la tienda.
//? si producto tiene valor → aplica solo a ese producto específico.
//? oferActiva=false para desactivar sin borrar

@Entity
@Table(name = "oferta")
public class Oferta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer oferId;

    @Column(nullable = false, length = 100)
    private String oferTitulo;

    @Column(columnDefinition = "TEXT")
    private String oferDescripcion;

    /**
     * Porcentaje de descuento, ej: 20.00 = 20%
     */
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal oferDescuento;

    @Column(nullable = false)
    private LocalDate oferFechaInicio;

    @Column(nullable = false)
    private LocalDate oferFechaFin;

    @Column(nullable = false)
    private Boolean oferActiva = true;

    /**
     * Si es NULL, la oferta aplica a toda la tienda.
     * Si tiene valor, aplica solo a ese producto.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "proId_fk")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Producto producto;

    // --- Getters y Setters ---
    public Integer getOferId() { return oferId; }
    public void setOferId(Integer oferId) { this.oferId = oferId; }

    public String getOferTitulo() { return oferTitulo; }
    public void setOferTitulo(String oferTitulo) { this.oferTitulo = oferTitulo; }

    public String getOferDescripcion() { return oferDescripcion; }
    public void setOferDescripcion(String oferDescripcion) { this.oferDescripcion = oferDescripcion; }

    public BigDecimal getOferDescuento() { return oferDescuento; }
    public void setOferDescuento(BigDecimal oferDescuento) { this.oferDescuento = oferDescuento; }

    public LocalDate getOferFechaInicio() { return oferFechaInicio; }
    public void setOferFechaInicio(LocalDate oferFechaInicio) { this.oferFechaInicio = oferFechaInicio; }

    public LocalDate getOferFechaFin() { return oferFechaFin; }
    public void setOferFechaFin(LocalDate oferFechaFin) { this.oferFechaFin = oferFechaFin; }

    public Boolean getOferActiva() { return oferActiva; }
    public void setOferActiva(Boolean oferActiva) { this.oferActiva = oferActiva; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
}