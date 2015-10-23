package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Anuncio;
import br.autogeo.model.Usuario;
import br.autogeo.repository.AnuncioRepository;

@Component
@Transactional
public class AnuncioService {

	@Autowired
	private AnuncioRepository repository;
	
	public Anuncio salvar(Anuncio anuncio){
		return repository.save(anuncio);
	}
	
	public Anuncio getById(Long id){
		return repository.findOne(id);
	}
	
	public List<Anuncio> getAllByUser(Usuario usuario){
		return repository.findByUsuarioAndAtivo(usuario, true);
	}
	
	public List<Anuncio> getAll(){
		return repository.findAll();
	}
	
	public List<Anuncio> getAllActive(){
		return repository.findByAtivo(true);
	}
}
