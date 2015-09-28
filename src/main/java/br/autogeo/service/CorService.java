package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Cor;
import br.autogeo.repository.CorRepository;

@Component
@Transactional
public class CorService {

	@Autowired
	private CorRepository repository;
	
	public List<Cor> saveAll(List<Cor> cores){
		return repository.save(cores);
	}
	
	public List<Cor> getAll(){
		return repository.findAll();
	}
}
