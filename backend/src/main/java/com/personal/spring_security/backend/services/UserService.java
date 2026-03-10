package com.personal.spring_security.backend.services;

import com.personal.spring_security.backend.controller.dto.CreateUserDto;
import com.personal.spring_security.backend.controller.dto.UpdateUserDto;
import com.personal.spring_security.backend.controller.dto.UserResponseDto;
import com.personal.spring_security.backend.entities.Role;
import com.personal.spring_security.backend.entities.User;
import com.personal.spring_security.backend.infrastructure.exceptions.UnprocessableEntityException;
import com.personal.spring_security.backend.repository.RoleRepository;
import com.personal.spring_security.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final FileService fileService;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       BCryptPasswordEncoder passwordEncoder, FileService fileService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
    }

    @Transactional
    public User createUser(CreateUserDto dto, MultipartFile file) {

        userRepository.findByEmail(dto.email()).ifPresent(user -> {
            if (user.getPassword() == null) {
                throw new UnprocessableEntityException("Este e-mail está vinculado ao login pelo Google. Use o botão 'Entrar com Google'.");
            }
            throw new UnprocessableEntityException("Este e-mail já está cadastrado.");
        });

        var basicRole = roleRepository.findByName(Role.Values.BASIC.name());

        var user = new User();
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setFullName(dto.fullName());
        user.setRoles(Set.of(basicRole));

        User newUser = userRepository.save(user);

        if (file != null && !file.isEmpty()) {
            uploadProfilePicture(newUser.getId(), file);
        }

        return newUser;
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
    public void updateUser(UUID id, UpdateUserDto dto, MultipartFile file) {
        User user = findEntityById(id);

        user.setFullName(dto.fullName());
        if (file != null && !file.isEmpty()) {
            if (user.getPictureUrl() != null) {
                fileService.deleteOldFile(user.getPictureUrl());
            }
            String fileName = fileService.saveFile(id, file);
            user.setPictureUrl(fileName);
        }

        userRepository.save(user);
    }

    @Transactional
    public void deleteById(UUID id) {
        User user = findEntityById(id);
        userRepository.delete(user);
    }

    @Transactional
    public void uploadProfilePicture(UUID id, MultipartFile file) {
        User user = findEntityById(id);
        String fileUrl = fileService.saveFile(id, file);

        user.setPictureUrl(fileUrl);
        userRepository.save(user);
    }
}
