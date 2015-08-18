package br.autogeo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.autogeo.model.Contato;
import br.autogeo.service.ContatoService;

@RestController
public class ContatoController {
	
	@Autowired
	private ContatoService service;
	
	@RequestMapping(value = "/contato", method = RequestMethod.GET)
	public List<Contato> getAll(){
		return service.getAll();
	}
}
