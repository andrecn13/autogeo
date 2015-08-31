package br.autogeo.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.autogeo.model.Usuario;
import br.autogeo.service.UsuarioService;

@RestController
@RequestMapping(value = "/usuario")
public class UsuarioController {
	
	@Autowired
	private UsuarioService service;
	
	@RequestMapping(value = "/salvar", method = RequestMethod.POST)
	public ResponseEntity<Usuario> salvar(@RequestBody Usuario user){
		if(user != null){
			user.setAtivo(true);
			user.setDataCriacao(new Date());
		}
		
		return new ResponseEntity<Usuario>(service.salvarUsuario(user), HttpStatus.CREATED); 
	}
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public List<Usuario> lista(){
		return service.lista();
	}

}
