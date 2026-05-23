package com.example.practice.exception;

public class WrongAuthProviderException extends RuntimeException {

    public WrongAuthProviderException(String message) {
        super(message);
    }
}