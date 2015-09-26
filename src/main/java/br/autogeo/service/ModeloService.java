package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Modelo;
import br.autogeo.repository.ModeloRepository;


@Component
@Transactional
public class ModeloService {

	@Autowired
	private ModeloRepository repository;
	
	public Modelo salvarModelo(Modelo modelo){
		return repository.saveAndFlush(modelo);
	}
	
	public List<Modelo> getAll(){
		return repository.findAll();
	}
}
