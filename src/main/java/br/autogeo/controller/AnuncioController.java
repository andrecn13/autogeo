package br.autogeo.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import io.jsonwebtoken.Claims;

import javax.servlet.http.HttpServletRequest;

import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.autogeo.model.Anuncio;
import br.autogeo.model.Motivo;
import br.autogeo.model.Usuario;
import br.autogeo.service.AcessorioService;
import br.autogeo.service.AnuncioService;
import br.autogeo.service.CombustivelService;
import br.autogeo.service.CorService;
import br.autogeo.service.MarcaService;
import br.autogeo.service.MotivoService;
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
	
	@Autowired
	private MotivoService serviceMotivo;
	
	@RequestMapping(value = "/salvar", method = RequestMethod.POST)
	public ResponseEntity<Anuncio> salvar(@RequestBody Anuncio anuncio, HttpServletRequest request){
		
		if(anuncio == null || anuncio.getLocalizacao() == null){
			return new ResponseEntity<Anuncio>(anuncio, HttpStatus.BAD_REQUEST);
		}
		
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		anuncio.setUsuario(serviceUsuario.getByEmail(email));
		anuncio.setDataCriacao(new Date());
		anuncio.setAtivo(true);
		
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
		node.putPOJO("motivos", serviceMotivo.getAll());
		
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
	
	@RequestMapping(value = "/favoritos", method = RequestMethod.GET)
	public ResponseEntity<List<Anuncio>> getFavoritos(HttpServletRequest request){
		
		List<Anuncio> anuncios = new ArrayList<Anuncio>();
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		Usuario usuario = serviceUsuario.getByEmail(email);
		anuncios = usuario.getFavoritos();
		
		return new ResponseEntity<List<Anuncio>>(anuncios, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/lista", method = RequestMethod.GET)
	public ResponseEntity<String> lista(HttpServletRequest request){
		
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		Usuario usuario = serviceUsuario.getByEmail(email);

		FeatureCollection featureCollection = new FeatureCollection();
		String json;
		
		for(Anuncio anuncio : service.getAll()){
			Feature f = new Feature();
			ObjectNode contato = new ObjectMapper().createObjectNode();
			
			contato.put("nome", anuncio.getUsuario().getNome()+" "+anuncio.getUsuario().getSobreNome());
			contato.put("email", anuncio.getUsuario().getEmail());
			contato.put("telefone", anuncio.getUsuario().getTelefone());
			
			f.setProperty("id", anuncio.getId());
			f.setProperty("ano", anuncio.getAno());
			f.setProperty("combustivel", anuncio.getCombustivel().getCombustivel());
			f.setProperty("cor", anuncio.getCor().getCor());
			f.setProperty("km", anuncio.getKm());
			f.setProperty("modelo", anuncio.getModelo().getNome());
			f.setProperty("marca", anuncio.getModelo().getMarca().getMarca());
			f.setProperty("observacao", anuncio.getObservacao());
			f.setProperty("placa", anuncio.getPlaca());
			f.setProperty("valor", anuncio.getValor());
			f.setProperty("estado", (anuncio.getAno() >= new GregorianCalendar().get(Calendar.YEAR)) ? 1 : 2);
			f.setProperty("contato", contato);
			f.setProperty("acessorios", anuncio.getAcessorios());
			f.setProperty("fotos", null);
			f.setProperty("favorito", false);
			f.setGeometry(new Point(anuncio.getLocalizacao().getY(), anuncio.getLocalizacao().getX()));
			
			if(anuncio.getUsuariosFavoritados().size() > 0){
				for(Usuario u : anuncio.getUsuariosFavoritados()){
					if(u.equals(usuario)){
						f.setProperty("favorito", true);
					}
				}
			}
			
			featureCollection.add(f);
		}
		
		try {
			json = new ObjectMapper().writeValueAsString(featureCollection);
		} catch (JsonProcessingException e) {
			json = "";
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(json, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/deletar/{id}", method = RequestMethod.POST)
	public ResponseEntity<String> deleteAnuncio(@PathVariable Long id, @RequestBody Motivo motivo){
		
		Anuncio anuncio = service.getById(id);
		if(anuncio != null){
			anuncio.setAtivo(false);
			anuncio.setMotivoExclusao(motivo);
			anuncio.setDataExclusao(new Date());
			
			service.salvar(anuncio);

			return new ResponseEntity<String>(HttpStatus.OK);
		}
		
		return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);		
	}
	
	@RequestMapping(value = "/favorito/{acao}/{id}", method = RequestMethod.GET)
	public ResponseEntity<String> favorito(@PathVariable String acao, @PathVariable Long id, HttpServletRequest request){
		
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		Usuario usuario = serviceUsuario.getByEmail(email);
		Anuncio anuncio = service.getById(id);
		
		if(anuncio != null){
			
			if(acao.equalsIgnoreCase("add")){
				anuncio.getUsuariosFavoritados().add(usuario);
			}else if(acao.equalsIgnoreCase("remove")){
				anuncio.getUsuariosFavoritados().remove(usuario);
			}
			
			
			service.salvar(anuncio);
			
			return new ResponseEntity<String>(HttpStatus.OK);
		}
		
		return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);		
	}
	
	

}
