package com.SweetCreamPink.demoSpringBoot.DAO;

import java.util.List;
import java.util.Optional;

import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;

/** DAO para historial de pedidos. */
public interface OrdenDAO {
    Orden guardar(Orden orden);
    Optional<Orden> buscarPorId(Integer id);
    List<Orden> historialPorUsuario(Integer usuarioId);
    List<Orden> listarTodas();
}