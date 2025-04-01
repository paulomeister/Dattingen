package com.dirac.businessservice;

import org.springframework.boot.SpringApplication;

public class TestBusinessserviceApplication {

    public static void main(String[] args) {
        SpringApplication.from(BusinessserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
