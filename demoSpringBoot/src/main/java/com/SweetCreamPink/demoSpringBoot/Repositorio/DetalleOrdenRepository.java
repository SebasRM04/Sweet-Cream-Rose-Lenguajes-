package com.SweetCreamPink.demoSpringBoot.Repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SweetCreamPink.demoSpringBoot.Modelo.DetalleOrden;

@Repository
public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Integer> {
}