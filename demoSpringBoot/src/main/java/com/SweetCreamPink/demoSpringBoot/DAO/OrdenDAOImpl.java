package com.SweetCreamPink.demoSpringBoot.DAO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OrdenRepository;

import java.util.List;
import java.util.Optional;

@Repository
public class OrdenDAOImpl implements OrdenDAO {

    private static final Logger log = LoggerFactory.getLogger(OrdenDAOImpl.class);
    private final OrdenRepository repo;

    public OrdenDAOImpl(OrdenRepository repo) {
        this.repo = repo;
    }

    @Override
    public Orden guardar(Orden orden) {
        log.debug("Guardando orden para usuarioId: {}", orden.getUsuario().getId());
        return repo.save(orden);
    }

    @Override
    public Optional<Orden> buscarPorId(Integer id) {
        return repo.findById(id);
    }

    @Override
    public List<Orden> historialPorUsuario(Integer usuarioId) {
        log.debug("Consultando historial para usuarioId: {}", usuarioId);
        return repo.findByUsuario_IdOrderByFechaDesc(usuarioId);
    }

    @Override
    public List<Orden> listarTodas() {
        return repo.findAll();
    }
}