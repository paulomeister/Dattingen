package com.dirac.userservice;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/welcome")
public class WelcomeMessage {
    
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/message")
    public ResponseEntity<String> welcomeMessage() {
        return ResponseEntity.ok("Welcome to Dirac on 8083!");
    }

}
