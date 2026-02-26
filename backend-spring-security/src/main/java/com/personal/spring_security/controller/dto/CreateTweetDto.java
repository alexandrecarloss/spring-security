package com.personal.spring_security.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTweetDto(@NotBlank
                             @Size(max = 65000,
                                     message = "O tweet deve ter no máximo 65000 caracteres")
                             String content) {
}
