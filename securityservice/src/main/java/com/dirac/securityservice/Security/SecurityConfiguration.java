package com.dirac.securityservice.Security;

import com.dirac.securityservice.Security.JWT.CustomUsernameAndPasswordAuthenticationFilter;
import com.dirac.securityservice.Security.JWT.JwtConfigurationVariables;
import com.dirac.securityservice.Service.UsersRetrievalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;

import java.util.Arrays;
import java.util.List;

/**
 * SecurityConfiguration class is responsible for configuring the security settings of the application.
 * It sets up the authentication manager, password encoder, and JWT filter.
 * It also configures the HTTP security settings, including CSRF protection and session management.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final PasswordEncoder passwordEncoder;
    private final UsersRetrievalService usersRetrievalService;
    private final SecretKey secretKey;
    private final JwtConfigurationVariables jwtConfigurationVariables;

    @Autowired
    public SecurityConfiguration(PasswordEncoder passwordEncoder, UsersRetrievalService usersRetrievalService, SecretKey secretKey, JwtConfigurationVariables jwtConfigurationVariables) {
        this.passwordEncoder = passwordEncoder;
        this.usersRetrievalService = usersRetrievalService;
        this.secretKey = secretKey;
        this.jwtConfigurationVariables = jwtConfigurationVariables;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {


        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf((csrf) -> csrf.disable())
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilter(new CustomUsernameAndPasswordAuthenticationFilter(authenticationManager, jwtConfigurationVariables, secretKey))
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest()
                        .permitAll()

                );

        return http.build();

    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder
                .userDetailsService(usersRetrievalService)
                .passwordEncoder(passwordEncoder);

        return authenticationManagerBuilder.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000",  // Frontend URL
            "http://localhost:8090"   // API Gateway URL
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // Expose JWT header

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
