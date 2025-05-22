package com.dirac.securityservice.Security.Logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class LoggingSecurityFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(LoggingSecurityFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Get authentication information if available
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";

        // Add request information to MDC for logging
        try {
            MDC.put("username", username);
            MDC.put("requestId", UUID.randomUUID().toString());
            MDC.put("remoteAddr", request.getRemoteAddr());
            MDC.put("requestPath", request.getRequestURI());
            MDC.put("requestMethod", request.getMethod());

            log.info("Received request: {} {}", request.getMethod(), request.getRequestURI());

            filterChain.doFilter(request, response);
        } finally {
            // Log completion with status code
            log.info("Request completed: {} {} - Status: {}",
                    request.getMethod(), request.getRequestURI(), response.getStatus());

            // Clear the MDC context after the request
            MDC.clear();
        }
    }
}
