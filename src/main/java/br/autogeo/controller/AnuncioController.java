package br.autogeo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.autogeo.model.Anuncio;
import br.autogeo.service.AnuncioService;
import br.autogeo.service.MarcaService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

@RestController
@RequestMapping(value = "/anuncio")
public class AnuncioController {
	
	@Autowired
	private AnuncioService service;
	
	@Autowired
	private MarcaService serviceMarca;
	
	@RequestMapping(value = "/salvar", method = RequestMethod.POST)
	public ResponseEntity<Anuncio> salvar(){
		WKTReader fromText = new WKTReader();
		Point geom = null;
		try {
			geom = (Point) fromText.read("POINT(-56.2564083434446 -34.8982159791812)");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		Anuncio anuncio = new Anuncio();
		anuncio.setPlaca("IPT-8986");
		anuncio.setLocalizacao(geom);
		
		return new ResponseEntity<Anuncio>(service.salvar(anuncio), HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public ResponseEntity<String> getDados(){
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode node = mapper.createObjectNode();
		String json;
		
		node.putPOJO("modelos", serviceMarca.lista());
		
		try {
			json = mapper.writeValueAsString(node);
		} catch (JsonProcessingException e) {
			json = "";
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(json, HttpStatus.OK);
	}

}
