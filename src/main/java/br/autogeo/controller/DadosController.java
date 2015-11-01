package br.autogeo.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import javax.servlet.ServletResponse;

import org.apache.commons.io.IOUtils;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import br.autogeo.model.Acessorio;
import br.autogeo.model.Anuncio;
import br.autogeo.model.Combustivel;
import br.autogeo.model.Cor;
import br.autogeo.model.Foto;
import br.autogeo.model.Motivo;
import br.autogeo.service.AcessorioService;
import br.autogeo.service.AnuncioService;
import br.autogeo.service.CombustivelService;
import br.autogeo.service.CorService;
import br.autogeo.service.FotoService;
import br.autogeo.service.MotivoService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping(value = "/dados")
@PropertySource("classpath:config.properties")
public class DadosController {

	@Value("${upload_path}")
	private String path;
	
	@Autowired
	private CorService serviceCor;
	@Autowired
	private CombustivelService serviceCombustivel;
	@Autowired
	private AcessorioService serviceAcessorio;
	@Autowired
	private MotivoService ServiceMotivo;
	@Autowired
	private AnuncioService serviceAnuncio;
	@Autowired
	private FotoService serviceFoto;

	@RequestMapping(value = "/import", method = RequestMethod.GET)
	public ResponseEntity<String> getDados(){
		
		List<Combustivel> combustiveis = new ArrayList<Combustivel>();
		List<Cor> cores = new ArrayList<Cor>();
		List<Motivo> motivos = new ArrayList<Motivo>();
		List<Acessorio> acessorios = new ArrayList<Acessorio>();
		
		/**
		 * Combustiveis
		 */
		Combustivel com1 = new Combustivel();
		com1.setCombustivel("Gasolina");
		com1.setCodigo(1L);
		Combustivel com2 = new Combustivel();
		com2.setCombustivel("Etanol");
		com2.setCodigo(2L);
		Combustivel com3 = new Combustivel();
		com3.setCombustivel("Diesel");
		com3.setCodigo(3L);
		Combustivel com4 = new Combustivel();
		com4.setCombustivel("GNV");
		com4.setCodigo(1L);
		Combustivel com5 = new Combustivel();
		com5.setCombustivel("Flex");
		com5.setCodigo(1L);
		combustiveis.add(com1);
		combustiveis.add(com2);
		combustiveis.add(com3);
		combustiveis.add(com4);
		combustiveis.add(com5);
		
		/**
		 * Cores
		 */
		Cor c1 = new Cor();
		c1.setCor("Branco");
		Cor c2 = new Cor();
		c2.setCor("Preto");
		Cor c3 = new Cor();
		c3.setCor("Prata");
		Cor c4 = new Cor();
		c4.setCor("Vermelho");
		Cor c5 = new Cor();
		c5.setCor("Azul");
		Cor c6 = new Cor();
		c6.setCor("Cinza");
		Cor c7 = new Cor();
		c7.setCor("Verde");
		Cor c8 = new Cor();
		c8.setCor("Dourado");
		cores.add(c1);
		cores.add(c2);
		cores.add(c3);
		cores.add(c4);
		cores.add(c5);
		cores.add(c6);
		cores.add(c7);
		cores.add(c8);
		
		/**
		 * Acessorios
		 */
		Acessorio a1 = new Acessorio();
		a1.setAcessorio("Vidros Elétricos");
		Acessorio a2 = new Acessorio();
		a2.setAcessorio("Bancos de Couro");
		Acessorio a3 = new Acessorio();
		a3.setAcessorio("Multimídia");
		Acessorio a4 = new Acessorio();
		a4.setAcessorio("Air Bags");
		Acessorio a5 = new Acessorio();
		a5.setAcessorio("Direção Hidráulica");
		Acessorio a6 = new Acessorio();
		a6.setAcessorio("Espelhos Elétricos");
		Acessorio a7 = new Acessorio();
		a7.setAcessorio("Ar Condicionado");
		Acessorio a8 = new Acessorio();
		a8.setAcessorio("Freios ABS");
		Acessorio a9 = new Acessorio();
		a9.setAcessorio("Piloto Automático");
		Acessorio a10 = new Acessorio();
		a10.setAcessorio("Travas Elétricas");
		Acessorio a11 = new Acessorio();
		a11.setAcessorio("Outros");
		acessorios.add(a1);
		acessorios.add(a2);
		acessorios.add(a3);
		acessorios.add(a4);
		acessorios.add(a5);
		acessorios.add(a6);
		acessorios.add(a7);
		acessorios.add(a8);
		acessorios.add(a9);
		acessorios.add(a10);
		acessorios.add(a11);
		
		/**
		 * Motivos
		 */
		Motivo m1 = new Motivo();
		m1.setMotivo("Já vendi meu automóvel");
		Motivo m2 = new Motivo();
		m2.setMotivo("Não desejo mais vender meu automóvel");
		Motivo m3 = new Motivo();
		m3.setMotivo("Não gostei do site");
		Motivo m4 = new Motivo();
		m4.setMotivo("Outros");
		motivos.add(m1);
		motivos.add(m2);
		motivos.add(m3);
		motivos.add(m4);
		
		serviceCombustivel.saveAll(combustiveis);
		serviceCor.saveAll(cores);
		serviceAcessorio.saveAll(acessorios);
		ServiceMotivo.saveAll(motivos);
		
		return new ResponseEntity<String>("Dados Importados",HttpStatus.OK);
	}
	
