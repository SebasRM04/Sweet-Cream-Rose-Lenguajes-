package com.SweetCreamPink.demoSpringBoot.service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;
import com.SweetCreamPink.demoSpringBoot.Modelo.Orden.MetodoPagoOrden;

public interface OrdenService {

    /** Crea una nueva orden con sus detalles */
    Orden crearOrden(Integer usuarioId, String direccionEntrega,
                     MetodoPagoOrden metodoPago,
                     Orden.TipoEntrega tipoEntrega,
                     List<Map<String, Object>> detalles,
                     Double costoEnvio,
                     Map<String, Object> comprobante);

    /** Historial completo del cliente */
    List<Orden> historial(Integer usuarioId);

    /** Exporta el historial del cliente a Excel (Apache POI) */
    ByteArrayOutputStream exportarHistorialExcel(Integer usuarioId);

    Orden buscarPorId(Integer ordenId);
}
