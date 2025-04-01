package com.dirac.auditprocessservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class AuditprocessserviceApplicationTests {

    @Test
    void contextLoads() {
    }

}
