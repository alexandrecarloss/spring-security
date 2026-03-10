package com.personal.spring_security.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {

    private final String uploadDir = "uploads/profiles/";

    public String uploadFile(String path, MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null) throw new IOException("Nome do arquivo é nulo");
            Path directoryPath = Paths.get(path);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            Path targetPath = directoryPath.resolve(originalFileName);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return originalFileName;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Falha ao salvar o arquivo: " + e.getMessage());
        }
    }

    public InputStream getResourceFile(String fileName) throws FileNotFoundException {
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        File file = filePath.toFile();

        if (!file.exists()) {
            throw new FileNotFoundException("Arquivo não encontrado: " + fileName);
        }
        return new FileInputStream(file);
    }

    public String saveFile(UUID userId, MultipartFile file) {
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("Arquivo muito grande! Limite de 10MB.");
        }
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            String originalName = file.getOriginalFilename().replace(" ", "_");
            String fileName = userId.toString() + "_" + originalName;
            Path targetPath = path.resolve(fileName);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar o arquivo: " + e.getMessage());
        }
    }

    public void deleteOldFile(String fileName) {
        try {
            if (fileName != null && !fileName.startsWith("http")) {
                Path path = Paths.get(uploadDir).resolve(fileName);
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            System.err.println("Não foi possível deletar arquivo antigo: " + fileName);
        }
    }
}