package br.autogeo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.autogeo.model.Usuario;
import br.autogeo.repository.UsuarioRepository;

@Component
@Transactional
public class UsuarioService {
	
	@Autowired
	private UsuarioRepository repository;
	
	public Usuario salvarUsuario(Usuario user){
		return repository.saveAndFlush(user);
	}
	
	public List<Usuario> lista(){
		return repository.findAll();
	}
	
	public Usuario login(Usuario user){
		return repository.findByEmail(user.getEmail());
	}

}
