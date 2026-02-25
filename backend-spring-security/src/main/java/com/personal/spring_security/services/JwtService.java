package com.personal.spring_security.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.personal.spring_security.entities.Role;
import com.personal.spring_security.entities.User;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import java.time.Instant;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    public JwtService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateToken(User user) {
        log.debug("Gerando claims para o Subject ID: {}", user.getId());
        var now = Instant.now();
        var expiresIn = 300L; // 5 minutos

        var scopes = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.joining(" "));

        log.debug("Permissões (scopes) atribuídas ao token: [{}]", scopes);
        var builder = JwtClaimsSet.builder()
                .issuer("mybackend")
                .subject(user.getId().toString())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresIn))
                .claim("scope", scopes);

        if (user.getPictureUrl() != null) {
            builder.claim("picture", user.getPictureUrl());
        }

        var claims = builder.build();

        String tokenValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        log.info("Token JWT assinado com sucesso para o usuário: {}", user.getEmail());
        return tokenValue;
    }
}