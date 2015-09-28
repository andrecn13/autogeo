package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Motivo;
import br.autogeo.repository.MotivoRepository;

@Component
@Transactional
public class MotivoService {

	@Autowired
	private MotivoRepository repository;
	
	public List<Motivo> saveAll(List<Motivo> motivos){
		return repository.save(motivos);
	}
	
	public List<Motivo> getAll(){
		return repository.findAll();
	}
}
