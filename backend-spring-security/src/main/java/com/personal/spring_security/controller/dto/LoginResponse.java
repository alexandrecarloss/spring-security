package com.personal.spring_security.controller.dto;

public record LoginResponse(String accessToken, Long expiresIn) {
}
