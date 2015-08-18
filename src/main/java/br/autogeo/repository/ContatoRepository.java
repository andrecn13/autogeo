package br.autogeo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.autogeo.model.Contato;

public interface ContatoRepository extends JpaRepository<Contato, Long> {

}
