package com.SweetCreamPink.demoSpringBoot.service;

import java.util.List;

import com.SweetCreamPink.demoSpringBoot.Modelo.MetodoPago;
import com.SweetCreamPink.demoSpringBoot.Modelo.MetodoPago.TipoPago;

public interface MetodoPagoService {
    MetodoPago agregar(Integer usuarioId, TipoPago tipo, String alias,
                       String ultimosDigitos, String titular, String banco, boolean esPrincipal);
    List<MetodoPago> listar(Integer usuarioId);
    void eliminar(Long metodoId, Integer usuarioId);
}