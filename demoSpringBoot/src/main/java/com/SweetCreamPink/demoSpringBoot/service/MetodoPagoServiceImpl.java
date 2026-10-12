package com.SweetCreamPink.demoSpringBoot.service;

import com.SweetCreamPink.demoSpringBoot.DAO.UsuarioDAO;
import com.SweetCreamPink.demoSpringBoot.Modelo.MetodoPago;
import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.Modelo.MetodoPago.TipoPago;
import com.SweetCreamPink.demoSpringBoot.Repositorio.MetodoPagoRepository;
import com.SweetCreamPink.demoSpringBoot.service.MetodoPagoService;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MetodoPagoServiceImpl implements MetodoPagoService {

    private static final Logger log = LoggerFactory.getLogger(MetodoPagoServiceImpl.class);

    private final MetodoPagoRepository repo;
    private final UsuarioDAO           usuarioDAO;

    public MetodoPagoServiceImpl(MetodoPagoRepository repo, UsuarioDAO usuarioDAO) {
        this.repo       = repo;
        this.usuarioDAO = usuarioDAO;
    }

    @Override
    public MetodoPago agregar(Integer usuarioId, TipoPago tipo, String alias,
                              String ultimosDigitos, String titular, String banco,
                              boolean esPrincipal) {

        Preconditions.checkNotNull(tipo,  "El tipo de pago es obligatorio");
        Preconditions.checkArgument(alias != null && !alias.isBlank(), "El alias es obligatorio");

        Usuario usuario = usuarioDAO.buscarPorId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Si el nuevo método es principal, quitar flag de los demás
        if (esPrincipal) {
            repo.findByUsuarioId(usuarioId).forEach(m -> {
                m.setEsPrincipal(false);
                repo.save(m);
            });
        }

        MetodoPago metodo = new MetodoPago();
        metodo.setUsuario(usuario);
        metodo.setTipo(tipo);
        metodo.setAlias(alias);
        metodo.setUltimosDigitos(ultimosDigitos);
        metodo.setTitular(titular);
        metodo.setBanco(banco);
        metodo.setEsPrincipal(esPrincipal);

        log.info("Método de pago {} agregado para usuarioId: {}", tipo, usuarioId);
        return repo.save(metodo);
    }

    @Override
    public List<MetodoPago> listar(Integer usuarioId) {
        return repo.findByUsuarioId(usuarioId);
    }

    @Override
    public void eliminar(Long metodoId, Integer usuarioId) {
        MetodoPago metodo = repo.findById(metodoId)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        Preconditions.checkArgument(
                metodo.getUsuario().getId().equals(usuarioId),
                "No tienes permiso para eliminar este método de pago");

        repo.deleteById(metodoId);
        log.info("Método de pago {} eliminado para usuarioId: {}", metodoId, usuarioId);
    }
}