package com.SweetCreamPink.demoSpringBoot.service;

import com.SweetCreamPink.demoSpringBoot.Modelo.Oferta;
import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OfertaRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OrdenRepository;
import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduledTasksService {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasksService.class);

    private final OfertaRepository ofertaRepository;
    private final UsuarioRepository usuarioRepository;
    private final OrdenRepository ordenRepository;

    @Value("${app.cron.dias-pedido-pendiente:7}")
    private int diasPedidoPendiente;

    public ScheduledTasksService(OfertaRepository ofertaRepository,
                                 UsuarioRepository usuarioRepository,
                                 OrdenRepository ordenRepository) {
        this.ofertaRepository = ofertaRepository;
        this.usuarioRepository = usuarioRepository;
        this.ordenRepository = ordenRepository;
    }

    @Scheduled(cron = "${app.cron.desactivar-ofertas}")
    @Transactional
    public void desactivarOfertasVencidas() {
        LocalDate hoy = LocalDate.now();
        List<Oferta> expiradas = ofertaRepository.findExpiradas(hoy);

        for (Oferta oferta : expiradas) {
            oferta.setOferActiva(false);
        }

        if (!expiradas.isEmpty()) {
            ofertaRepository.saveAll(expiradas);
            log.info("[CRON] Desactivadas {} ofertas vencidas", expiradas.size());
        }
    }

    @Scheduled(cron = "${app.cron.activar-ofertas}")
    @Transactional
    public void activarOfertasVigentes() {
        LocalDate hoy = LocalDate.now();
        List<Oferta> paraActivar = ofertaRepository.findParaActivar(hoy);

        for (Oferta oferta : paraActivar) {
            oferta.setOferActiva(true);
        }

        if (!paraActivar.isEmpty()) {
            ofertaRepository.saveAll(paraActivar);
            log.info("[CRON] Activadas {} ofertas vigentes", paraActivar.size());
        }
    }

    @Scheduled(cron = "${app.cron.limpiar-tokens}")
    @Transactional
    public void limpiarTokensExpirados() {
        LocalDateTime ahora = LocalDateTime.now();
        List<Usuario> usuarios = usuarioRepository.findConTokenExpirado(ahora);

        for (Usuario usuario : usuarios) {
            usuario.setResetToken(null);
            usuario.setResetTokenExpiry(null);
        }

        if (!usuarios.isEmpty()) {
            usuarioRepository.saveAll(usuarios);
            log.info("[CRON] Limpiados {} tokens de recuperación expirados", usuarios.size());
        }
    }

    @Scheduled(cron = "${app.cron.cancelar-pedidos}")
    @Transactional
    public void cancelarPedidosPendientesAntiguos() {
        LocalDateTime limite = LocalDateTime.now().minusDays(diasPedidoPendiente);
        List<Orden> pendientes = ordenRepository.findByEstadoAndFechaBefore(
                Orden.EstadoOrden.Pendiente, limite);

        for (Orden orden : pendientes) {
            orden.setEstado(Orden.EstadoOrden.Cancelado);
        }

        if (!pendientes.isEmpty()) {
            ordenRepository.saveAll(pendientes);
            log.info("[CRON] Cancelados {} pedidos pendientes con más de {} días",
                    pendientes.size(), diasPedidoPendiente);
        }
    }
}
