package com.dirac.rulesetservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/welcome")
public class WelcomeMessage {
    
    @GetMapping("/message")
    public ResponseEntity<String> welcomeMessage() {
        return ResponseEntity.ok("Welcome to Dirac on 8082!");
    }

}
