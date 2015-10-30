package br.autogeo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Anuncio;
import br.autogeo.model.Foto;
import br.autogeo.repository.FotoRepository;

@Component
@Transactional
public class FotoService {

	@Autowired
	private FotoRepository repository;
	
	public Foto getById(Long id){
		return repository.findOne(id);
	}
	
	public Foto getByAnuncioAndNome(Anuncio anuncio, String nome){
		return repository.findByAnuncioAndNome(anuncio, nome);
	}
}
