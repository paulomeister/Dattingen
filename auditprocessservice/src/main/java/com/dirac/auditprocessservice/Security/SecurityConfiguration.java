package com.dirac.auditprocessservice.Security;

import com.dirac.auditprocessservice.Security.JWT.JwtConfigurationVariables;
import com.dirac.auditprocessservice.Security.JWT.JwtTokenVerifier;
import com.dirac.auditprocessservice.Security.Logging.LoggingSecurityFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final SecretKey secretKey;
    private final JwtConfigurationVariables jwtConfigurationVariables;
    @Value("${application.origins.url}")
    private String origins;

    public SecurityConfiguration(SecretKey secretKey, JwtConfigurationVariables jwtConfigurationVariables) {
        this.secretKey = secretKey;
        this.jwtConfigurationVariables = jwtConfigurationVariables;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf((csrf) -> csrf.disable())
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtTokenVerifier(secretKey, jwtConfigurationVariables), UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(new LoggingSecurityFilter(), JwtTokenVerifier.class)
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest()
                        .permitAll()

                );

        return http.build();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        if (origins != null && !origins.isBlank()) {
            configuration.setAllowedOrigins(Arrays.asList(origins.split(",")));
        } else {
            configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://apigateway:8090"));
        }
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type", "Content-Length", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization")); // Expose JWT header

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
