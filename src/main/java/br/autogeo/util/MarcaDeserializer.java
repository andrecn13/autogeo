package br.autogeo.util;

import java.io.IOException;

import br.autogeo.model.Marca;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

public class MarcaDeserializer extends JsonDeserializer<Marca>{

	@Override
	public Marca deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		
		JsonNode node = jp.getCodec().readTree(jp);
        String m = node.get("fipe_name").asText();
        Long id = node.get("id").asLong();
        
        Marca marca = new Marca();
        marca.setMarca(m);
        marca.setFipe_id(id);
        
        return marca;
	}

}
