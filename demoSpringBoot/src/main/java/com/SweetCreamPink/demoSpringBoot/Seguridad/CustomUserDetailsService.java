package com.SweetCreamPink.demoSpringBoot.Seguridad;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;

import java.util.List;

/**
 * Servicio que Spring Security usa para cargar un usuario por correo.
 * El "username" en este proyecto es el correo electrónico.
 */
//* spring Security depende de la interfaz UserDetailsService, no de esta clase directo.
//* conecta con: UsuarioRepository → tabla `usuario`

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository repo;

    public CustomUserDetailsService(UsuarioRepository repo) {
        this.repo = repo;
    }

    //* spring Security llama a este método usando el correo como "username"
    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = repo.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado con correo: " + correo));

        //* el rol se guarda como "Admin" o "Cliente" en la BD.
        //* spring Security requiere el prefijo "ROLE_" para que hasRole("ADMIN") funcione.
        String rol = "ROLE_" + (usuario.getRol() != null
                ? usuario.getRol().getDescripcion().toUpperCase()
                : "CLIENTE");

        return new User(
                usuario.getCorreo(),
                usuario.getContrasena(),
                List.of(new SimpleGrantedAuthority(rol))
        );
    }
}