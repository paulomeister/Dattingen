package com.dirac.rulesetservice;

import org.springframework.boot.SpringApplication;

public class TestRulesetserviceApplication {

    public static void main(String[] args) {
        SpringApplication.from(RulesetserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
