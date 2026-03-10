package com.personal.spring_security.backend.controller.dto;

import jakarta.validation.constraints.Size;

public record UpdateUserDto(@Size(min = 3,
        max = 100,
        message = "O nome deve ter no mínimo 3 e no máximo 100 caracteres")
                            String fullName) {
}
