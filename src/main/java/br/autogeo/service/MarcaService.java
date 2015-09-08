package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Marca;
import br.autogeo.repository.MarcaRepository;

@Component
@Transactional
public class MarcaService {
	
	@Autowired
	private MarcaRepository repository;
	
	public List<Marca> lista(){
		return repository.findAll();
	}
	
	public Marca salvar(Marca marca){
		return repository.saveAndFlush(marca);
	}

}
