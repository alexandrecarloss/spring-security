package com.personal.spring_security.controller.dto;

public record ResetPasswordDto(String token,
                               String newPassword) {
}
