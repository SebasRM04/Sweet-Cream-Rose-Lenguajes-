package com.SweetCreamPink.demoSpringBoot.DAO;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.SweetCreamPink.demoSpringBoot.Modelo.Direccion;
import com.SweetCreamPink.demoSpringBoot.Repositorio.DireccionRepository;

@Component
public class DireccionDAOImpl implements DireccionDAO {

    private final DireccionRepository repo;

    public DireccionDAOImpl(DireccionRepository repo) {
        this.repo = repo;
    }

    @Override
    public Direccion guardar(Direccion direccion) {
        return repo.save(direccion);
    }

    @Override
    public Optional<Direccion> buscarPorId(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<Direccion> listarPorUsuario(Integer usuarioId) {
        return repo.findByUsuarioId(usuarioId);
    }

    @Override
    public Optional<Direccion> buscarPrincipal(Integer usuarioId) {
        return repo.findByUsuarioIdAndEsPrincipalTrue(usuarioId);
    }

    @Override
    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}