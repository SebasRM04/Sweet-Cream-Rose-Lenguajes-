package com.SweetCreamPink.demoSpringBoot.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// ════════════════════════════════════════════════════════════
//  DTO: RegistroRequest — datos para crear una nueva cuenta
// ════════════════════════════════════════════════════════════
@Data
class RegistroRequest {
    @NotBlank @Size(max = 100)
    public String nombre;

    @Size(max = 100)
    public String apellido;

    @NotBlank @Email
    public String correo;

    @NotBlank @Size(min = 6, max = 100)
    public String contrasena;

    @Size(max = 20)
    public String telefono;
}