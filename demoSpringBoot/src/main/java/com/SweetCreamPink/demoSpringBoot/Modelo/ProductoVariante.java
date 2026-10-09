package com.SweetCreamPink.demoSpringBoot.Modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "producto_variantes")
public class ProductoVariante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "varId")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "proId_fk")
    private Producto producto;

    @Column(name = "varNombre")
    private String nombre;

    @Column(name = "varPrecioAdicional")
    private Double precioAdicional;

    public ProductoVariante() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getPrecioAdicional() { return precioAdicional; }
    public void setPrecioAdicional(Double precioAdicional) { this.precioAdicional = precioAdicional; }
}