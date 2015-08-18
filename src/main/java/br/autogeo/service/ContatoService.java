package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Contato;
import br.autogeo.repository.ContatoRepository;

@Component
@Transactional
public class ContatoService {
	
	@Autowired
	private ContatoRepository repository;
	
	public List<Contato> getAll(){
		return repository.findAll();
	}
}
