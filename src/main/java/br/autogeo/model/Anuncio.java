package br.autogeo.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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
    private Integer ano;
    private String km;
    private Double valor;
    private String observacao;
    private Boolean ativo;
    private Date dataCriacao;
    private Date dataExpiracao;
    
    private Combustivel combustivel;
    private Cor cor;
    private Modelo modelo;
    private Usuario usuario;
    private List<Acessorio> acessorios;
    
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

	@Column(name = "VL_ANO")
	public Integer getAno() {
		return ano;
	}

	public void setAno(Integer ano) {
		this.ano = ano;
	}

	@Column(name = "NM_KM")
	public String getKm() {
		return km;
	}

	public void setKm(String km) {
		this.km = km;
	}

	@Column(name = "VL_VALOR")
	public Double getValor() {
		return valor;
	}

	public void setValor(Double valor) {
		this.valor = valor;
	}

	@Column(name = "DS_OBSERVACAO")
	public String getObservacao() {
		return observacao;
	}

	public void setObservacao(String observacao) {
		this.observacao = observacao;
	}

	@Column(name = "TF_ATIVO")
	public Boolean getAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}

	@Column(name = "DT_CRIACAO")
	@Temporal(TemporalType.TIMESTAMP)
	public Date getDataCriacao() {
		return dataCriacao;
	}

	public void setDataCriacao(Date dataCriacao) {
		this.dataCriacao = dataCriacao;
	}

	@Column(name = "DT_EXPIRACAO")
	@Temporal(TemporalType.TIMESTAMP)
	public Date getDataExpiracao() {
		return dataExpiracao;
	}

	public void setDataExpiracao(Date dataExpiracao) {
		this.dataExpiracao = dataExpiracao;
	}

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "FK_COMBUSTIVEL")
	public Combustivel getCombustivel() {
		return combustivel;
	}

	public void setCombustivel(Combustivel combustivel) {
		this.combustivel = combustivel;
	}

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "FK_COR")
	public Cor getCor() {
		return cor;
	}

	public void setCor(Cor cor) {
		this.cor = cor;
	}


	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "FK_MODELO")
	public Modelo getModelo() {
		return modelo;
	}

	public void setModelo(Modelo modelo) {
		this.modelo = modelo;
	}

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "FK_USUARIO")
	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	@ManyToMany
	@JoinTable(name="TBL_ACESSORIO_has_TBL_ANUNCIO", 
			joinColumns={
				@JoinColumn(name="FK_ANUNCIO")}, 
					inverseJoinColumns={
						@JoinColumn(name="FK_ACESSORIO")})
	public List<Acessorio> getAcessorios() {
		return acessorios;
	}

	public void setAcessorios(List<Acessorio> acessorios) {
		this.acessorios = acessorios;
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