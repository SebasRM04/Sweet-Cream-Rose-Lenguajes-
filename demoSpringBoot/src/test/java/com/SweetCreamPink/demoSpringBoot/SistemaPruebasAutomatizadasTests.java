package com.SweetCreamPink.demoSpringBoot;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SistemaPruebasAutomatizadasTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("TEST-01: Consulta pública del catálogo activo (/api/productos)")
    void testListarProductosActivos() throws Exception {
        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("TEST-02 (CP-01): Inicio de sesión exitoso de cliente y generación de JWT")
    void testLoginClienteExitoso() throws Exception {
        String bodyJson = """
                {
                    "correo": "maria@gmail.com",
                    "contrasena": "123456"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bodyJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    @DisplayName("TEST-03: Rechazo de login con credenciales inválidas (HTTP 401)")
    void testLoginCredencialesIncorrectas() throws Exception {
        String bodyJson = """
                {
                    "correo": "maria@gmail.com",
                    "contrasena": "clave_erronea_999"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bodyJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Credenciales incorrectas"));
    }

    @Test
    @DisplayName("TEST-04 (CP-03): Bloqueo de acceso admin con PIN incorrecto (HTTP 401)")
    void testBloqueoAdminPinIncorrecto() throws Exception {
        String bodyJson = """
                {
                    "correo": "admin@gmail.com",
                    "pin": "0000"
                }
                """;

        mockMvc.perform(post("/api/admin/auth/pin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bodyJson))
                .andExpect(status().isUnauthorized());
    }
}