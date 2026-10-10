package com.SweetCreamPink.demoSpringBoot.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/configuracion")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ConfiguracionController {

    @Autowired
    private UsuarioRepository usuarioRepo;

    // FIX: BCryptPasswordEncoder no tiene @Bean aquí, se inyecta el PasswordEncoder del contexto
    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Actualizar Información de la cuenta
    @PutMapping("/actualizar-datos/{id}")
    public ResponseEntity<?> actualizarDatos(@PathVariable Integer id, @RequestBody Map<String, String> datos) {
        return usuarioRepo.findById(id).map(user -> {
            // FIX: Usuario no tiene setFechaNacimiento ni setGenero → se usan solo los campos que SÍ existen
            if (datos.get("nombre")    != null) user.setNombre(datos.get("nombre"));
            if (datos.get("apellido")  != null) user.setApellido(datos.get("apellido"));
            if (datos.get("telefono")  != null) user.setTelefono(datos.get("telefono"));
            usuarioRepo.save(user);
            return ResponseEntity.ok(Map.of("mensaje", "Información de cuenta actualizada"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 2. Cambiar Contraseña
    // FIX: ID Integer, y usar getContrasena()/setContrasena() (no getPassword/setPassword)
    @PostMapping("/cambiar-password/{id}")
    public ResponseEntity<?> cambiarPassword(@PathVariable Integer id,
                                             @RequestBody Map<String, String> passwords) {
        String actual = passwords.get("actual");
        String nueva  = passwords.get("nueva");

        return usuarioRepo.findById(id).map(user -> {
            // FIX: getContrasena() es el método correcto en la entidad Usuario
            if (!passwordEncoder.matches(actual, user.getContrasena())) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "La contraseña actual es incorrecta"));
            }
            // FIX: setContrasena() es el método correcto
            user.setContrasena(passwordEncoder.encode(nueva));
            usuarioRepo.save(user);
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada exitosamente"));
        }).orElse(ResponseEntity.notFound().build());
    }
}