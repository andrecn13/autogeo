package br.autogeo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.autogeo.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	
	Usuario findByEmail(String email);

}
