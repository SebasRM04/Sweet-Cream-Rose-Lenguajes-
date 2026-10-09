package com.SweetCreamPink.demoSpringBoot.DTO;

import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;

import java.time.LocalDate;
import java.time.LocalDateTime;

// ════════════════════════════════════════════════════════════════════════
//  DTO: PerfilUsuarioDTO
//  Representa SOLO los campos del perfil que el frontend necesita.
//  Evita exponer la entidad Usuario completa (con sus colecciones
//  @OneToMany lazy: direcciones, metodosPago, ordenes), que provocaba
//  HttpMessageNotWritableException / LazyInitializationException
//  al serializar a JSON fuera de una sesión de Hibernate abierta.
// ════════════════════════════════════════════════════════════════════════
public class PerfilUsuarioDTO {

    private Integer id;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String genero;
    private LocalDateTime fechaRegistro;
    private String rol;

    public PerfilUsuarioDTO() {}

    /**
     * Construye el DTO a partir de la entidad Usuario.
     * IMPORTANTE: debe llamarse mientras la sesión de Hibernate sigue
     * abierta si se llegara a necesitar alguna colección lazy (aquí no
     * se necesita ninguna, por eso es seguro llamarlo después del fetch).
     */
    public static PerfilUsuarioDTO fromEntity(Usuario u) {
        PerfilUsuarioDTO dto = new PerfilUsuarioDTO();
        dto.id              = u.getId();
        dto.nombre          = u.getNombre();
        dto.apellido        = u.getApellido();
        dto.correo          = u.getCorreo();
        dto.telefono        = u.getTelefono();
        dto.fechaNacimiento = u.getFechaNacimiento();
        dto.genero          = u.getGenero();
        dto.fechaRegistro   = u.getFechaRegistro();
        dto.rol             = (u.getRol() != null) ? u.getRol().getDescripcion().toUpperCase() : "CLIENTE";
        return dto;
    }

    // ── Getters y Setters ──────────────────────────────────────────────

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}