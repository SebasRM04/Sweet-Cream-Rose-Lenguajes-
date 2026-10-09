package com.SweetCreamPink.demoSpringBoot.DAO;

import java.util.List;
import java.util.Optional;

import com.SweetCreamPink.demoSpringBoot.Modelo.Direccion;

public interface DireccionDAO {
    Direccion guardar(Direccion direccion);
    Optional<Direccion> buscarPorId(Long id);
    List<Direccion> listarPorUsuario(Integer usuarioId);
    Optional<Direccion> buscarPrincipal(Integer usuarioId);
    void eliminar(Long id);
}