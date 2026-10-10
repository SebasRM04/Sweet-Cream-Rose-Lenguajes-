package com.SweetCreamPink.demoSpringBoot.Seguridad;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//* se encadena con otros filtros de Spring Security.
//* oncePerRequestFilter garantiza que este filtro se ejecuta UNA SOLA VEZ por request.

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    //* rutas que se SALTAN este filtro completamente.
    //* deben estar sincronizadas con las rutas públicas de SecurityConfig.
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path   = request.getServletPath();
        String method = request.getMethod();
        return method.equals("OPTIONS")
            || path.startsWith("/actuator/")
            || path.startsWith("/api/auth/")
            || path.startsWith("/api/productos")
            || path.startsWith("/api/comentarios/aprobados")
            || path.equals("/api/ofertas/vigentes")
            || path.startsWith("/uploads/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        //* lee el header "Authorization: Bearer <token>"
        String authHeader = request.getHeader("Authorization");

        //* si no viene token, deja pasar el request
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); //* quita el "Bearer " del inicio

        //* si el token es inválido o expirado, deja pasar
        if (!jwtUtil.esValido(token)) {
            log.warn("Token inválido en request a: {}", request.getRequestURI());
            chain.doFilter(request, response);
            return;
        }

        String correo = jwtUtil.extraerCorreo(token);

        //* si hay correo válido y todavía no hay autenticación en el contexto, la inyecta
        if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            //* carga el usuario desde la BD usando CustomUserDetailsService → UsuarioRepository
            var userDetails = userDetailsService.loadUserByUsername(correo);
            var authToken   = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            //* guarda la autenticación en el contexto — a partir de aquí Spring sabe quién eres
            SecurityContextHolder.getContext().setAuthentication(authToken);
            log.debug("Usuario autenticado vía JWT: {}", correo);
        }

        chain.doFilter(request, response);
    }
}