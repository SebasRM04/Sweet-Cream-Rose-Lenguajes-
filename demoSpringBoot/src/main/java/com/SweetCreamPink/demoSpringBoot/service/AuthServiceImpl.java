package com.SweetCreamPink.demoSpringBoot.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.SweetCreamPink.demoSpringBoot.DAO.UsuarioDAO;
import com.SweetCreamPink.demoSpringBoot.Modelo.Rol;
import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.Repositorio.RolRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;
import com.SweetCreamPink.demoSpringBoot.Seguridad.JwtUtil;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UsuarioDAO        usuarioDAO;
    private final PasswordEncoder   passwordEncoder;
    private final JwtUtil           jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository     rolRepository;
    // NUEVO: servicio de correo para enviar el enlace de recuperación real
    private final EmailService      emailService;

    // NUEVO: URL base del frontend, configurable por ambiente (dev/prod)
    @Value("${app.frontend-url}")
    private String frontendUrl;

    public AuthServiceImpl(UsuarioDAO usuarioDAO,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           UsuarioRepository usuarioRepository,
                           RolRepository rolRepository,
                           EmailService emailService) {
        this.usuarioDAO        = usuarioDAO;
        this.passwordEncoder   = passwordEncoder;
        this.jwtUtil           = jwtUtil;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository     = rolRepository;
        this.emailService      = emailService;
    }

    @Override
    public Usuario registrar(String nombre, String apellido,
                             String correo, String contrasena, String telefono) {

        // ── Validaciones básicas ──────────────────────────────────────────────
        if (nombre == null || nombre.isBlank())
            throw new IllegalArgumentException("El nombre es obligatorio");

        if (!Character.isUpperCase(nombre.charAt(0)))
            throw new IllegalArgumentException("El nombre debe comenzar con mayúscula");

        if (apellido == null || apellido.isBlank())
            throw new IllegalArgumentException("El apellido es obligatorio");

        if (!Character.isUpperCase(apellido.charAt(0)))
            throw new IllegalArgumentException("El apellido debe comenzar con mayúscula");

        if (correo == null || correo.isBlank())
            throw new IllegalArgumentException("El correo es obligatorio");

        if (!correo.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$"))
            throw new IllegalArgumentException("El correo no tiene un formato válido");

        if (contrasena == null || contrasena.length() < 6)
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");

        if (usuarioDAO.existePorCorreo(correo))
            throw new IllegalArgumentException("Ya existe una cuenta con ese correo");

        // ── Crear y guardar usuario ───────────────────────────────────────────
        Usuario u = new Usuario();
        u.setNombre(nombre.trim());
        u.setApellido(apellido.trim());
        u.setCorreo(correo.trim().toLowerCase());
        u.setTelefono(telefono != null ? telefono.trim() : null);
        u.setContrasena(passwordEncoder.encode(contrasena));
        u.setRol(obtenerRolCliente());

        Usuario guardado = usuarioDAO.guardar(u);
        log.info("Nuevo usuario registrado: {}", correo);
        return guardado;
    }

    private Rol obtenerRolCliente() {
        return rolRepository.findByDescripcionIgnoreCase("Cliente")
                .orElseGet(() -> {
                    Rol rolCliente = new Rol();
                    rolCliente.setDescripcion("Cliente");
                    return rolRepository.save(rolCliente);
                });
    }

    @Override
    public String login(String correo, String contrasena) {
        Usuario u = usuarioDAO.buscarPorCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        if (!passwordEncoder.matches(contrasena, u.getContrasena()))
            throw new RuntimeException("Credenciales incorrectas");

        String rolNombre = (u.getRol() != null)
                ? u.getRol().getDescripcion().toUpperCase()
                : "CLIENTE";

        String token = jwtUtil.generarToken(u.getCorreo(), rolNombre);
        log.info("Login exitoso para: {} con rol {}", correo, rolNombre);
        return token;
    }

    @Override
    public void solicitarRecuperacion(String correo) {
        Optional<Usuario> opt = usuarioDAO.buscarPorCorreo(correo);
        if (opt.isEmpty()) {
            // Validación de existencia del correo: si no existe, no hacemos nada,
            // pero tampoco lo informamos al frontend (previene enumeración de usuarios).
            log.info("Solicitud de recuperación para correo inexistente: {}", correo);
            return;
        }
        Usuario u = opt.get();
        String token = jwtUtil.generarTokenReset(correo);
        u.setResetToken(token);
        u.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        usuarioDAO.guardar(u);

        // NUEVO: construir el enlace real y enviarlo por correo (antes solo se logueaba)
        String enlace = frontendUrl + "/cambiar-password-3?token=" + token;
        emailService.enviarCorreoRecuperacion(u.getCorreo(), enlace);

        log.info("Solicitud de recuperación procesada para: {}", correo);
    }

    @Override
    public void restablecerContrasena(String token, String nuevaContrasena) {
        if (token == null || token.isBlank())
            throw new RuntimeException("Token inválido");
        if (nuevaContrasena == null || nuevaContrasena.length() < 6)
            throw new RuntimeException("La nueva contraseña debe tener al menos 6 caracteres");

        // Verificación del token (equivalente a la "verificación del código enviado al correo")
        Usuario u = usuarioRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido o expirado"));

        if (u.getResetTokenExpiry() == null || u.getResetTokenExpiry().isBefore(LocalDateTime.now()))
            throw new RuntimeException("El token ha expirado. Solicita uno nuevo.");

        // Restablecimiento + confirmación de que la nueva contraseña queda actualizada en BD
        u.setContrasena(passwordEncoder.encode(nuevaContrasena));
        u.setResetToken(null);
        u.setResetTokenExpiry(null);
        usuarioDAO.guardar(u);
        log.info("Contraseña restablecida para: {}", u.getCorreo());
    }
}