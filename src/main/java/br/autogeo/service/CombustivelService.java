package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Combustivel;
import br.autogeo.repository.CombustivelRepository;

@Component
@Transactional
public class CombustivelService {

	@Autowired
	private CombustivelRepository repository;
	
	public List<Combustivel> saveAll(List<Combustivel> combustiveis){
		return repository.save(combustiveis);
	}
	
	public List<Combustivel> getAll(){
		return repository.findAll();
	}
}
