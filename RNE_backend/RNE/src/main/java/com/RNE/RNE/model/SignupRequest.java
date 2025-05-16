package com.RNE.RNE.model;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "signup_requests")
public class SignupRequest {
    @Id
    @GeneratedValue
    private Long id;

    private String matriculeFiscale;
    private String secteurActivite;
    private String raisonSociale;
    private String adresse;

    // Premier PremierResponsable
    private String nomPremierResponsable;
    private String prenomPremierResponsable;
    private String emailPremierResponsable;
    private String telPremierResponsable;

    //PremierResponsable Technique
    private String nomResponsableTechnique;
    private String prenomResponsableTechnique;
    private String emailResponsableTechnique;
    private String telResponsableTechnique;

    private String ip;
    private String tel;
    private String email;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt = LocalDateTime.now();

    public enum Status {
        NEW,
        REJECTED,
        ACCEPTED
    }

    @Enumerated(EnumType.STRING)
    private Status status = Status.NEW;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setNomResponsableTechnique(String nomTechnique) {
        this.nomResponsableTechnique = nomTechnique;
    }

    public String getPrenomResponsableTechnique() {
        return prenomResponsableTechnique;
    }

    public void setPrenomResponsableTechnique(String prenomTechnique) {
        this.prenomResponsableTechnique = prenomTechnique;
    }

    public String getEmailResponsableTechnique() {
        return emailResponsableTechnique;
    }

    public void setEmailResponsableTechnique(String emailTechnique) {
        this.emailResponsableTechnique = emailTechnique;
    }

    public String getTelResponsableTechnique() {
        return telResponsableTechnique;
    }

    public void setTelResponsableTechnique(String telTechnique) {
        this.telResponsableTechnique = telTechnique;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
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

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}