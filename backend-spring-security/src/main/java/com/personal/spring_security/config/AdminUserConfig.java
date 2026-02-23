package com.personal.spring_security.config;

import com.personal.spring_security.entities.Role;
import com.personal.spring_security.entities.User;
import com.personal.spring_security.repository.RoleRepository;
import com.personal.spring_security.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;
@Slf4j
@Configuration
public class AdminUserConfig implements CommandLineRunner {

    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;

    public AdminUserConfig(RoleRepository roleRepository,
                           UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("### VERIFICANDO CONFIGURAÇÕES INICIAIS DO SISTEMA ###");
        var roleAdmin = roleRepository.findByName(Role.Values.ADMIN.name());
        if (roleAdmin == null) {
            log.error("AVISO: Role ADMIN não encontrada. Certifique-se que o banco foi populado corretamente.");
        }

        userRepository.findByEmail("admin@gmail.com").ifPresentOrElse(
                (user) -> log.info("Configuração Admin: Usuário 'admin@gmail.com' já existe."),
                () -> {
                    log.info("Configuração Admin: Criando usuário administrador padrão...");
                    var user = new User();
                    user.setEmail("admin@gmail.com");
                    user.setPassword(passwordEncoder.encode("123"));
                    user.setRoles(Set.of(roleAdmin));
                    userRepository.save(user);
                    log.info("Configuração Admin: Usuário 'admin@gmail.com' criado com sucesso.");
                }
        );
    }
}
