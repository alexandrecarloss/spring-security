package com.personal.spring_security.controller;

import com.personal.spring_security.controller.dto.ForgotPasswordDto;
import com.personal.spring_security.controller.dto.ResetPasswordDto;
import com.personal.spring_security.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService resetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordDto dto) {
        String token = resetService.createToken(dto.email());

        // Simulação de envio de e-mail (O link que o front usará)
        String recoveryLink = "http://localhost:5173/reset-password?token=" + token;

        System.out.println("\n==========================================");
        System.out.println("LINK DE RECUPERAÇÃO: " + recoveryLink);
        System.out.println("==========================================\n");

        return ResponseEntity.ok("Se o e-mail existir, um link de recuperação foi enviado ao console.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordDto dto) {
        resetService.resetPassword(dto.token(), dto.newPassword());
        return ResponseEntity.noContent().build();
    }
}
