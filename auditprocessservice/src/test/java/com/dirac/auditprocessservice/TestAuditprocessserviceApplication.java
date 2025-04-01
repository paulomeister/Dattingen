package com.dirac.auditprocessservice;

import org.springframework.boot.SpringApplication;

public class TestAuditprocessserviceApplication {

    public static void main(String[] args) {
        SpringApplication.from(AuditprocessserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
