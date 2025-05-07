package com.dirac.securityservice.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration has been moved to SecurityConfiguration.java to avoid conflicts.
 * This class is now deprecated and will be removed in a future release.
 */
// @Configuration  // Comentado para evitar conflictos de configuración
public class CorsConfig {

    // @Bean  // Comentado para evitar conflictos de configuración
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("*");
                        // .allowCredentials(true);
            }
        };
    }
}
