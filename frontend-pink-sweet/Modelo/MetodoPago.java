package com.SweetCreamPink.demoSpringBoot.Modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//? metodo de pago guardado del usuario.
//? nunca guardar el número completo de tarjeta, CVV ni fecha de expiración.
//? solo se guardan los ÚLTIMOS 4 DÍGITOS para identificar la tarjeta.
//? tipos soportados: VISA, BANCO, YAPE.

@Entity
@Table(name = "usuario_metodo_pago")
@Getter
@Setter
@NoArgsConstructor
public class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuId_fk", nullable = false)
    private Usuario usuario;

    @NotNull(message = "El tipo de pago es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoPago tipo;

    @NotBlank(message = "El alias es obligatorio")
    @Column(length = 80)
    private String alias;

    /**
     * Para VISA: últimos 4 dígitos ("**** **** **** 4321").
     * Para YAPE / BANCO: número de celular o cuenta (últimos 4 dígitos).
     */
    @Column(length = 10)
    private String ultimosDigitos;

    //* nombre del titular impreso en la tarjeta (solo para VISA)
    @Column(length = 100)
    private String titular;

    @Column(length = 80)
    private String banco;

    @Column(nullable = false)
    private boolean esPrincipal = false;

    public enum TipoPago {
        VISA, BANCO, YAPE
    }
}