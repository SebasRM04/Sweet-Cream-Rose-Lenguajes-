package com.SweetCreamPink.demoSpringBoot.Repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SweetCreamPink.demoSpringBoot.Modelo.Orden;

import java.time.LocalDateTime;
import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Integer> {

    //* usado por AdminVentasController, AdminReportesController y AdminDashboardController
    List<Orden> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    //* usado por AdminPedidosController para filtrar por estado
    List<Orden> findByEstado(Orden.EstadoOrden estado);

    //* usado por OrdenServiceImpl para el historial del cliente
    List<Orden> findByUsuario_IdOrderByFechaDesc(Integer usuarioId);

    //* usado por AdminDashboardController para "Pedidos recientes"
    List<Orden> findTop5ByOrderByFechaDesc();

    List<Orden> findByEstadoAndFechaBefore(Orden.EstadoOrden estado, LocalDateTime fecha);
}