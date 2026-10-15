package com.SweetCreamPink.demoSpringBoot.Modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuario")
@Getter @Setter @NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usu_id")
    private Integer id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(name = "usu_nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "usu_apellido", length = 100)
    private String apellido;

    @NotBlank @Email
    @Column(name = "usu_correo", nullable = false, unique = true, length = 150)
    private String correo;

    @NotBlank
    @Column(name = "usu_contrasena", nullable = false)
    private String contrasena;

    @Size(max = 20)
    @Column(name = "usu_telefono", length = 20)
    private String telefono;

    @Column(name = "usu_fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "usu_genero", length = 20)
    private String genero;

    @Column(name = "usu_fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCrear() {
        if (this.fechaRegistro == null) {
            this.fechaRegistro = LocalDateTime.now();
        }
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id_fk")
    private Rol rol;

    @Column(name = "reset_token", length = 200)
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Direccion> direcciones = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MetodoPago> metodosPago = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Orden> ordenes = new ArrayList<>();
}