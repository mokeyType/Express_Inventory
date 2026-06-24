package com.example.practice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    private final String fromEmail;

    public EmailService(@Value("${spring.mail.username:}") String fromEmail){
        this.fromEmail = fromEmail;
    }

    public void sendWelcomeEmail(String toEmail, String name){
        if (mailSender == null) return; // no-op in tests or when mail is not configured

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Inventory App");
        message.setText("Hello " + name + ", your account was created successfully.");
        mailSender.send(message);
    }
}