	@RequestMapping(value = "/anuncios", method = RequestMethod.GET)
	public ResponseEntity<String> getAnuncios(){
		FeatureCollection featureCollection = new FeatureCollection();
		String json;
		
		for(Anuncio anuncio : serviceAnuncio.getAllActive()){
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

	@RequestMapping(value = "/foto/{id}/{nome:.+}", method = RequestMethod.GET)
	public @ResponseBody void getImage(@PathVariable Long id, @PathVariable String nome, ServletResponse response) throws IOException {
		
		Anuncio anuncio = serviceAnuncio.getById(id);
		Foto foto = serviceFoto.getByAnuncioAndNome(anuncio, nome);
		
		File imageFile = new File(path + File.separator + anuncio.getUsuario().getId()+ File.separator + foto.getNome());
		byte[] byteArray = null;
		
		try {
			byteArray = IOUtils.toByteArray(new FileInputStream(imageFile));
		} catch (IOException e) {
			e.printStackTrace();
		}

		response.setContentType(foto.getContentType());
		response.getOutputStream().write(byteArray);
	}
	
	@RequestMapping(value = "/fipe/preco/{idMarca}/{idModelo}/{ano}/{idCombustivel}", method = RequestMethod.GET)
	public ResponseEntity<String> getPrecoFipe(@PathVariable Long idMarca, @PathVariable Long idModelo, @PathVariable Long ano, @PathVariable Long idCombustivel){
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<Object> res = restTemplate.exchange("http://fipeapi.appspot.com/api/1/carros/veiculo/{idMarca}/{idModelo}/{ano}-{idCombustivel}.json", HttpMethod.GET, null, Object.class, idMarca, idModelo, ano, idCombustivel);
		String json;
		
		try {
			json = new ObjectMapper().writeValueAsString(res.getBody());
		} catch (JsonProcessingException e) {
			return new ResponseEntity<String>("", HttpStatus.BAD_REQUEST);
		}
		
		return new ResponseEntity<String>(json, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/fipe/preco/anuncio/{id}", method = RequestMethod.GET)
	public ResponseEntity<String> getPrecoFipeAnuncio(@PathVariable Long id){
		Anuncio anuncio = serviceAnuncio.getById(id);
		
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<Object> res = restTemplate.exchange("http://fipeapi.appspot.com/api/1/carros/veiculo/{idMarca}/{idModelo}/{ano}-{idCombustivel}.json", HttpMethod.GET, null, Object.class, anuncio.getModelo().getMarca().getFipe_id(), anuncio.getModelo().getFipe_id(), anuncio.getAno(), anuncio.getCombustivel().getCodigo());
		String json;
		
		try {
			json = new ObjectMapper().writeValueAsString(res.getBody());
		} catch (JsonProcessingException e) {
			return new ResponseEntity<String>("", HttpStatus.BAD_REQUEST);
		}
		
		return new ResponseEntity<String>(json, HttpStatus.OK);
	}

}
