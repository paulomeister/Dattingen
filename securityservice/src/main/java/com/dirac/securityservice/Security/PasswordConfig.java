package com.dirac.securityservice.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration class that defines a {@link PasswordEncoder} bean for the application.
 * <p>
 * This setup uses {@link org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder},
 * a secure hashing algorithm that is well-suited for storing and verifying passwords.
 * </p>
 *
 * <p>
 * BCrypt is deliberately slow and computationally expensive, which makes it highly resistant to
 * brute-force attacks. The strength parameter controls the cost factor; here, a value of 10 is
 * used, providing a good balance between security and performance.
 * </p>
 *
 * <p>
 * This bean can be injected wherever password hashing or comparison is needed,
 * such as in authentication logic or user registration flows.
 * </p>
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder(10);

    }


}
