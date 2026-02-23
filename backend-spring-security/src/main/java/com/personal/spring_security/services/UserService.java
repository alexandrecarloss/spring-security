package com.personal.spring_security.services;

import com.personal.spring_security.controller.dto.CreateUserDto;
import com.personal.spring_security.controller.dto.UserResponseDto;
import com.personal.spring_security.entities.Role;
import com.personal.spring_security.entities.User;
import com.personal.spring_security.repository.RoleRepository;
import com.personal.spring_security.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createUser(CreateUserDto dto) {
        userRepository.findByEmail(dto.email()).ifPresent(user -> {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Email already exists");
        });

        var basicRole = roleRepository.findByName(Role.Values.BASIC.name());

        var user = new User();
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setFullName(dto.fullName());
        user.setRoles(Set.of(basicRole));

        userRepository.save(user);
    }

    private User findEntityById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public List<UserResponseDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDto::fromEntity)
                .toList();
    }

    public UserResponseDto findById(UUID id) {
        return UserResponseDto.fromEntity(findEntityById(id));
    }

    @Transactional
    public void updateUser(UUID id, CreateUserDto dto) {
        User user = findEntityById(id);

        user.setFullName(dto.fullName());
        if (dto.password() != null && !dto.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.password()));
        }

        userRepository.save(user);
    }

    @Transactional
    public void deleteById(UUID id) {
        User user = findEntityById(id);
        userRepository.delete(user);
    }
}
