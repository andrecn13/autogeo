package br.autogeo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.autogeo.model.Anuncio;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long>{

}
