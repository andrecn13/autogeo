package br.autogeo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Anuncio;
import br.autogeo.repository.AnuncioRepository;

@Component
@Transactional
public class AnuncioService {

	@Autowired
	private AnuncioRepository repository;
	
	public Anuncio salvar(Anuncio anuncio){
		return repository.saveAndFlush(anuncio);
	}
}
