package com.SweetCreamPink.demoSpringBoot.service;

import com.SweetCreamPink.demoSpringBoot.DAO.DireccionDAO;
import com.SweetCreamPink.demoSpringBoot.DAO.UsuarioDAO;
import com.SweetCreamPink.demoSpringBoot.Modelo.Direccion;
import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.service.DireccionService;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DireccionServiceImpl implements DireccionService {

    private static final Logger log = LoggerFactory.getLogger(DireccionServiceImpl.class);

    private final DireccionDAO dao;
    private final UsuarioDAO   usuarioDAO;

    public DireccionServiceImpl(DireccionDAO dao, UsuarioDAO usuarioDAO) {
        this.dao        = dao;
        this.usuarioDAO = usuarioDAO;
    }

    @Override
    public Direccion agregar(Integer usuarioId, String direccion, String distrito,
                             String ciudad, String codigoPostal, String referencia,
                             boolean esPrincipal) {

        if (usuarioId == null) {
            throw new IllegalArgumentException("El ID de usuario es requerido");
        }
        Preconditions.checkArgument(direccion != null && !direccion.isBlank(),
                "La dirección no puede estar vacía");

        Usuario usuario = usuarioDAO.buscarPorId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Si la nueva es principal, quitar ese flag de las demás
        if (esPrincipal) {
            desactivarPrincipalAnterior(usuarioId);
        }

        Direccion nueva = new Direccion();
        nueva.setUsuario(usuario);
        nueva.setDireccion(direccion);
        nueva.setDistrito(distrito);
        nueva.setCiudad(ciudad);
        nueva.setCodigoPostal(codigoPostal);
        nueva.setReferencia(referencia);
        nueva.setEsPrincipal(esPrincipal);

        log.info("Nueva dirección agregada para usuarioId: {}", usuarioId);
        return dao.guardar(nueva);
    }

    @Override
    public List<Direccion> listar(Integer usuarioId) {
        return dao.listarPorUsuario(usuarioId);
    }

    @Override
    public Direccion actualizar(Long direccionId, Integer usuarioId, String direccion,
                                String distrito, String ciudad, String codigoPostal,
                                String referencia, boolean esPrincipal) {

        Direccion existing = dao.buscarPorId(direccionId)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));

        if (usuarioId == null || existing.getUsuario() == null
                || existing.getUsuario().getId() == null
                || !existing.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("No tienes permiso para modificar esta dirección");
        }

        if (esPrincipal) desactivarPrincipalAnterior(usuarioId);

        if (direccion != null && !direccion.isBlank()) existing.setDireccion(direccion);
        if (distrito   != null) existing.setDistrito(distrito);
        if (ciudad     != null) existing.setCiudad(ciudad);
        if (codigoPostal != null) existing.setCodigoPostal(codigoPostal);
        if (referencia   != null) existing.setReferencia(referencia);
        existing.setEsPrincipal(esPrincipal);

        return dao.guardar(existing);
    }

    @Override
    public void eliminar(Long direccionId, Integer usuarioId) {
        Direccion existing = dao.buscarPorId(direccionId)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));

        if (usuarioId == null || existing.getUsuario() == null
                || existing.getUsuario().getId() == null
                || !existing.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("No tienes permiso para eliminar esta dirección");
        }

        dao.eliminar(direccionId);
        log.info("Dirección {} eliminada para usuarioId: {}", direccionId, usuarioId);
    }

    private void desactivarPrincipalAnterior(Integer usuarioId) {
        dao.buscarPrincipal(usuarioId).ifPresent(d -> {
            d.setEsPrincipal(false);
            dao.guardar(d);
        });
    }
}