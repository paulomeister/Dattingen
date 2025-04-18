// package com.dirac.userservice.config;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;
// import java.util.Collections;

// public class JwtHeaderFilter extends OncePerRequestFilter {

//     @Override
//     protected void doFilterInternal(
//         HttpServletRequest request,
//         HttpServletResponse response,
//         FilterChain filterChain
//     ) throws ServletException, IOException {

//         String authHeader = request.getHeader("Authorization");

//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//             response.getWriter().write("Missing or invalid Authorization header.");
//             return;
//         }

//         // Aquí simulamos que el usuario está autenticado
//         UsernamePasswordAuthenticationToken authentication =
//                 new UsernamePasswordAuthenticationToken(
//                         "mockUser", // Puedes poner el username real si extraes del token
//                         null,
//                         Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
//                 );

//         SecurityContextHolder.getContext().setAuthentication(authentication);

//         filterChain.doFilter(request, response);
//     }
// }
