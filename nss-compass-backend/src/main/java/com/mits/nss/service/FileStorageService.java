package com.mits.nss.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * Stores the given file under a sub-folder (e.g. "banners", "reports", "gallery")
     * and returns a public URL path like "/uploads/banners/xxx.jpg".
     */
    public String store(MultipartFile file, String subFolder) {
        if (file == null || file.isEmpty()) return null;
        try {
            String original = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
            String ext = "";
            int dot = original.lastIndexOf('.');
            if (dot >= 0) ext = original.substring(dot);
            String filename = UUID.randomUUID() + ext;

            Path targetDir = Paths.get(uploadDir, subFolder).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            Path targetFile = targetDir.resolve(filename);
            file.transferTo(targetFile);

            return "/uploads/" + subFolder + "/" + filename;
        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new RuntimeException("Failed to store uploaded file: " + e.getMessage(), e);
        }
    }
}
