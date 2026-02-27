package com.personal.spring_security.services;

import com.personal.spring_security.entities.PasswordResetToken;
import com.personal.spring_security.entities.User;
import com.personal.spring_security.repository.PasswordResetTokenRepository;
import com.personal.spring_security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public String createToken(String email) {
        log.info("Solicitação de token de recuperação recebida para o e-mail: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Tentativa de recuperação para e-mail inexistente: {}", email);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "E-mail não encontrado");
                });

        log.debug("Limpando tokens antigos para o usuário ID: {}", user.getId());
        tokenRepository.deleteByUser(user);
        tokenRepository.flush();

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        tokenRepository.save(resetToken);
        log.info("Novo token gerado e salvo para o usuário: {}", email);

        String link = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendRecoveryEmail(user.getEmail(), link);

        return token;
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Tentativa de redefinição de senha com token.");

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    log.error("Tentativa de reset com token inválido: {}", token);
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido");
                });

        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            log.warn("Token expirado utilizado pelo usuário ID: {}", resetToken.getUser().getId());
            tokenRepository.delete(resetToken);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expirado");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Senha alterada com sucesso para o usuário: {}", user.getEmail());

        tokenRepository.delete(resetToken);
        log.debug("Token de recuperação removido após uso bem-sucedido.");
    }
}