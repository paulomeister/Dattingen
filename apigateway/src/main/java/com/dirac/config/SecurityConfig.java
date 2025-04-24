// package com.dirac.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.config.web.server.ServerHttpSecurity;
// import org.springframework.security.web.server.SecurityWebFilterChain;
// import org.springframework.web.server.ServerWebExchange;
// import org.springframework.web.server.WebFilter;
// import org.springframework.web.server.WebFilterChain;

// public class SecurityConfig {
//     @Bean
//     public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) throws Exception {
//         http.authorizeExchange()
//         .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//         .pathMatchers(HttpMethod.POST, "/**").permitAll()
//         .and().csrf().disable();

//         return http.build();
//     }

//     @Bean
//     public WebFilter corsFilter(){
//         return (ServerWebExchange ctx, WebFilterChain chain) -> {
//             ctx.getResponse().getHeaders().add("Access-Control-Allow-Origin", "*");
//             ctx.getResponse().getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//             ctx.getResponse().getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
//             return chain.filter(ctx);
//         };
//     }
// }
