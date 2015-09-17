package br.autogeo.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Type;

import br.autogeo.util.JsonToPointDeserializer;
import br.autogeo.util.PointToJsonSerializer;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Entity
@Table(name="TBL_ANUNCIO")
public class Anuncio {
   
    private Long id;
    private String placa;
    private com.vividsolutions.jts.geom.Point localizacao;
    
    public Anuncio() {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	@Column(name = "NM_PLACA")
    public String getPlaca() {
		return placa;
	}

	public void setPlaca(String placa) {
		this.placa = placa;
	}

	@JsonSerialize(using = PointToJsonSerializer.class)
	@Type(type="org.hibernate.spatial.GeometryType")   
    @Column(name = "PT_LOCALIZACAO")
	public com.vividsolutions.jts.geom.Point getLocalizacao() {
		return localizacao;
	}

	@JsonDeserialize(using	=	JsonToPointDeserializer.class)
	public void setLocalizacao(com.vividsolutions.jts.geom.Point localizacao) {
		this.localizacao = localizacao;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Anuncio other = (Anuncio) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}
    
}