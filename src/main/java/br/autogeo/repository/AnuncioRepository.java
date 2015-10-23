package br.autogeo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.autogeo.model.Anuncio;
import br.autogeo.model.Usuario;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long>{

	List<Anuncio> findByUsuarioAndAtivo(Usuario usuario, Boolean ativo);
	List<Anuncio> findByAtivo(Boolean ativo);
}
