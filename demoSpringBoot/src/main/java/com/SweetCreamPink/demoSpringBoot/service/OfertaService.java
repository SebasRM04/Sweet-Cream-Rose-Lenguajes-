package com.SweetCreamPink.demoSpringBoot.service;

import com.SweetCreamPink.demoSpringBoot.Modelo.Oferta;
import com.SweetCreamPink.demoSpringBoot.Repositorio.OfertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class OfertaService {

    @Autowired
    private OfertaRepository ofertaRepository;

    /**
     * Obtiene todas las ofertas vigentes (activas y en rango de fechas)
     */
    public List<Oferta> getVigentes() {
        return ofertaRepository.findVigentes(LocalDate.now());
    }

    /**
     * Calcula el precio con descuento aplicado para un producto específico
     * si tiene una oferta vigente asociada.
     * @param precioOriginal Precio base del producto
     * @param productoId ID del producto (puede ser null para ofertas generales)
     * @return Precio con descuento aplicado, o null si no hay oferta
     */
    public Double calcularPrecioConDescuento(Double precioOriginal, Integer productoId) {
        if (precioOriginal == null || precioOriginal <= 0) return null;

        List<Oferta> vigentes = ofertaRepository.findVigentes(LocalDate.now());

        // Buscar oferta específica para este producto
        Optional<Oferta> ofertaProducto = vigentes.stream()
            .filter(o -> o.getProducto() != null 
                && o.getProducto().getId() != null 
                && o.getProducto().getId().equals(productoId))
            .findFirst();

        // Si no hay oferta específica, buscar oferta general (sin producto asociado)
        if (ofertaProducto.isEmpty()) {
            ofertaProducto = vigentes.stream()
                .filter(o -> o.getProducto() == null)
                .findFirst();
        }

        if (ofertaProducto.isPresent()) {
            BigDecimal descuento = ofertaProducto.get().getOferDescuento();
            if (descuento != null && descuento.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal precio = BigDecimal.valueOf(precioOriginal);
                BigDecimal factor = BigDecimal.ONE.subtract(
                    descuento.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                );
                return precio.multiply(factor).setScale(2, RoundingMode.HALF_UP).doubleValue();
            }
        }
        return null;
    }

    /**
     * Obtiene el descuento aplicable a un producto (porcentaje)
     */
    public BigDecimal getDescuentoParaProducto(Integer productoId) {
        List<Oferta> vigentes = ofertaRepository.findVigentes(LocalDate.now());

        return vigentes.stream()
            .filter(o -> o.getProducto() != null 
                && o.getProducto().getId() != null 
                && o.getProducto().getId().equals(productoId))
            .findFirst()
            .map(Oferta::getOferDescuento)
            .orElse(null);
    }

    /**
     * Calcula los días restantes de una oferta
     */
    public Long getDiasRestantes(Oferta oferta) {
        if (oferta.getOferFechaFin() == null) return null;
        return ChronoUnit.DAYS.between(LocalDate.now(), oferta.getOferFechaFin());
    }

    /**
     * Verifica si un producto tiene oferta activa vigente
     */
    public boolean tieneOfertaActiva(Integer productoId) {
        return getDescuentoParaProducto(productoId) != null;
    }
}