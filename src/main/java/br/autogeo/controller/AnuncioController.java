package br.autogeo.controller;

import java.util.ArrayList;
import java.util.List;

import io.jsonwebtoken.Claims;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.autogeo.model.Anuncio;
import br.autogeo.model.Usuario;
import br.autogeo.service.AcessorioService;
import br.autogeo.service.AnuncioService;
import br.autogeo.service.CombustivelService;
import br.autogeo.service.CorService;
import br.autogeo.service.MarcaService;
import br.autogeo.service.UsuarioService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping(value = "/api/anuncio")
public class AnuncioController {
	
	@Autowired
	private AnuncioService service;
	
	@Autowired
	private MarcaService serviceMarca;
	
	@Autowired
	private AcessorioService serviceAcessorio;
	
	@Autowired
	private CorService serviceCor;
	
	@Autowired
	private CombustivelService serviceCombustivel;
	
	@Autowired
	private UsuarioService serviceUsuario;
	
	@RequestMapping(value = "/salvar", method = RequestMethod.POST)
	public ResponseEntity<Anuncio> salvar(@RequestBody Anuncio anuncio, HttpServletRequest request){
		
		if(anuncio == null || anuncio.getLocalizacao() == null){
			return new ResponseEntity<Anuncio>(anuncio, HttpStatus.BAD_REQUEST);
		}
		
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		anuncio.setUsuario(serviceUsuario.getByEmail(email));
		
		return new ResponseEntity<Anuncio>(service.salvar(anuncio), HttpStatus.OK);
	}
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public ResponseEntity<String> getDados(){
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode node = mapper.createObjectNode();
		String json;
		
		node.putPOJO("marcas", serviceMarca.lista());
		node.putPOJO("cores", serviceCor.getAll());
		node.putPOJO("combustiveis", serviceCombustivel.getAll());
		node.putPOJO("acessorios", serviceAcessorio.getAll());
		
		try {
			json = mapper.writeValueAsString(node);
		} catch (JsonProcessingException e) {
			json = "";
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(json, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Anuncio> getAnuncio(@PathVariable Long id){
		
		return new ResponseEntity<Anuncio>(service.getById(id), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/all", method = RequestMethod.GET)
	public ResponseEntity<List<Anuncio>> getAnuncios(HttpServletRequest request){
		
		List<Anuncio> anuncios = new ArrayList<Anuncio>();
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		Usuario usuario = serviceUsuario.getByEmail(email);
		anuncios = service.getAllByUser(usuario);
		
		return new ResponseEntity<List<Anuncio>>(anuncios, HttpStatus.OK);
	}

}
