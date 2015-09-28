package br.autogeo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.autogeo.model.Combustivel;

public interface CombustivelRepository extends JpaRepository<Combustivel, Long>{

}
