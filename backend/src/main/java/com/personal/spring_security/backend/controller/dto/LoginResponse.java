package com.personal.spring_security.backend.controller.dto;

public record LoginResponse(String accessToken, Long expiresIn) {
}
