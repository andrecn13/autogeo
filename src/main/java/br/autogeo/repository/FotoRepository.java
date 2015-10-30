package br.autogeo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.autogeo.model.Anuncio;
import br.autogeo.model.Foto;

public interface FotoRepository extends JpaRepository<Foto, Long> {

	Foto findByAnuncioAndNome(Anuncio anuncio, String nome);
}
