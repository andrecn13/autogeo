package br.autogeo.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import br.autogeo.model.Categoria;
import br.autogeo.model.Marca;
import br.autogeo.model.Modelo;
import br.autogeo.service.MarcaService;
import br.autogeo.service.ModeloService;

@RestController
@RequestMapping(value = "/modelo")
public class ModeloController {
	
	@Autowired
	private ModeloService service;

	@Autowired
	private MarcaService serviceMarca;
	
	@RequestMapping(value = "/{nomeCategoria}/salvar", method = RequestMethod.GET)
	public ResponseEntity<String> salvar(@PathVariable String nomeCategoria){

		RestTemplate restTemplate = new RestTemplate();
		
		//create categoria -> carros
		Categoria categoria = new Categoria();
		categoria.setCategoria(nomeCategoria);
		
		//get marcas
		ResponseEntity<Marca[]> resultMarcas = restTemplate.exchange("http://fipeapi.appspot.com/api/1/{categoria}/marcas.json", HttpMethod.GET, null, Marca[].class, nomeCategoria);
		List<Marca> marcas = Arrays.asList(resultMarcas.getBody());
		
		for(Marca m : marcas){
			m.setCategoria(categoria);
			//persist marca
			serviceMarca.salvar(m);
			
			//get modelos
			ResponseEntity<Modelo[]> resultModelos = restTemplate.exchange("http://fipeapi.appspot.com/api/1/{categoria}/veiculos/{idMarca}.json", HttpMethod.GET, null, Modelo[].class, nomeCategoria, m.getFipe_id());
			
			List<Modelo> modelos = Arrays.asList(resultModelos.getBody());
			for(Modelo modelo : modelos){
				modelo.setMarca(m);
				service.salvarModelo(modelo);
			}
		}
		
		return new ResponseEntity<String>("Modelos Importados", HttpStatus.OK);
	}
}
