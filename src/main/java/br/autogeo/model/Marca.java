package br.autogeo.model;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import br.autogeo.util.MarcaDeserializer;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Entity
@Table(name="TBL_MARCA")
//@JsonDeserialize(using	=	MarcaDeserializer.class)
public class Marca implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private Long fipe_id;
	private String marca;
	
	private Categoria categoria;
	
	public Marca() {}

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="ID")
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column(name="NM_MARCA")
	public String getMarca() {
		return marca;
	}

	public void setMarca(String marca) {
		this.marca = marca;
	}
	
	@Column(name="NUM_FIPE_ID")
	public Long getFipe_id() {
		return fipe_id;
	}

	public void setFipe_id(Long fipe_id) {
		this.fipe_id = fipe_id;
	}
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "FK_CATEGORIA")
	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
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
		Marca other = (Marca) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}
	
}