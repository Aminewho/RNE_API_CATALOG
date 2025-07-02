package com.RNE.RNE.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "api")
public class Api {
    @Id
    private String id; // use WSO2 API UUID (globally unique)

    private String name;
    private String endpoint;
    
    @Column(columnDefinition = "TEXT")
    private String input;
    
    
    @Column(columnDefinition = "TEXT")
    private String output;
        private String description;
    private boolean published; // default to false

    private BigDecimal request_cost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "wso2_instance_id")
    private Wso2Instance instance;


   @OneToMany(mappedBy = "api", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subscription> subscriptions = new ArrayList<>();

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }
    public boolean getPublished() {
        return published;
    }
    public Wso2Instance getInstance() {
        return instance;
    }

    public void setInstance(Wso2Instance instance) {
        this.instance = instance;
    }
    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }
    public BigDecimal getRequest_cost() {
        return request_cost;
    }

    public void setRequest_cost(BigDecimal request_cost) {
        this.request_cost = request_cost;
    }   
}