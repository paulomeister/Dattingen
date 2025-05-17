package com.dirac.auditprocessservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AuditprocessserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuditprocessserviceApplication.class, args);
    }

}
