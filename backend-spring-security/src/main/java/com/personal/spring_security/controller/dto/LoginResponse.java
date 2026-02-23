package com.personal.spring_security.controller.dto;

public record LoginResponse(String accesToken, Long expiresIn) {
}
