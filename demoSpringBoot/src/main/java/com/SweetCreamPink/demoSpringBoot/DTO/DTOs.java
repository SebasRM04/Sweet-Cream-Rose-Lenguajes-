package com.SweetCreamPink.demoSpringBoot.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.SweetCreamPink.demoSpringBoot.Modelo.MetodoPago.TipoPago;
import com.SweetCreamPink.demoSpringBoot.Modelo.Orden.MetodoPagoOrden;

// ════════════════════════════════════════════════════════
//  LOGIN REQUEST
// ════════════════════════════════════════════════════════
@Data class LoginRequest {
    @NotBlank @Email public String correo;
    @NotBlank         public String contrasena;
}

// ════════════════════════════════════════════════════════
//  LOGIN RESPONSE — devuelve JWT y datos básicos
// ════════════════════════════════════════════════════════
@Data @AllArgsConstructor class LoginResponse {
    public String  token;
    public Integer id;
    public String  nombre;
    public String  correo;
    public String  rol;
}

// ════════════════════════════════════════════════════════
//  OLVIDÉ MI CONTRASEÑA — solo necesita el correo
// ════════════════════════════════════════════════════════
@Data class OlvideContrasenaRequest {
    @NotBlank @Email public String correo;
}

// ════════════════════════════════════════════════════════
//  RESTABLECER CONTRASEÑA — token + nueva contraseña
// ════════════════════════════════════════════════════════
@Data class RestablecerContrasenaRequest {
    @NotBlank public String token;
    @NotBlank @Size(min = 6) public String nuevaContrasena;
}

// ════════════════════════════════════════════════════════
//  PERFIL USUARIO — datos editables del perfil
// ════════════════════════════════════════════════════════
@Data class PerfilRequest {
    @Size(max = 100) public String nombre;
    @Size(max = 100) public String apellido;
    @Size(max = 20)  public String telefono;
}

// ════════════════════════════════════════════════════════
//  DIRECCIÓN REQUEST
// ════════════════════════════════════════════════════════
@Data class DireccionRequest {
    @NotBlank public String direccion;
    public String distrito;
    public String ciudad;
    public String codigoPostal;
    public String referencia;
    public boolean esPrincipal;
}

// ════════════════════════════════════════════════════════
//  MÉTODO DE PAGO REQUEST
// ════════════════════════════════════════════════════════
@Data class MetodoPagoRequest {
    public TipoPago tipo;         // VISA, BANCO, YAPE
    @NotBlank public String alias;
    public String ultimosDigitos; // solo últimos 4 dígitos
    public String titular;
    public String banco;
    public boolean esPrincipal;
}

// ════════════════════════════════════════════════════════
//  CREAR ORDEN REQUEST
// ════════════════════════════════════════════════════════
@Data class CrearOrdenRequest {
    public Integer      usuarioId;
    public String       direccionEntrega;
    public MetodoPagoOrden metodoPago;
    public List<DetalleOrdenRequest> detalles;
}

// ════════════════════════════════════════════════════════
//  DETALLE ORDEN REQUEST
// ════════════════════════════════════════════════════════
@Data class DetalleOrdenRequest {
    public Integer productoId;
    public Integer varianteId;
    public Integer cantidad;
    public Double  precio;
}

// ════════════════════════════════════════════════════════
//  HISTORIAL ORDEN RESPONSE — para el perfil del usuario
// ════════════════════════════════════════════════════════
@Data @AllArgsConstructor @NoArgsConstructor
class OrdenResumenDTO {
    public Integer       id;
    public LocalDateTime fecha;
    public Double        total;
    public String        estado;
    public String        metodoPago;
    public String        direccionEntrega;
    public List<DetalleResumenDTO> detalles;
}

// ════════════════════════════════════════════════════════
//  DETALLE RESUMEN — línea del pedido en historial
// ════════════════════════════════════════════════════════
@Data @AllArgsConstructor @NoArgsConstructor
class DetalleResumenDTO {
    public String  nombreProducto;
    public String  nombreVariante;
    public Integer cantidad;
    public Double  precio;
    public Double  subTotal;
}

// ════════════════════════════════════════════════════════
//  COMENTARIO REQUEST
// ════════════════════════════════════════════════════════
@Data class ComentarioRequest {
    @NotBlank public String contenido;
    public String nombre;
    public Integer calificacion; // 1-5
    public Integer productoId;
}