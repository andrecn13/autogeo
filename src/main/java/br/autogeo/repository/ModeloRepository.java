package br.autogeo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.autogeo.model.Modelo;

public interface ModeloRepository extends JpaRepository<Modelo, Long>{

}
