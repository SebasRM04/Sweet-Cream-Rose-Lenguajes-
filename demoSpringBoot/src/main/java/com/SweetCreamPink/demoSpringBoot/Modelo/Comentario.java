package com.SweetCreamPink.demoSpringBoot.Modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Entidad Comentario — reseña de un cliente sobre un producto.
 * Requiere aprobación del admin antes de ser pública.
 */
@Entity
@Table(name = "comentarios")
@Getter
@Setter
@NoArgsConstructor
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //* el usuario que escribió la reseña (puede ser null si no se requiere login para comentar)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuId_fk")
    private Usuario usuario;

    //* El producto sobre el que es la reseña
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proId_fk")
    private Producto producto;

    @NotBlank(message = "El contenido no puede estar vacío")
    @Column(nullable = false, length = 500)
    private String contenido;

    @Column(length = 100)
    private String nombre; //* nombre visible del autor

    @Column
    private Integer calificacion;

    @Column(nullable = false)
    private boolean aprobado = false; 

    @Column
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}