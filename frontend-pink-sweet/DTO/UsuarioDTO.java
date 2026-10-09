package com.SweetCreamPink.demoSpringBoot.DTO;

public class UsuarioDTO {
    private String nombre;
    private String email;
    private String rol;

    // Constructores, Getters y Setters
    public UsuarioDTO(String nombre, String email, String rol) {
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }
    
    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public void setNombre(String nombre) {this.nombre = nombre;}
    public String getNombre() { return nombre; }
    
    public String getRol() { return rol; }
    public void setRol(String rol) {this.rol = rol;}
}
