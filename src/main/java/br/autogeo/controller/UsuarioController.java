package br.autogeo.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

import br.autogeo.model.Usuario;
import br.autogeo.service.UsuarioService;

@RestController
@RequestMapping(value = "/usuario")
public class UsuarioController {
	
	@Autowired
	private UsuarioService service;
	private static ShaPasswordEncoder encoder = new ShaPasswordEncoder();
	
	
	/**
	 * Retorna todos usuarios
	 * @return
	 */
	@RequestMapping(value = "", method = RequestMethod.GET)
	public List<Usuario> lista(){
		return service.lista();
	}
	
	/**
	 * Salva um novo usuario no BD
	 * @param user
	 * @return
	 */
	@RequestMapping(value = "/salvar", method = RequestMethod.POST)
	public ResponseEntity<Usuario> salvar(@RequestBody Usuario user){
		
		if (user == null || user.getEmail() == null || user.getSenha() == null) {
			return new ResponseEntity<Usuario>(user, HttpStatus.BAD_REQUEST);
		}
		
		user.setAtivo(true);
		user.setDataCriacao(new Date());
		user.setSenha(encoder.encodePassword(user.getSenha(), null));
		
		if(user.getLoja() != null){
			user.getLoja().setAtivo(true);
			user.getLoja().setDataCriacao(new Date());
			user.getLoja().setUsuario(user);
		}
		return new ResponseEntity<Usuario>(service.salvarUsuario(user), HttpStatus.CREATED); 
		
	}
	
	
	/**
	 * Verifica o login e gerar o token
	 * @param user
	 * @return
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<?> login(@RequestBody Usuario user) {
		if (user == null || user.getEmail() == null || user.getSenha() == null) {
			return new ResponseEntity<Usuario>(user, HttpStatus.BAD_REQUEST);
		}
		
		Usuario usuario = service.login(user.getEmail(), encoder.encodePassword(user.getSenha(), null));
		if (usuario == null) {
			return new ResponseEntity<String>("", HttpStatus.FORBIDDEN);
		}

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("nome", usuario.getNome());
		jsonObject.put("token", Jwts.builder().setSubject(usuario.getEmail())
						.claim("nome", usuario.getNome())
						.claim("email", usuario.getEmail())
						.setIssuedAt(new Date())
						.signWith(SignatureAlgorithm.HS256, "chavesecreta")
						.setHeaderParam("typ", "JWT").compact());

		return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.OK);
	}

}
