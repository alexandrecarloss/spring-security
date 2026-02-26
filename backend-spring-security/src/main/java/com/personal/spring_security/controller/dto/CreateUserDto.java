package com.personal.spring_security.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserDto(@NotBlank
                            @Size(min = 3, max = 100,
                            message = "O e-mail deve ter no mínimo 3 e no máximo 100 caracteres")
                            @Email
                            String email,
                            @Size(min = 3,
                                    max = 50,
                                    message = "A senha deve ter no mínimo 3 e no máximo 50 caracteres")
                            @NotBlank String password,
                            @Size(min = 3,
                                    max = 100,
                                    message = "O nome deve ter no mínimo 3 e no máximo 100 caracteres")
                            String fullName) {
}
