package com.SweetCreamPink.demoSpringBoot.DTO;

import com.SweetCreamPink.demoSpringBoot.Modelo.Direccion;

/**
 * DTO de Dirección — evita exponer la entidad Usuario completa
 * (con sus colecciones @OneToMany lazy: direcciones, metodosPago, ordenes),
 * que provoca HttpMessageNotWritableException / LazyInitializationException
 * al serializar a JSON fuera de una sesión de Hibernate abierta.
 */
public class DireccionDTO {

    private Long id;
    private String direccion;
    private String distrito;
    private String ciudad;
    private String codigoPostal;
    private String referencia;
    private boolean esPrincipal;
    private Integer usuarioId;

    public DireccionDTO() {}

    public static DireccionDTO fromEntity(Direccion d) {
        DireccionDTO dto = new DireccionDTO();
        dto.id           = d.getId();
        dto.direccion    = d.getDireccion();
        dto.distrito     = d.getDistrito();
        dto.ciudad       = d.getCiudad();
        dto.codigoPostal = d.getCodigoPostal();
        dto.referencia   = d.getReferencia();
        dto.esPrincipal  = d.isEsPrincipal();
        dto.usuarioId    = (d.getUsuario() != null) ? d.getUsuario().getId() : null;
        return dto;
    }

    // ── Getters y Setters ──────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getDistrito() { return distrito; }
    public void setDistrito(String distrito) { this.distrito = distrito; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }

    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }

    public boolean isEsPrincipal() { return esPrincipal; }
    public void setEsPrincipal(boolean esPrincipal) { this.esPrincipal = esPrincipal; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
}