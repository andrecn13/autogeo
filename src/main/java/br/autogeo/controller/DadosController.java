package br.autogeo.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.autogeo.model.Acessorio;
import br.autogeo.model.Anuncio;
import br.autogeo.model.Combustivel;
import br.autogeo.model.Cor;
import br.autogeo.model.Motivo;
import br.autogeo.service.AcessorioService;
import br.autogeo.service.AnuncioService;
import br.autogeo.service.CombustivelService;
import br.autogeo.service.CorService;
import br.autogeo.service.MotivoService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping(value = "/dados")
public class DadosController {

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
		Combustivel com2 = new Combustivel();
		com2.setCombustivel("Álcool");
		Combustivel com3 = new Combustivel();
		com3.setCombustivel("Diesel");
		combustiveis.add(com1);
		combustiveis.add(com2);
		combustiveis.add(com3);
		
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
		cores.add(c1);
		cores.add(c2);
		cores.add(c3);
		cores.add(c4);
		cores.add(c5);
		cores.add(c6);
		cores.add(c7);
		
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
		
		for(Anuncio anuncio : serviceAnuncio.getAll()){
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
			f.setGeometry(new Point(anuncio.getLocalizacao().getY(), anuncio.getLocalizacao().getX()));
			
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
	
}
