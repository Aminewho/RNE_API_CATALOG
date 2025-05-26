package com.RNE.RNE.model;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.Set;
import java.util.HashSet;


@Entity
@Table(name = "api")
public class Api {
    @Id
    private String id; // use WSO2 API UUID (globally unique)

    private String name;
    private String provider;
    private String version;
    private String context;
    private String description;
    private boolean published;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wso2_instance_id")
    private Wso2Instance instance;


}
