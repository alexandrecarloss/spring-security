package com.personal.spring_security.config;

import com.personal.spring_security.entities.Role;
import com.personal.spring_security.entities.User;
import com.personal.spring_security.repository.RoleRepository;
import com.personal.spring_security.repository.UserRepository;
import com.personal.spring_security.services.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Slf4j
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    public OAuth2LoginSuccessHandler(UserRepository userRepository,
                                     RoleRepository roleRepository,
                                     JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        log.info("### INICIANDO SUCESSO OAUTH2 ###");
        var principal = authentication.getPrincipal();
        String email;
        String fullName;
        String picture;

        if (principal instanceof org.springframework.security.oauth2.core.oidc.user.OidcUser oidcUser) {
            email = oidcUser.getEmail();
            fullName = oidcUser.getFullName();
            picture = oidcUser.getPicture();
        } else if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
            fullName = oauth2User.getAttribute("name");
            picture = oauth2User.getAttribute("picture");
        } else {
            throw new ServletException("Tipo de usuário não suportado");
        }

        log.debug("Processando login para email: {}", email);
        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    log.info("Usuário {} já existe no banco. Atualizando URL da foto.", email);
                    existingUser.setPictureUrl(picture);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    log.warn("Usuário {} não encontrado. Criando novo registro via Provisionamento Automático.", email);
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(fullName);
                    newUser.setPictureUrl(picture);

                    // Busca a role e garante que ela existe
                    var roleName = Role.Values.BASIC.name();
                    var basicRole = roleRepository.findByName(roleName);

                    if (basicRole == null) {
                        log.error("ERRO FATAL: Role {} não encontrada na tabela tb_roles!", roleName);
                        throw new RuntimeException("Configuração de sistema inválida.");
                    }

                    newUser.setRoles(Set.of(basicRole));
                    User saved = userRepository.save(newUser);
                    log.info("Novo usuário salvo com ID: {}", saved.getId());
                    return saved;
                });

        log.info("Solicitando geração de token JWT para o usuário: {}", user.getEmail());
        String token = jwtService.generateToken(user);

        log.info("JWT Gerado com sucesso. Redirecionando para o Frontend.");
        response.sendRedirect("http://localhost:5173/login-success?token=" + token);
    }
}
