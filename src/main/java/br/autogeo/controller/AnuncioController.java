package br.autogeo.controller;

import java.io.File;
import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.autogeo.model.Anuncio;
import br.autogeo.model.Foto;
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
	public ResponseEntity<Anuncio> salvar(@RequestParam("file") MultipartFile[] files, @RequestParam("anuncio") String anuncioRequest, HttpServletRequest request){
		
		Anuncio anuncio = null;
		List<Foto> fotos = new ArrayList<Foto>();
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			anuncio = mapper.readValue(anuncioRequest, Anuncio.class);
		} catch (IOException e) {
			return new ResponseEntity<Anuncio>(anuncio, HttpStatus.BAD_REQUEST);
		}
		
		if(anuncio == null){
			return new ResponseEntity<Anuncio>(anuncio, HttpStatus.BAD_REQUEST);
		}
		
		
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		anuncio.setUsuario(serviceUsuario.getByEmail(email));
		anuncio.setDataCriacao(new Date());
		anuncio.setAtivo(true);
		
		File file = new File("D:\\AUTOGEO_FOTOS" + File.separator + anuncio.getUsuario().getId());
		if(!file.exists()){
			file.mkdir();
		}
		
		for (int i=0; i<files.length;i++) {
			Foto foto = new Foto();
			foto.setContentType(files[i].getContentType());
			foto.setNome(new Date().getTime()+"."+files[i].getOriginalFilename().substring(files[i].getOriginalFilename().lastIndexOf('.') + 1));
			
			try {
				files[i].transferTo(new File(file.getAbsolutePath()+File.separator+foto.getNome()));
				fotos.add(foto);
			} catch (IllegalStateException | IOException e) {
				e.printStackTrace();
			}
		}
		anuncio.setFotos(fotos);
		
		return new ResponseEntity<Anuncio>(service.salvar(anuncio),HttpStatus.OK);
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
		
		for(Anuncio a : usuario.getFavoritos()){
			if(a.getAtivo() == true){
				anuncios.add(a); 
			}
		}
		
		
		return new ResponseEntity<List<Anuncio>>(anuncios, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/lista", method = RequestMethod.GET)
	public ResponseEntity<String> lista(HttpServletRequest request){
		
		String email = ((Claims)request.getAttribute("claims")).get("email").toString();
		Usuario usuario = serviceUsuario.getByEmail(email);

		FeatureCollection featureCollection = new FeatureCollection();
		String json;
		
		for(Anuncio anuncio : service.getAllActive()){
			Feature f = new Feature();
			ObjectNode contato = new ObjectMapper().createObjectNode();
			ObjectNode loja = new ObjectMapper().createObjectNode();
			
			//propriedades da loja
			if(anuncio.getUsuario().getLoja() != null){
				loja.put("cnpj", anuncio.getUsuario().getLoja().getCnpj());
				loja.put("razao_social", anuncio.getUsuario().getLoja().getRazaoSocial());
				loja.put("nome_fantasia", anuncio.getUsuario().getLoja().getNomeFantasia());
				loja.put("telefone", anuncio.getUsuario().getLoja().getTelefone());
				loja.put("email", anuncio.getUsuario().getLoja().getEmail());
				
				f.setProperty("loja", loja);
			}
			
			//propriedades do contato
			contato.put("id", anuncio.getUsuario().getId());
			contato.put("nome", anuncio.getUsuario().getNome()+" "+anuncio.getUsuario().getSobreNome());
			contato.put("email", anuncio.getUsuario().getEmail());
			contato.put("telefone", anuncio.getUsuario().getTelefone());
			
			//todas propriedades do anuncio
			f.setProperty("contato", contato);
			f.setProperty("id", anuncio.getId());
			f.setProperty("ano", (anuncio.getAno() != null) ? anuncio.getAno() : null);
			f.setProperty("combustivel", (anuncio.getCombustivel() != null) ? anuncio.getCombustivel().getCombustivel() : null);
			f.setProperty("cor", (anuncio.getCor() != null) ? anuncio.getCor().getCor() : null);
			f.setProperty("km", (anuncio.getKm() != null) ? anuncio.getKm() : null);
			f.setProperty("modelo", (anuncio.getModelo() != null) ? anuncio.getModelo().getNome() : null);
			f.setProperty("marca", (anuncio.getModelo() != null) ? anuncio.getModelo().getMarca().getMarca() : null);
			f.setProperty("observacao", (anuncio.getObservacao() != null) ? anuncio.getObservacao() : null);
			f.setProperty("placa", (anuncio.getPlaca() != null) ? anuncio.getPlaca() : null);
			f.setProperty("valor", (anuncio.getValor() != null) ? anuncio.getValor() : null);
			f.setProperty("estado", (anuncio.getAno() >= new GregorianCalendar().get(Calendar.YEAR)) ? 1 : 2);
			f.setProperty("acessorios", anuncio.getAcessorios());
			f.setProperty("fotos", anuncio.getFotos());
			f.setProperty("isloja", (anuncio.getUsuario().getLoja() != null) ? true : false);
			f.setGeometry((anuncio.getUsuario().getLoja() != null) ? new Point(anuncio.getUsuario().getLoja().getLocalizacao().getY(), anuncio.getUsuario().getLoja().getLocalizacao().getX()) : new Point(anuncio.getLocalizacao().getY(), anuncio.getLocalizacao().getX()));
			f.setProperty("favorito", false);
			
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
