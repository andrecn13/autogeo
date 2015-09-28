package br.autogeo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.autogeo.model.Marca;
import br.autogeo.model.Modelo;

public interface ModeloRepository extends JpaRepository<Modelo, Long>{
	
	List<Modelo> findByMarca(Marca marca);

}
