package br.autogeo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.autogeo.model.Marca;
import br.autogeo.service.MarcaService;

@RestController
@RequestMapping(value = "/marca")
public class MarcaController {

	@Autowired
	private MarcaService service;
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public ResponseEntity<List<Marca>> lista(){
		return new ResponseEntity<List<Marca>>(service.lista(), HttpStatus.OK);
	}
	
}
