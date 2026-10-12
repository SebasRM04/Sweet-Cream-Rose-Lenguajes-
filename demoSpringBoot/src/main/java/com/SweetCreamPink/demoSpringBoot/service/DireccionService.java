package com.SweetCreamPink.demoSpringBoot.service;

import java.util.List;

import com.SweetCreamPink.demoSpringBoot.Modelo.Direccion;

public interface DireccionService {
    Direccion agregar(Integer usuarioId, String direccion, String distrito,
                      String ciudad, String codigoPostal, String referencia, boolean esPrincipal);
    List<Direccion> listar(Integer usuarioId);
    Direccion actualizar(Long direccionId, Integer usuarioId, String direccion,
                         String distrito, String ciudad, String codigoPostal,
                         String referencia, boolean esPrincipal);
    void eliminar(Long direccionId, Integer usuarioId);
}