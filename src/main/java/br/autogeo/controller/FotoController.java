package br.autogeo.controller;

import io.jsonwebtoken.Claims;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.autogeo.model.Usuario;
import br.autogeo.service.FotoService;
import br.autogeo.service.UsuarioService;

@RestController
@RequestMapping(value = "/api/foto")
public class FotoController {
	
	@Autowired
	private FotoService service;
	
	@Autowired
	private UsuarioService serviceUsuario;
	
	@RequestMapping(value = "/deletar/{id}", method = RequestMethod.GET)
	public ResponseEntity<String> favorito(@PathVariable Long id, HttpServletRequest request){
		
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		Usuario usuario = serviceUsuario.getByEmail(email);
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}
}
