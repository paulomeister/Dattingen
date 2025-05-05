package com.dirac.securityservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SecurityserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecurityserviceApplication.class, args);
    }

}
