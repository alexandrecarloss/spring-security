package com.personal.spring_security.controller.dto;

import com.personal.spring_security.entities.Role;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record UserResponseDto(
        UUID userId,
        String email,
        String fullName,
        String pictureUrl,
        Set<String> roles
) {

    public static UserResponseDto fromEntity(com.personal.spring_security.entities.User user) {
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPictureUrl(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }
}