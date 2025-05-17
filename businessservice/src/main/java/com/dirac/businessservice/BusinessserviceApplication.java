package com.dirac.businessservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class BusinessserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusinessserviceApplication.class, args);
    }

}
