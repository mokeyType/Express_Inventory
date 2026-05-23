package com.example.practice.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
public class healtCheck {

    @GetMapping("/")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("practice API is running");
    }

    @GetMapping("Health-check")
    public String check(){
        return "ok";
    }

    @GetMapping("favicon.ico")
    public ResponseEntity<Void> favicon() {
        return ResponseEntity.noContent().build();
    }
}
