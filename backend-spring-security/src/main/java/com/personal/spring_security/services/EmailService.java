package com.personal.spring_security.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendRecoveryEmail(String to, String recoveryLink) {
        log.info("Iniciando processo de envio de e-mail de recuperação para: {}", to);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("🔒 Redefinição de Senha - Seu App");

            // Template HTML mais elegante
            String content = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #081b29;">Olá!</h2>
                    <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
                    <p>Clique no botão abaixo para escolher uma nova senha. <b>Este link é válido por 15 minutos.</b></p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #0ef; color: #081b29; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Redefinir Minha Senha
                        </a>
                    </div>
                    <p style="font-size: 0.8em; color: #666;">Se você não solicitou essa alteração, por favor ignore este e-mail.</p>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p style="font-size: 0.8em; color: #999;">Equipe de Segurança - Spring App</p>
                </div>
                """.formatted(recoveryLink);

            helper.setText(content, true);
            mailSender.send(message);

            log.info("E-mail enviado com sucesso para o endereço: {}", to);

        } catch (MessagingException e) {
            log.error("FALHA CRÍTICA: Não foi possível enviar o e-mail para {}. Erro: {}", to, e.getMessage());
            throw new RuntimeException("Erro ao processar o disparo do e-mail.");
        }
    }
}