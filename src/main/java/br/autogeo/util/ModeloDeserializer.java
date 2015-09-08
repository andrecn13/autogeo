package br.autogeo.util;

import java.io.IOException;

import br.autogeo.model.Modelo;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

public class ModeloDeserializer extends JsonDeserializer<Modelo>{

	@Override
	public Modelo deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		
		JsonNode node = jp.getCodec().readTree(jp);
		String nome = node.get("fipe_name").asText();
        Long id = node.get("id").asLong();
        
        Modelo modelo = new Modelo();
        modelo.setNome(nome);
        modelo.setFipe_id(id);
        
		return modelo;
	}

}
