package com.RNE.RNE.model;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List; 

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String username;
    private String password;
    private String role = "ROLE_USER";

    // Business Info
    private String matriculeFiscale;
    private String secteurActivite;
    private String raisonSociale;
    private String adresse;

    // Premier PremierResponsable
    private String nomPremierResponsable;
    private String prenomPremierResponsable;
    private String emailPremierResponsable;
    private String telPremierResponsable;

    // PremierResponsable ResponsableTechnique
    private String nomResponsableTechnique;
    private String prenomResponsableTechnique;
    private String emailResponsableTechnique;
    private String telResponsableTechnique;

    private String ip;
    private String tel;
    private String email;
    private String wso2AppName;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Wallet wallet;
 
    public Wallet getWallet() {
        return wallet;
    }   
    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMatriculeFiscale() {
        return matriculeFiscale;
    }

    public void setMatriculeFiscale(String matriculeFiscale) {
        this.matriculeFiscale = matriculeFiscale;
    }

    public String getSecteurActivite() {
        return secteurActivite;
    }

    public void setSecteurActivite(String secteurActivite) {
        this.secteurActivite = secteurActivite;
    }

    public String getRaisonSociale() {
        return raisonSociale;
    }

    public void setRaisonSociale(String raisonSociale) {
        this.raisonSociale = raisonSociale;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getNomPremierResponsable() {
        return nomPremierResponsable;
    }

    public void setNomPremierResponsable(String nomPremierResponsable) {
        this.nomPremierResponsable = nomPremierResponsable;
    }

    public String getPrenomPremierResponsable() {
        return prenomPremierResponsable;
    }

    public void setPrenomPremierResponsable(String prenomPremierResponsable) {
        this.prenomPremierResponsable = prenomPremierResponsable;
    }

    public String getEmailPremierResponsable() {
        return emailPremierResponsable;
    }

    public void setEmailPremierResponsable(String emailPremierResponsable) {
        this.emailPremierResponsable = emailPremierResponsable;
    }

    public String getTelPremierResponsable() {
        return telPremierResponsable;
    }

    public void setTelPremierResponsable(String telPremierResponsable) {
        this.telPremierResponsable = telPremierResponsable;
    }

    public String getNomResponsableTechnique() {
        return nomResponsableTechnique;
    }

    public void setNomResponsableTechnique(String nomResponsableTechnique) {
        this.nomResponsableTechnique = nomResponsableTechnique;
    }

    public String getPrenomResponsableTechnique() {
        return prenomResponsableTechnique;
    }

    public void setPrenomResponsableTechnique(String prenomResponsableTechnique) {
        this.prenomResponsableTechnique = prenomResponsableTechnique;
    }

    public String getEmailResponsableTechnique() {
        return emailResponsableTechnique;
    }

    public void setEmailResponsableTechnique(String emailResponsableTechnique) {
        this.emailResponsableTechnique = emailResponsableTechnique;
    }

    public String getTelResponsableTechnique() {
        return telResponsableTechnique;
    }

    public void setTelResponsableTechnique(String telResponsableTechnique) {
        this.telResponsableTechnique = telResponsableTechnique;
    }

    public String getIpAutorisee() {
        return ip;
    }

    public void setIpAutorisee(String ipAutorisee) {
        this.ip = ipAutorisee;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getWso2AppName() {
        return wso2AppName;
    }   
    public void setWso2ApppName(String wso2AppName) {
        this.wso2AppName = wso2AppName;
    }
}