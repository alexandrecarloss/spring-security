package com.personal.spring_security.backend.controller.dto;

public record ResetPasswordDto(String token,
                               String newPassword) {
}
