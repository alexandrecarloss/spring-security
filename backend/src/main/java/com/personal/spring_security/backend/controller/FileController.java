package com.personal.spring_security.backend.controller;

import com.personal.spring_security.backend.services.FileService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/file")
public class FileController {
    private final FileService fileService;
    private final String uploadDir = "uploads/profiles/";

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<String> uploadFileHandler(@RequestPart MultipartFile file) throws IOException {
        String uploadedFileName = fileService.uploadFile(uploadDir, file);
        return ResponseEntity.ok("File uploaded: " + uploadedFileName);
    }

    @GetMapping("/{fileName}")
    public void serveFileHandler(@PathVariable String fileName, HttpServletResponse response) throws IOException {
        try {
            InputStream resourceFile = fileService.getResourceFile(fileName);
            response.setContentType(MediaType.IMAGE_PNG_VALUE);

            StreamUtils.copy(resourceFile, response.getOutputStream());
        } catch (FileNotFoundException e) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
