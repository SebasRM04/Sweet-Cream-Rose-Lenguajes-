package com.SweetCreamPink.demoSpringBoot.Seguridad;

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Value("${cors.allowed-origins}")
    private String allowedOriginsRaw;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios/registrar", "/registrar").permitAll()
                .requestMatchers(HttpMethod.GET, "/", "/login", "/registro", "/error").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/uploads/**", "/assets/**").permitAll()
                .requestMatchers(EndpointRequest.to("health", "prometheus", "info")).permitAll()

                .requestMatchers(HttpMethod.POST,
                    "/api/admin/auth/verificar-admin",
                    "/api/admin/auth/pin"
                ).permitAll()

                // ── Endpoints públicos de lectura ──────────────────────────
                .requestMatchers(HttpMethod.GET,
                        "/api/productos/**",
                        "/api/comentarios/aprobados/**",
                        "/api/ofertas/vigentes"
                ).permitAll()
                .requestMatchers(HttpMethod.POST, "/api/comentarios").permitAll()

                // ── Reglas de administrador ────────────────────────────────
                // Mantener protección general, pero permitir puntos concretos arriba
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/productos/guardar").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/comentarios/*/aprobar").hasRole("ADMIN")

                // ── Reglas de cliente autenticado ──────────────────────────
                .requestMatchers("/api/perfil/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/direcciones/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/metodos-pago/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/ordenes/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/carrito/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/favoritos/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/configuracion/**").hasAnyRole("CLIENTE", "ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        if (allowedOriginsRaw != null && !allowedOriginsRaw.isEmpty()) {
            config.setAllowedOrigins(Arrays.asList(allowedOriginsRaw.split(",")));
        } else {
            config.setAllowedOrigins(List.of("http://localhost:3000"));
        }
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}