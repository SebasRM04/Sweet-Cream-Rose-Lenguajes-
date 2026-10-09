package com.SweetCreamPink.demoSpringBoot.Modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proId")
    private Integer id;

    @Column(name = "proNombre", nullable = false, length = 50)
    private String nombre;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "catId_fk")
    private Categoria categoria;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ProductoVariante> variantes = new ArrayList<>();

    @Column(length = 255)
    private String descripcion;

    @Column
    private Double precio;

    @Column(name = "imagenUrl", length = 300)
    private String imagenUrl;

    // NUEVO: controla si el producto es visible para clientes.
    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean activo = true;
}