package com.SweetCreamPink.demoSpringBoot.Modelo;

import jakarta.persistence.*;

//* el subtotal se recalcula automáticamente en setCantidad() y setProducto().
//* CarritoController usa una List estática en memoria.
//* esta entidad existe para cuando se implemente persistencia real del carrito.

@Entity
@Table(name = "carrito_item")
public class CarritoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usu_id_fk")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "pro_id_fk")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "var_id_fk")
    private ProductoVariante variante;

    private Integer cantidad;
    private Double subtotal;

    //* NUEVO: campos solo para mostrar en el frontend (no se guardan en la BD).
    //* Permiten que el carrito muestre "precio tachado" + precio con descuento
    //* cuando el producto tenía una oferta vigente al agregarlo.
    @Transient
    private Double precioOriginal;
    @Transient
    private Double descuentoAplicado;

    public CarritoItem() {}

    //* Constructor usado por CarritoController al agregar ítems en memoria
    public CarritoItem(Producto producto, Integer cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
        calcularSubtotal();
    }

    //* se llama automáticamente en setCantidad() y setProducto()
    public void calcularSubtotal() {
        if (this.producto != null && this.cantidad != null) {
            this.subtotal = this.producto.getPrecio() * this.cantidad;
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Producto getProducto() { return producto; }
    //* cuando se cambia el producto, el subtotal se actualiza solo
    public void setProducto(Producto producto) {
        this.producto = producto;
        calcularSubtotal();
    }

    public ProductoVariante getVariante() { return variante; }
    public void setVariante(ProductoVariante variante) { this.variante = variante; }

    public Integer getCantidad() { return cantidad; }
    //* cuando se cambia la cantidad, el subtotal se actualiza solo
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
        calcularSubtotal();
    }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getPrecioOriginal() { return precioOriginal; }
    public void setPrecioOriginal(Double precioOriginal) { this.precioOriginal = precioOriginal; }

    public Double getDescuentoAplicado() { return descuentoAplicado; }
    public void setDescuentoAplicado(Double descuentoAplicado) { this.descuentoAplicado = descuentoAplicado; }
}