package com.SweetCreamPink.demoSpringBoot.Modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "detalles_orden")
@Getter
@Setter
@NoArgsConstructor
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detoId")
    private Integer id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordId_fk")
    private Orden orden;  //* a que orden pertenece este detalle

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "proId_fk")
    private Producto producto; //* Que producto se pidio

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "varId_fk")
    private ProductoVariante variante;

    @Column(name = "detoCantidad")
    private Integer cantidad;

    @Column(name = "detoPrecio")
    private Double precio;

    @Column(name = "detoSubTotal")
    private Double subTotal;

    //* @PrePersist/@PreUpdate → calcula el subtotal antes de guardar desde Spring.
    @PrePersist
    @PreUpdate
    public void calcularSubtotal() {
        if (cantidad != null && precio != null) {
            this.subTotal = cantidad * precio;
        }
    }
}