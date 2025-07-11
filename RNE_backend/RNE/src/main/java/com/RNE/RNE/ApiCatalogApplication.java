package com.RNE.RNE;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ApiCatalogApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiCatalogApplication.class, args);
    }
}