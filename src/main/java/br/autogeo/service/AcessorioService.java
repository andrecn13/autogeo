package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Acessorio;
import br.autogeo.repository.AcessorioRepository;

@Component
@Transactional
public class AcessorioService {

	@Autowired
	private AcessorioRepository repository;
	
	public List<Acessorio> saveAll(List<Acessorio> acessorios){
		return repository.save(acessorios);
	}
	
	public List<Acessorio> getAll(){
		return repository.findAll();
	}
}
