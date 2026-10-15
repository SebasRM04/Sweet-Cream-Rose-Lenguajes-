package com.SweetCreamPink.demoSpringBoot.DAO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.SweetCreamPink.demoSpringBoot.Modelo.Usuario;
import com.SweetCreamPink.demoSpringBoot.Repositorio.UsuarioRepository;

import java.util.List;
import java.util.Optional;

/**
 * Implementación del DAO de Usuario.
 * Utiliza Logback para registrar operaciones críticas.
 * Aplica SRP: solo gestiona el acceso a datos de Usuario.
 */
@Repository
public class UsuarioDAOImpl implements UsuarioDAO {

    private static final Logger log = LoggerFactory.getLogger(UsuarioDAOImpl.class);

    private final UsuarioRepository repo;

    public UsuarioDAOImpl(UsuarioRepository repo) {
        this.repo = repo;
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        log.debug("Guardando usuario con correo: {}", usuario.getCorreo());
        return repo.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorId(Integer id) {
        log.debug("Buscando usuario por ID: {}", id);
        return repo.findById(id);
    }

    @Override
    public Optional<Usuario> buscarPorCorreo(String correo) {
        log.debug("Buscando usuario por correo: {}", correo);
        return repo.findByCorreo(correo);
    }

    @Override
    public Optional<Usuario> buscarPorResetToken(String token) {
        log.debug("Buscando usuario por reset token");
        return repo.findByResetToken(token);
    }

    @Override
    public List<Usuario> listarTodos() {
        return repo.findAll();
    }

    @Override
    public void eliminar(Integer id) {
        log.warn("Eliminando usuario ID: {}", id);
        repo.deleteById(id);
    }

    @Override
    public boolean existePorCorreo(String correo) {
        return repo.existsByCorreo(correo);
    }
}