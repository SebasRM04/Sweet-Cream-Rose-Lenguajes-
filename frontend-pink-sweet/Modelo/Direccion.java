package com.SweetCreamPink.demoSpringBoot.Modelo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuario_direccion")
@Getter
@Setter
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "direccion", nullable = false, length = 255)
    private String direccion;

    @Column(name = "distrito", nullable = false, length = 100)
    private String distrito;

    @Column(name = "ciudad", length = 100)
    private String ciudad = "Lima"; // Valor predeterminado para evitar nulos

    @Column(name = "codigo_postal", length = 20)
    private String codigoPostal = "15001";

    @Column(name = "referencia", length = 255)
    private String referencia;

    @Column(name = "es_principal", nullable = false)
    private boolean esPrincipal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usu_id_fk", nullable = false)
    @JsonIgnoreProperties({"direcciones", "metodosPago", "ordenes", "contrasena", "rol"})
    private Usuario usuario;
}