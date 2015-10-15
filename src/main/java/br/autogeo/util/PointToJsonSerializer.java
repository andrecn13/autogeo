package br.autogeo.util;

import java.io.IOException;

import org.geojson.Feature;
import org.geojson.FeatureCollection;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.vividsolutions.jts.geom.Point;

public class PointToJsonSerializer extends JsonSerializer<Point>{

	@Override
	public void serialize(Point value, JsonGenerator jgen,
			SerializerProvider provider) throws IOException,
			JsonProcessingException {

		FeatureCollection featureCollection = new FeatureCollection();
		Feature f = new Feature();
        try
        {
            if(value != null) {             
                double lat = value.getY();
                double lon = value.getX();
                f.setGeometry(new org.geojson.Point(lat,lon));
                featureCollection.add(f);
            }
        }
        catch(Exception e) {}

        jgen.writeString(new ObjectMapper().writeValueAsString(featureCollection));
		
	}

}
