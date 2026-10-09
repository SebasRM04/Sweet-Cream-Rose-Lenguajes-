package com.SweetCreamPink.demoSpringBoot.DTO;

import java.util.List;

import com.SweetCreamPink.demoSpringBoot.Modelo.CarritoItem;

public class CarritoResumenDTO {

    private List<CarritoItem> items;
    private Double subtotal;
    private Double igv;
    private Double costoEnvio;
    private Double total;

    // --- CONSTRUCTOR ---
    public CarritoResumenDTO(List<CarritoItem> items, Double costoEnvio) {
        this.items = items;
        this.costoEnvio = (costoEnvio != null) ? costoEnvio : 0.0;
        
        // Cálculo automático de valores
        this.subtotal = (items != null) ? items.stream().mapToDouble(CarritoItem::getSubtotal).sum() : 0.0;
        this.igv = this.subtotal * 0.18;
        this.total = this.subtotal + this.igv + this.costoEnvio;
    }

    public List<CarritoItem> getItems() { return items; }
        public void setItems(List<CarritoItem> items) { this.items = items; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getIgv() { return igv; }
    public void setIgv(Double igv) { this.igv = igv; }

    public Double getCostoEnvio() { return costoEnvio; }
    public void setCostoEnvio(Double costoEnvio) { this.costoEnvio = costoEnvio; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

}