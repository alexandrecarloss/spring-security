package com.personal.spring_security.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.personal.spring_security.backend.controller.dto.CreateUserDto;
import com.personal.spring_security.backend.controller.dto.UpdateUserDto;
import com.personal.spring_security.backend.controller.dto.UserResponseDto;
import com.personal.spring_security.backend.entities.User;
import com.personal.spring_security.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.swing.*;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<UserResponseDto> newUser(
            @RequestPart("data") @Valid String dtoString,
            @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException {
        CreateUserDto dto = convertToCreateUserDto(dtoString);
        User user = userService.createUser(dto, file);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(user.getId())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    private CreateUserDto convertToCreateUserDto(String CreateUserDtoObj ) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(CreateUserDtoObj, CreateUserDto.class);
    }

    private UpdateUserDto convertToUpdateUserDto(String UpdateUserDtoObj ) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(UpdateUserDtoObj, UpdateUserDto.class);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<UserResponseDto>> listUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_BASIC') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
        public ResponseEntity<Void> updateUser(
                @PathVariable UUID id,
                @RequestPart("data") String dtoString,
                @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException {
        UpdateUserDto dto = convertToUpdateUserDto(dtoString);
        userService.updateUser(id, dto, file);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upload-foto")
    @PreAuthorize("hasAuthority('SCOPE_BASIC') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> uploadFoto(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        userService.uploadProfilePicture(id, file);
        return ResponseEntity.noContent().build();
    }
}